'use client';

import {SCPreferencesContextType} from '../../types';
import {useSCPreferences} from '../provider/SCPreferencesProvider';
import * as SCPreferences from '../../constants/Preferences';
import {useEffect} from 'react';

export default function SCContextMenu() {
  const {preferences}: SCPreferencesContextType = useSCPreferences();

  const contextMenuEnabled =
    SCPreferences.CONFIGURATIONS_CONTEXT_MENU_ENABLED in preferences && preferences[SCPreferences.CONFIGURATIONS_CONTEXT_MENU_ENABLED].value;

  useEffect(() => {
    const handleContextMenu = (e: MouseEvent) => {
      e.preventDefault();
    };

    if (!contextMenuEnabled) {
      document.addEventListener('contextmenu', handleContextMenu);

      return () => {
        document.removeEventListener('contextmenu', handleContextMenu);
      };
    }
  }, [contextMenuEnabled]);

  return null;
}
