import {CustomMenuService} from '@selfcommunity/api-services';
import {SCCustomMenuType} from '@selfcommunity/types';
import {Logger} from '@selfcommunity/utils';
import {useEffect, useState} from 'react';
import {SCOPE_SC_CORE} from '../constants/Errors';

export default function useFetchMenuFooter(menu: SCCustomMenuType | null) {
  // STATES
  const [_menu, setMenu] = useState<SCCustomMenuType | null>(menu);
  const [loading, setLoading] = useState<boolean>(!menu);

  /**
   * Fetches custom pages
   */
  function fetchMenu() {
    setLoading(true);
    CustomMenuService.getBaseCustomMenu()
      .then((menu: SCCustomMenuType) => {
        setMenu(menu);
      })
      .catch((error) => {
        Logger.error(SCOPE_SC_CORE, error);
      })
      .then(() => setLoading(false));
  }

  /**
   * On mount, fetches legal and custom pages
   */
  useEffect(() => {
    if (_menu) {
      return;
    }
    fetchMenu();
  }, []);

  return {_menu, loading};
}
