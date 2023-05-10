import {
  BatchItem,
  StartEventResponse,
  useChunkFinishListener,
  useChunkStartListener,
  useItemErrorListener,
  useItemFinishListener,
  useRequestPreSend
} from '@rpldy/chunked-uploady';
import {http, Endpoints, formatHttpError, HttpResponse} from '@selfcommunity/api-services';
import {SCMessageFileType, SCPrivateMessageFileType} from '@selfcommunity/types';
import {SCContextType, useSCContext} from '@selfcommunity/react-core';
import {useItemProgressListener, useItemStartListener} from '@rpldy/uploady';
import React, {useEffect, useRef, useState} from 'react';
import {SCMessageChunkType} from '../../types/media';
import {useIntl} from 'react-intl';
import messages from '../../messages/common';
import {createThumbnail, createVideoThumbnail, pdfToJpeg} from '../../utils/thumbnailCoverter';
import {SCOPE_SC_UI} from '../../constants/Errors';
import {Logger} from '@selfcommunity/utils';

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
  onStart: (item: any) => void;
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
  const chunkStateRef = React.useRef({chunks: {}, setChunk: null, setChunks: null});

  // STATE
  const [chunks, setChunks] = useState({});
  const setChunk: Function = (chunk: SCMessageChunkType) => {
    const _chunks = {...chunks, [chunk.id]: {...chunks[chunk.id], ...chunk}};
    setChunks(_chunks);
    chunkStateRef.current.chunks = _chunks;
  };
  const isImageType = (type) => {
    return type.startsWith(SCMessageFileType.IMAGE);
  };
  // HOOKS
  const intl = useIntl();

  // Using refs to have the correct chunks values in the callbacks
  // https://stackoverflow.com/questions/57847594/react-hooks-accessing-up-to-date-state-from-within-a-callback
  chunkStateRef.current = {chunks, setChunk, setChunks};

  // CONTEXT
  const scContext: SCContextType = useSCContext();

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
    onStart(item);
    if (item.file.type.startsWith(SCMessageFileType.IMAGE)) {
      const reader = new FileReader();
      reader.onload = (e) => {
        chunkStateRef.current.setChunk({id: item.id, file_url: e.target.result});
      };
      // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
      // @ts-ignore
      reader.readAsDataURL(item.file);
    }
    chunkStateRef.current.setChunk({id: item.id, file_uuid: null, completed: 0, filename: item.file.name, totalparts: null});
  });

  useItemProgressListener((item) => {
    chunkStateRef.current.setChunk({id: item.id, completed: item.completed});
  });
  const uploadThumbnail = (item, file) => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('parentuuid', item.uploadResponse.results[0].data.file_uuid);
    http
      .request({
        url: Endpoints.PrivateMessageUploadThumbnail.url(),
        method: Endpoints.PrivateMessageUploadThumbnail.method,
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
  };

  const generateImageThumbnail = (callBack, item, fileUrl) => {
    callBack(fileUrl, item.file.name)
      .then((file) => {
        uploadThumbnail(item, file);
      })
      .catch((error) => {
        console.error(error);
        onError({...chunkStateRef.current.chunks[item.id]}, error.toString());
        const _chunks = {...chunkStateRef.current.chunks};
        delete _chunks[item.id];
        chunkStateRef.current.setChunks(_chunks);
      });
  };

  useItemFinishListener((item) => {
    const callBack = item.file.type.startsWith(SCMessageFileType.DOCUMENT) ? pdfToJpeg : createVideoThumbnail;
    const _chunks = {...chunkStateRef.current.chunks};
    if (item.uploadResponse.results.length > 1) {
      const formData = new FormData();
      formData.append('uuid', chunkStateRef.current.chunks[item.id].file_uuid);
      formData.append('filename', chunkStateRef.current.chunks[item.id].filename);
      formData.append('totalparts', chunkStateRef.current.chunks[item.id].totalparts);
      http
        .request({
          url: Endpoints.PrivateMessageChunkUploadDone.url(),
          method: Endpoints.PrivateMessageChunkUploadDone.method,
          data: formData,
          headers: {'Content-Type': 'multipart/form-data'}
        })
        .then((res: HttpResponse<any>) => {
          isImageType(item.file.type) ? uploadThumbnail(item, item.file) : generateImageThumbnail(callBack, item, res.data.file_url);
        })
        .catch((error) => {
          error = formatHttpError(error);
          onError({...chunkStateRef.current.chunks[item.id]}, error.error);
          const _chunks = {...chunkStateRef.current.chunks};
          delete _chunks[item.id];
          chunkStateRef.current.setChunks(_chunks);
        });
    } else {
      isImageType(item.file.type) ? uploadThumbnail(item, item.file) : generateImageThumbnail(callBack, item, _chunks[item.id].file_url);
    }
  });

  useItemErrorListener((item) => {
    onError({...chunkStateRef.current.chunks[item.id]}, intl.formatMessage(messages.error));
    const _chunks = {...chunkStateRef.current.chunks};
    delete _chunks[item.id];
    chunkStateRef.current.setChunks(_chunks);
  });

  useChunkStartListener((data): StartEventResponse => {
    const res: StartEventResponse = {
      url: `${scContext.settings.portal}${Endpoints.PrivateMessageUploadMediaInChunks.url()}`,
      sendOptions: {
        paramName: 'file',
        headers: {Authorization: `Bearer ${scContext.settings.session.authToken.accessToken}`},
        method: Endpoints.PrivateMessageUploadMediaInChunks.method
      }
    };
    if (data.totalCount > 1) {
      let _params = {
        partindex: data.chunk.index,
        totalparts: data.totalCount
      };
      if (chunkStateRef.current.chunks[data.item.id].file_uuid) {
        _params['uuid'] = chunkStateRef.current.chunks[data.item.id].file_uuid;
      }
      res.sendOptions.params = _params;
    } else {
      chunkStateRef.current.setChunk({id: data.item.id, type: type || data.sendOptions.paramName});
    }
    return res;
  });

  useChunkFinishListener((data) => {
    chunkStateRef.current.setChunk({
      id: data.item.id,
      file_uuid: data.uploadData.response.data.file_uuid,
      totalparts: data.chunk.index + 1
    });
  });

  useRequestPreSend(({items, options}) => {
    if (items.length == 0) {
      return Promise.resolve({options});
    } else if (isImageType(items[0].file.type)) {
      return new Promise((resolve, reject) => {
        Promise.all(
          items.map(async (item) => {
            return {...item, file: item.file.type === 'image/gif' ? item.file : await createThumbnail(item.file)};
          })
        )
          .then((items) => {
            resolve({
              items: items as BatchItem[],
              options: {
                inputFieldName: options.inputFieldName
              }
            });
          })
          .catch((error) => {
            Logger.error(error, SCOPE_SC_UI);
            resolve({
              options: {
                inputFieldName: options.inputFieldName
              }
            });
          });
      });
    } else {
      //returned object can be wrapped with a promise
      return Promise.resolve({
        options: {
          inputFieldName: options.inputFieldName
        }
      });
    }
  });

  return null;
};
