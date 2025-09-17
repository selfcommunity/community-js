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
const useSCFetchUsers = (props?: {search?: string}) => {
  const {search = ''} = props || {};
  const [data, setData] = useState<{users: SCUserAutocompleteType[]; isLoading: boolean}>({users: [], isLoading: false});

  const fetchUsers = async (next: string = Endpoints.UserAutocomplete.url(), searchParam?: string): Promise<SCUserAutocompleteType[]> => {
    const response = await http.request({
      url: next,
      method: Endpoints.UserAutocomplete.method,
      params: searchParam ? {search: searchParam} : undefined,
    });
    const data: any = response.data;
    if (data.next) {
      return data.results.concat(await fetchUsers(data.next, searchParam));
    }
    return data.results;
  };

  useEffect(() => {
    if (!search) return;
    fetchUsers(undefined, search)
      .then((data) => {
        setData({users: data, isLoading: false});
      })
      .catch((error) => {
        console.error(error);
        Logger.error(SCOPE_SC_CORE, 'Unable to retrieve users');
        setData((prev) => ({...prev, isLoading: false}));
      });
  }, [search]);

  return data;
};

export default useSCFetchUsers;
