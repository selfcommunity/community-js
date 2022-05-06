import {
  StartEventResponse,
  useChunkFinishListener,
  useChunkStartListener,
  useItemErrorListener,
  useItemFinishListener,
  useRequestPreSend
} from '@rpldy/chunked-uploady';
import {http, Endpoints, formatHttpError} from '@selfcommunity/api-services';
import {SCContextType, SCPrivateMessageFileType, useSCContext} from '@selfcommunity/react-core';
import {useItemProgressListener, useItemStartListener} from '@rpldy/uploady';
import {AxiosResponse} from 'axios';
import React, {useEffect, useRef, useState} from 'react';
import {SCMessageChunkType} from '../../types/media';
import {useIntl} from 'react-intl';
import messages from '../../messages/common';

export interface MessageChunkUploaderProps {
  /**
   * Chunk type
   * @default null
   */
  type?: string | null;
  /**
   * Handles on progress
   * @default null
   */
  onStart: (type: any) => void;
  /**
   * Handles on success
   * @default null
   */
  onSuccess: (media: SCPrivateMessageFileType) => void;
  /**
   * Handles on progress
   * @default null
   */
  onProgress: (chunks: any) => void;
  /**
   * Handles on error
   * @default null
   */
  onError?: (chunk: SCMessageChunkType, error: string) => void;
}
export default (props: MessageChunkUploaderProps): JSX.Element => {
  // PROPS
  const {type = null, onSuccess = null, onProgress = null, onError = null, onStart = null} = props;

  // REFS
  const firstRender = useRef<boolean>(true);

  // STATE
  const [chunks, setChunks] = useState({});
  const setChunk: Function = (chunk: SCMessageChunkType) => {
    setChunks({...chunks, [chunk.id]: {...chunks[chunk.id], ...chunk}});
  };

  // Using refs to have the correct chunks values in the callbacks
  // https://stackoverflow.com/questions/57847594/react-hooks-accessing-up-to-date-state-from-within-a-callback
  const chunkStateRef = React.useRef({chunks, setChunk, setChunks});
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
    onStart(item.file.type);
    if (item.file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = (e) => {
        chunkStateRef.current.setChunk({id: item.id, url: e.target.result});
      };
      // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
      // @ts-ignore
      reader.readAsDataURL(item.file);
    }
    chunkStateRef.current.setChunk({id: item.id, [`file_uuid`]: null, completed: 0, filename: item.file.name, [`qqtotalparts`]: null});
  });

  useItemProgressListener((item) => {
    chunkStateRef.current.setChunk({id: item.id, completed: item.completed});
  });

  useItemFinishListener((item) => {
    if (item.file.size < 10485760) {
      const _chunks = {...chunkStateRef.current.chunks};
      delete _chunks[item.id];
      chunkStateRef.current.setChunks(_chunks);
      onSuccess(item.uploadResponse.results[0].data);
    } else {
      const formData = new FormData();
      formData.append('qquuid', chunkStateRef.current.chunks[item.id].file_uuid);
      formData.append('qqfilename', chunkStateRef.current.chunks[item.id].filename);
      formData.append('qqtotalparts', chunkStateRef.current.chunks[item.id].qqtotalparts);
      http
        .request({
          url: Endpoints.PrivateMessageChunkUploadDone.url(),
          method: Endpoints.PrivateMessageChunkUploadDone.method,
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
    }
  });

  useItemErrorListener((item) => {
    onError({...chunkStateRef.current.chunks[item.id]}, intl.formatMessage(messages.error));
    const _chunks = {...chunkStateRef.current.chunks};
    delete _chunks[item.id];
    chunkStateRef.current.setChunks(_chunks);
  });

  useChunkStartListener((data): StartEventResponse => {
    // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
    // @ts-ignore
    chunkStateRef.current.setChunk({id: data.item.id, [`qqpartindex`]: data.chunk.index});
    chunkStateRef.current.setChunk({id: data.item.id, [`qqtotalparts`]: data.totalCount});
    const res: StartEventResponse = {
      url: `${scContext.settings.portal}${Endpoints.PrivateMessageUploadMediaInChunks.url()}`,
      sendOptions: {
        paramName: 'qqfile',
        headers: {Authorization: `Bearer ${scContext.settings.session.authToken.accessToken}`},
        method: Endpoints.PrivateMessageUploadMediaInChunks.method
      }
    };
    if (data.totalCount > 1) {
      res.sendOptions.params = {
        // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
        // @ts-ignore
        qqpartindex: data.chunkIndex,
        qqtotalparts: data.totalCount
      };
    }
    if (chunkStateRef.current.chunks[data.item.id].file_uuid && data.totalCount > 1) {
      res.sendOptions.params = {
        [`qquuid`]: chunkStateRef.current.chunks[data.item.id].file_uuid,
        [`qqtotalparts`]: chunkStateRef.current.chunks[data.item.id].qqtotalparts,
        [`qqpartindex`]: chunkStateRef.current.chunks[data.item.id].qqpartindex
      };
    } else {
      chunkStateRef.current.setChunk({id: data.item.id, type: type || data.sendOptions.paramName});
    }
    return res;
  });

  useChunkFinishListener((data) => {
    chunkStateRef.current.setChunk({id: data.item.id, [`file_uuid`]: data.uploadData.response.data.file_uuid});
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
