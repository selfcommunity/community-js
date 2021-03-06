import {Endpoints, http} from '@selfcommunity/api-services';
import {Logger} from '@selfcommunity/utils';
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
