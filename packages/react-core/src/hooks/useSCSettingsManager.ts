import {useEffect, useMemo, useState} from 'react';
import {http, Endpoints, HttpResponse} from '@selfcommunity/api-services';
import {SCUserSettingsType, SCUserType} from '@selfcommunity/types';
import {Logger} from '@selfcommunity/utils';
import {SCOPE_SC_CORE} from '../constants/Errors';

/**
 :::info
 This custom hook is used to manage user settings.
 :::
 :::tipHow to use it:

 Follow these steps:
 ```jsx
 1. const scUserContext: SCUserContextType = useSCUser();
 2. const scSettingsManager: SCSettingsManagerType = scUserContext.manager.settings;
 3. scSettingsManager.all()
 ```
 :::
 */
export default function useSCSettingsManager(user?: SCUserType) {
  const [data, setData] = useState<SCUserSettingsType>(null);
  const [loading, setLoading] = useState<boolean>(false);

  /**
   * Memoized refresh all settings data
   * It makes a single request to the server and retrieves
   * all the settings single solution
   * It might be useful for multi-tab sync
   */
  const refresh = useMemo(
    () => (): void => {
      if (user) {
        setLoading(true);
        http
          .request({
            url: Endpoints.UserSettings.url({id: user.id}),
            method: Endpoints.UserSettings.method,
          })
          .then((res: HttpResponse<SCUserSettingsType>) => {
            setData(res.data);
            setLoading(false);
          })
          .catch((e) => {
            Logger.error(SCOPE_SC_CORE, 'Unable to load user settings.');
            Logger.error(SCOPE_SC_CORE, e);
          });
      }
    },
    [user, data]
  );

  /**
   * Check if the component is loading
   */
  const isLoading = useMemo(
    () => (): boolean => {
      return loading;
    },
    [loading]
  );

  /**
   * Get a single preference
   * @param p
   */
  const get = useMemo(
    () =>
      (p: string): any => {
        if (data && p in data) {
          return data[p];
        }
        return null;
      },
    [data]
  );

  /**
   * Get all preferences
   * @param p
   */
  const all = useMemo(
    () => (): SCUserSettingsType => {
      return data;
    },
    [data]
  );

  /**
   * Update a single preference
   * @param p
   */
  const update = useMemo(
    () =>
      (p: string, v: any): Promise<any> => {
        if (data && p in data) {
          return http
            .request({
              url: Endpoints.UserSettingsPatch.url({id: user.id}),
              method: Endpoints.UserSettingsPatch.method,
              data: {[p]: v},
            })
            .then((res: HttpResponse<SCUserSettingsType>) => {
              const _data = Object.assign({}, data, {[p]: v});
              setData(_data);
              return Promise.resolve(_data);
            })
            .catch((error) => {
              console.log(error);
            });
        }
        return Promise.reject();
      },
    [data]
  );

  // EFFECTS
  useEffect(() => {
    refresh();
  }, [user]);

  return {update, get, all, isLoading, refresh};
}
