import {Endpoints, http, Logger} from '@selfcommunity/core';
import {SCOPE_SC_CORE} from '../constants/Errors';

export default function useSCMediaClick() {
  const handleMediaClick = (mediaObj) => {
    http
      .request({
        url: Endpoints.MediaClickTracker.url({id: mediaObj.id}),
        method: Endpoints.MediaClickTracker.method,
      })
      .catch((error) => {
        Logger.error(SCOPE_SC_CORE, error);
      });
  };

  return {handleMediaClick};
}
