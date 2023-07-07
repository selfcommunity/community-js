import React, {useMemo} from 'react';
import {styled} from '@mui/material/styles';
import {useThemeProps} from '@mui/system';
import {Badge, BadgeProps, Avatar} from '@mui/material';
import classNames from 'classnames';
import {SCPreferences, SCPreferencesContextType, useSCPreferences} from '@selfcommunity/react-core';

const PREFERENCES = [SCPreferences.STAFF_STAFF_BADGE_LABEL, SCPreferences.STAFF_STAFF_BADGE_ICON];

const PREFIX = 'SCUserAvatar';

const classes = {
  root: `${PREFIX}-root`,
  badgeContent: `${PREFIX}-badge-content`,
  badgeContentSmaller: `${PREFIX}-badge-content-xs`
};

export interface UserAvatarProps extends BadgeProps {
  className?: string;
  children?: React.ReactNode;
  hide: boolean;
  smaller?: boolean;
}

const Root = styled(Badge, {
  name: PREFIX,
  slot: 'Root',
  overridesResolver: (props, styles) => styles.root
})(({theme}: any) => ({}));

export default function UserAvatar(inProps: UserAvatarProps): JSX.Element {
  // PROPS
  const props: UserAvatarProps = useThemeProps({
    props: inProps,
    name: PREFIX
  });
  const {className, children = null, hide = false, smaller = false, ...rest} = props;

  // PREFERENCES
  const scPreferences: SCPreferencesContextType = useSCPreferences();
  const preferences = useMemo(() => {
    const _preferences = {};
    PREFERENCES.map((p) => (_preferences[p] = p in scPreferences.preferences ? scPreferences.preferences[p].value : null));
    return _preferences;
  }, [scPreferences.preferences]);

  return (
    <Root
      classes={{root: classNames(className, classes.root)}}
      invisible={hide}
      overlap="circular"
      anchorOrigin={{vertical: 'top', horizontal: 'right'}}
      showZero={!preferences}
      badgeContent={
        <Avatar
          className={classNames(classes.badgeContent, {[classes.badgeContentSmaller]: smaller})}
          alt={preferences[SCPreferences.STAFF_STAFF_BADGE_LABEL]}
          src={preferences[SCPreferences.STAFF_STAFF_BADGE_ICON]}
        />
      }
      {...rest}>
      {children}
    </Root>
  );
}
