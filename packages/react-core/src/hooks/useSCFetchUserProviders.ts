import {useEffect, useState} from 'react';
import {SCOPE_SC_CORE} from '../constants/Errors';
import {SCUserProviderAssociationType} from '@selfcommunity/types';
import {UserService} from '@selfcommunity/api-services';
import {Logger} from '@selfcommunity/utils';

/**
 :::info
 This custom hook is used to fetch the list of user providers.
 :::
 * @param object
 * @param object.id
 * @param object.providers
 */
export default function useSCFetchUserProviders({id, providers = null}: {id: number | string; providers?: SCUserProviderAssociationType[]}) {
  const [scUserProviders, setSCUserProviders] = useState<SCUserProviderAssociationType[]>(providers || []);
  const [error, setError] = useState<string>(null);

  /**
   * If id resolve the obj
   */
  useEffect(() => {
    if (providers !== null) {
      return;
    }

    // Retrieve provider associations if doues not exists
    UserService.getProviderAssociations(id)
      .then((providers: SCUserProviderAssociationType[]) => {
        setSCUserProviders(providers);
      })
      .catch((err) => {
        setError(`User with id ${id} not found`);
        Logger.error(SCOPE_SC_CORE, `User with id ${id} not found`);
        Logger.error(SCOPE_SC_CORE, err.message);
      });
  }, [id, providers]);

  return {scUserProviders, setSCUserProviders, error};
}
