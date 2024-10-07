import {
  BatchItem,
  PreSendResponse,
  StartEventResponse,
  useChunkFinishListener,
  useChunkStartListener,
  useItemErrorListener,
  useItemFinishListener,
  useRequestPreSend
} from '@rpldy/chunked-uploady';
import { useItemProgressListener, useItemStartListener } from '@rpldy/uploady';
import { Endpoints, http, HttpResponse } from '@selfcommunity/api-services';
import { SCContextType, SCUserContextType, useSCContext, useSCUser } from '@selfcommunity/react-core';
import { SCMediaType } from '@selfcommunity/types';
import { Logger, resizeImage } from '@selfcommunity/utils';
import React, { useEffect, useRef, useState } from 'react';
import { useIntl } from 'react-intl';
import { SCOPE_SC_UI } from '../../constants/Errors';
import messages from '../../messages/common';
import { SCMediaChunkType } from '../../types/media';
import { md5 } from '../../utils/hash';

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
  const [chunks, _setChunks] = useState({});
  const setChunk: any = (chunk: SCMediaChunkType) => {
    const _chunks = {...chunkStateRef.current.chunks, [chunk.id]: {...chunkStateRef.current.chunks[chunk.id], ...chunk}};
    _setChunks(_chunks);
    chunkStateRef.current.chunks = _chunks;
  };
  const setChunks = (chunks: SCMediaChunkType) => {
    _setChunks(chunks);
    chunkStateRef.current.chunks = chunks;
  };

  // Using refs to have the correct chunks values in the callbacks
  // https://stackoverflow.com/questions/57847594/react-hooks-accessing-up-to-date-state-from-within-a-callback
  chunkStateRef.current = {chunks, setChunk, setChunks};

  // CONTEXT
  const scContext: SCContextType = useSCContext();
  const {refreshSession}: SCUserContextType = useSCUser();

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
    console.log('*** useItemStartListener item ***', item);
    if (item.file.type.startsWith('image/')) {
      console.log('*** useItemStartListener if item ***', item);
      const reader = new FileReader();
      reader.onload = (e) => {
        chunkStateRef.current.setChunk({id: item.id, image: e.target.result});
      };
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      reader.readAsDataURL(item.file);
    }
    chunkStateRef.current.setChunk({id: item.id, [`upload_id`]: null, completed: 0, name: item.file.name});
  });

  useItemProgressListener((item) => {
    console.log('*** useItemProgressListener item ***', item);
    chunkStateRef.current.setChunk({id: item.id, completed: item.completed});
  });

  useItemFinishListener((item) => {
    md5(item.file, 2142880, (hash) => {
      console.log('*** useItemFinishListener item ***', item);
      const formData = new FormData();
      formData.append('upload_id', chunkStateRef.current.chunks[item.id].upload_id);
      formData.append('type', chunkStateRef.current.chunks[item.id].type);
      formData.append('md5', hash);
      formData.forEach((data, i) => console.log('*** useItemFinishListener formData ***', i, data));
      http
        .request({
          url: Endpoints.ComposerChunkUploadMediaComplete.url(),
          method: Endpoints.ComposerChunkUploadMediaComplete.method,
          data: formData,
          headers: {'Content-Type': 'multipart/form-data'}
        })
        .then((res: HttpResponse<any>) => {
          console.log('*** useItemFinishListener then res ***', res);
          setTimeout(() => {
            const _chunks = {...chunkStateRef.current.chunks};
            delete _chunks[item.id];
            chunkStateRef.current.setChunks(_chunks);
            onSuccess(res.data);
          }, 0);
        })
        .catch((error) => {
          console.log('*** useItemFinishListener error ***', error);
          console.log(error);
          onError({...chunkStateRef.current.chunks[item.id]}, intl.formatMessage(messages.fileUploadErrorGeneric));
          const _chunks = {...chunkStateRef.current.chunks};
          delete _chunks[item.id];
          chunkStateRef.current.setChunks(_chunks);
        });
    });
  });

  useItemErrorListener((item) => {
    console.log('*** useItemErrorListener item ***', item);
    onError({...chunkStateRef.current.chunks[item.id]}, intl.formatMessage(messages.fileUploadErrorGeneric));
    const _chunks = {...chunkStateRef.current.chunks};
    delete _chunks[item.id];
    chunkStateRef.current.setChunks(_chunks);
  });

  useChunkStartListener((data): StartEventResponse => {
    console.log('*** useChunkStartListener data ***', data);
    const res: StartEventResponse = {
      url: `${scContext.settings.portal}${Endpoints.ComposerChunkUploadMedia.url()}`,
      sendOptions: {
        paramName: 'image',
        method: Endpoints.ComposerChunkUploadMedia.method,
        formatServerResponse: async (response: string, status: number, headers: Record<string, string> | undefined) => {
          if (status === 401) {
            await refreshSession();
          }
          return Promise.resolve(JSON.parse(response));
        }
      }
    };
    if (chunkStateRef.current.chunks[data.item.id].upload_id) {
      console.log('*** useChunkStartListener if ***');
      res.sendOptions.params = {[`upload_id`]: chunkStateRef.current.chunks[data.item.id].upload_id};
    } else {
      console.log('*** useChunkStartListener else ***');
      chunkStateRef.current.setChunk({id: data.item.id, type: type || data.sendOptions.paramName});
    }
    return res;
  });

  useChunkFinishListener(async (data) => {
    console.log('*** useChunkFinishListener data ***', data);
    const _data = await data.uploadData.response.data;
    chunkStateRef.current.setChunk({id: data.item.id, [`upload_id`]: _data.upload_id});
  });

  useRequestPreSend(async ({items, options}): Promise<PreSendResponse> => {
    console.log('*** useRequestPreSend items ***', items);
    console.log('*** useRequestPreSend options ***', options);
    const destination = ['JWT', 'OAuth'].includes(scContext.settings.session.type)
      ? {
          headers: {Authorization: `Bearer ${scContext.settings.session.authToken.accessToken}`}
        }
      : {};

    if (items.length == 0) {
      console.log('*** useRequestPreSend items.length === 0 ***');
      return Promise.resolve({options, destination});
    }

    //returned object can be wrapped with a promise
    return new Promise((resolve) => {
      Promise.all(
        items.map(async (item) => {
          return {...item, file: item.file.type.startsWith('image/') && item.file.type !== 'image/gif' ? await resizeImage(item.file) : item.file};
        })
      )
        .then((items) => {
          console.log('*** useRequestPreSend promise then ***', items);
          resolve({
            items: items as BatchItem[],
            options: {
              inputFieldName: options.inputFieldName,
              destination
            }
          });
        })
        .catch((error) => {
          console.log('*** useRequestPreSend promise error ***', error);
          Logger.error(error, SCOPE_SC_UI);
          resolve({
            options: {
              inputFieldName: options.inputFieldName,
              destination
            }
          });
        });
    });
  });

  return null;
};
