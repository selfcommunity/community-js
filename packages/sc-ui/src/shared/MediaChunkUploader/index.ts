import {
  StartEventResponse,
  useChunkFinishListener,
  useChunkStartListener,
  useItemErrorListener,
  useItemFinishListener,
  useRequestPreSend
} from '@rpldy/chunked-uploady';
import {Endpoints, formatHttpError, http, SCContext, SCContextType, SCMediaType} from '@selfcommunity/core';
import {useItemProgressListener, useItemStartListener} from '@rpldy/uploady';
import {AxiosResponse} from 'axios';
import {md5} from '../../utils/hash';
import React, {useContext, useEffect, useState} from 'react';
import {SCMediaChunkType} from '../../types/media';
import {useIntl} from 'react-intl';
import messages from '../../messages/common';

export default ({
  type = null,
  onSuccess = null,
  onProgress = null,
  onError = null
}: {
  type?: string | null;
  onSuccess: (media: SCMediaType) => void;
  onProgress: (chunks: any) => void;
  onError: (chunk: SCMediaChunkType, error: string) => void;
}): JSX.Element => {
  // State
  const [chunks, setChunks] = useState({});
  const setChunk: Function = (chunk: SCMediaChunkType) => {
    setChunks({...chunks, [chunk.id]: {...chunks[chunk.id], ...chunk}});
  };

  // Using refs to have the correct chunks values in the callbacks
  // https://stackoverflow.com/questions/57847594/react-hooks-accessing-up-to-date-state-from-within-a-callback
  const chunkStateRef = React.useRef({chunks, setChunk, setChunks});
  chunkStateRef.current = {chunks, setChunk, setChunks};

  // Context
  const scContext: SCContextType = useContext(SCContext);

  // INTL
  const intl = useIntl();

  // component update
  useEffect(() => {
    onProgress && onProgress(chunks);
  }, [chunks]);

  // Listeners
  useItemStartListener((item) => {
    if (item.file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = (e) => {
        chunkStateRef.current.setChunk({id: item.id, image: e.target.result});
      };
      // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
      // @ts-ignore
      reader.readAsDataURL(item.file);
    }
    chunkStateRef.current.setChunk({id: item.id, [`upload_id`]: null, completed: 0, name: item.file.name});
  });

  useItemProgressListener((item) => {
    chunkStateRef.current.setChunk({id: item.id, completed: item.completed});
  });

  useItemFinishListener((item) => {
    md5(item.file, 2142880, (hash) => {
      const formData = new FormData();
      formData.append('upload_id', chunkStateRef.current.chunks[item.id].upload_id);
      formData.append('type', chunkStateRef.current.chunks[item.id].type);
      formData.append('md5', hash);
      http
        .request({
          url: Endpoints.ComposerChunkUploadMediaComplete.url(),
          method: Endpoints.ComposerChunkUploadMediaComplete.method,
          data: formData,
          headers: {'Content-Type': 'multipart/form-data'}
        })
        .then((res: AxiosResponse<any>) => {
          const _chunks = {...chunkStateRef.current.chunks};
          delete _chunks[item.id];
          chunkStateRef.current.setChunks(_chunks);
          onSuccess(res.data);
        })
        .catch((error) => {
          error = formatHttpError(error);
          onError({...chunkStateRef.current.chunks[item.id]}, error.error);
          const _chunks = {...chunkStateRef.current.chunks};
          delete _chunks[item.id];
          chunkStateRef.current.setChunks(_chunks);
        });
    });
  });

  useItemErrorListener((item) => {
    onError({...chunkStateRef.current.chunks[item.id]}, intl.formatMessage(messages.error));
    const _chunks = {...chunkStateRef.current.chunks};
    delete _chunks[item.id];
    chunkStateRef.current.setChunks(_chunks);
  });

  useChunkStartListener((data): StartEventResponse => {
    const res: StartEventResponse = {
      url: `${scContext.settings.portal}${Endpoints.ComposerChunkUploadMedia.url()}`,
      sendOptions: {
        paramName: 'image',
        headers: {Authorization: `Bearer ${scContext.settings.session.authToken.accessToken}`},
        method: Endpoints.ComposerChunkUploadMedia.method
      }
    };
    if (chunkStateRef.current.chunks[data.item.id].upload_id) {
      res.sendOptions.params = {[`upload_id`]: chunkStateRef.current.chunks[data.item.id].upload_id};
    } else {
      chunkStateRef.current.setChunk({id: data.item.id, type: type || data.sendOptions.paramName});
    }
    return res;
  });

  useChunkFinishListener((data) => {
    chunkStateRef.current.setChunk({id: data.item.id, [`upload_id`]: data.uploadData.response.data.upload_id});
  });

  useRequestPreSend(({items, options}) => {
    if (items.length == 0) {
      return Promise.resolve({options});
    }
    //returned object can be wrapped with a promise
    return Promise.resolve({
      options: {
        inputFieldName: options.inputFieldName
      }
    });
  });

  return null;
};
