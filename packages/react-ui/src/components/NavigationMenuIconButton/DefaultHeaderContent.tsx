import {
  Link,
  SCPreferences,
  SCPreferencesContextType,
  SCRoutes,
  SCRoutingContextType,
  useSCPreferences,
  useSCRouting
} from '@selfcommunity/react-core';
import React, {useMemo} from 'react';
import {styled} from '@mui/material/styles';
import {Box, BoxProps} from '@mui/material';
import classNames from 'classnames';
import {useThemeProps} from '@mui/system';

const PREFIX = 'SCDefaultHeaderContent';

const classes = {
  root: `${PREFIX}-root`
};

const Root = styled(Box, {
  name: PREFIX,
  slot: 'Root',
  overridesResolver: (_, styles) => styles.root
})(() => ({}));

export type DefaultHeaderContentProps = BoxProps;

export default function DefaultHeaderContent(inProps: DefaultHeaderContentProps) {
  const props: DefaultHeaderContentProps = useThemeProps({
    props: inProps,
    name: PREFIX
  });

  const {className, ...rest} = props;

  const scRoutingContext: SCRoutingContextType = useSCRouting();

  // PREFERENCES
  const scPreferences: SCPreferencesContextType = useSCPreferences();
  const _logo = useMemo(() => {
    return SCPreferences.LOGO_NAVBAR_LOGO in scPreferences.preferences ? scPreferences.preferences[SCPreferences.LOGO_NAVBAR_LOGO].value : null;
  }, [scPreferences.preferences]);

  return (
    <Root className={classNames(className, classes.root)} {...rest}>
      <Link to={scRoutingContext.url(SCRoutes.HOME_ROUTE_NAME, {})}>
        <img src={_logo} alt="logo"></img>
      </Link>
    </Root>
  );
}
