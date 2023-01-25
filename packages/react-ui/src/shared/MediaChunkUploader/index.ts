import {
  StartEventResponse,
  useChunkFinishListener,
  useChunkStartListener,
  useItemErrorListener,
  useItemFinishListener,
  useRequestPreSend
} from '@rpldy/chunked-uploady';
import {http, Endpoints, formatHttpError, HttpResponse} from '@selfcommunity/api-services';
import {SCMediaType} from '@selfcommunity/types';
import {SCContextType, useSCContext} from '@selfcommunity/react-core';
import {useItemProgressListener, useItemStartListener} from '@rpldy/uploady';
import {md5} from '../../utils/hash';
import React, {useEffect, useRef, useState} from 'react';
import {SCMediaChunkType} from '../../types/media';
import {useIntl} from 'react-intl';
import messages from '../../messages/common';

export interface MediaChunkUploaderProps {
  /**
   * Chunk type
   * @default null
   */
  type?: string | null;
  /**
   * Handles on success
   * @default null
   */
  onSuccess: (media: SCMediaType) => void;
  /**
   * Handles on progress
   * @default null
   */
  onProgress: (chunks: any) => void;
  /**
   * Handles on error
   * @default null
   */
  onError: (chunk: SCMediaChunkType, error: string) => void;
}
export default (props: MediaChunkUploaderProps): JSX.Element => {
  // PROPS
  const {type = null, onSuccess = null, onProgress = null, onError = null} = props;

  // REFS
  const firstRender = useRef<boolean>(true);
  const chunkStateRef = React.useRef({chunks: {}, setChunk: null, setChunks: null});

  // STATE
  const [chunks, setChunks] = useState({});
  const setChunk: Function = (chunk: SCMediaChunkType) => {
    const _chunks = {...chunkStateRef.current.chunks, [chunk.id]: {...chunkStateRef.current.chunks[chunk.id], ...chunk}};
    setChunks(_chunks);
    chunkStateRef.current.chunks = _chunks;
  };

  // Using refs to have the correct chunks values in the callbacks
  // https://stackoverflow.com/questions/57847594/react-hooks-accessing-up-to-date-state-from-within-a-callback
  chunkStateRef.current = {chunks, setChunk, setChunks};

  // CONTEXT
  const scContext: SCContextType = useSCContext();

  // INTL
  const intl = useIntl();

  // component update
  useEffect(() => {
    if (firstRender.current) {
      firstRender.current = false;
      return;
    }
    onProgress && onProgress(chunks);
  }, [chunks]);

  // LISTENERS
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
        .then((res: HttpResponse<any>) => {
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
