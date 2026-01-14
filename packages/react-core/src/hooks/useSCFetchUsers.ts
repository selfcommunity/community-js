import {useEffect, useState} from 'react';
import {SCOPE_SC_CORE} from '../constants/Errors';
import {SCUserAutocompleteType} from '@selfcommunity/types';
import {Endpoints, http} from '@selfcommunity/api-services';
import {Logger} from '@selfcommunity/utils';

/**
 :::info
 This custom hook is used to fetch users.
   
 :::tip Context can be consumed in this way:

 ```jsx
 const {users, isLoading} = useSCFetchUsers();
 ```
 :::
 * @param props
 */
const useSCFetchUsers = (props?: {search: string; exclude?: string}) => {
  const {search = '', exclude = ''} = props || {};
  const [data, setData] = useState<{users: SCUserAutocompleteType[]; isLoading: boolean}>({users: [], isLoading: false});

  const fetchUsers = async (
    next: string = Endpoints.UserAutocomplete.url(),
    searchParam?: string,
    excludeParam?: string
  ): Promise<SCUserAutocompleteType[]> => {
    const response = await http.request({
      url: next,
      method: Endpoints.UserAutocomplete.method,
      params: {
        search: searchParam,
        ...(excludeParam && {exclude: excludeParam}),
      },
    });
    const result: any = response.data;
    if (result.next) {
      return result.results.concat(await fetchUsers(result.next, searchParam, excludeParam));
    }
    return result.results;
  };

  useEffect(() => {
    if (!search) return;
    fetchUsers(undefined, search, exclude)
      .then((users) => {
        setData({users, isLoading: false});
      })
      .catch((error) => {
        console.error(error);
        Logger.error(SCOPE_SC_CORE, 'Unable to retrieve users');
        setData((prev) => ({...prev, isLoading: false}));
      });
  }, [search, exclude]);

  return data;
};

export default useSCFetchUsers;
