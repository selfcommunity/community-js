import {CustomMenuService} from '@selfcommunity/api-services';
import {SCCustomMenu, SCCustomMenuType} from '@selfcommunity/types';
import {Logger} from '@selfcommunity/utils';
import {useCallback, useEffect, useState} from 'react';
import {SCOPE_SC_CORE} from '../constants/Errors';

export default function useFetchMenuFooter(id: SCCustomMenu, menu: SCCustomMenuType | null = null) {
  // STATES
  const [_menu, setMenu] = useState<SCCustomMenuType | null>(menu);
  const [loading, setLoading] = useState<boolean>(!menu);

  /**
   * Fetches custom pages
   */
  const fetchMenu = useCallback(() => {
    setLoading(true);
    CustomMenuService.getASpecificCustomMenu(id)
      .then((menu: SCCustomMenuType) => {
        setMenu(menu);
      })
      .catch((error) => {
        Logger.error(SCOPE_SC_CORE, error);
      })
      .then(() => setLoading(false));
  }, []);

  /**
   * On mount, fetches legal and custom pages
   */
  useEffect(() => {
    if (menu) {
      return;
    }
    fetchMenu();
  }, [id]);

  return {_menu, loading};
}
