import {Box, Button, Menu, MenuProps, styled} from '@mui/material';
import { Link, SCRoutes, SCRoutingContextType, useSCRouting } from '@selfcommunity/react-core';
import {FormattedMessage} from 'react-intl';
import React from 'react';
import {useThemeProps} from '@mui/system';
import SnippetNotifications from '../SnippetNotifications';

const PREFIX = 'SCNotificationsMenu';

const classes = {
  root: `${PREFIX}-root`,
  paper: `${PREFIX}-paper`,
  notifications: `${PREFIX}-notifications`,
  link: `${PREFIX}-link`
};
const Root = styled(Menu, {
  name: PREFIX,
  slot: 'Root',
  overridesResolver: (props, styles) => styles.root
})(({theme}) => ({
  [`& .${classes.paper}`]: {
    minWidth: 370,
    padding: theme.spacing(2)
  },
  [`& .${classes.link}`]: {
    display: 'block',
    textAlign: 'center',
    margin: theme.spacing(0, 'auto')
  }
}));

export type NotificationsMenuProps = MenuProps;

export default function NotificationMenu(inProps: NotificationsMenuProps) {
  // PROPS
  const props: NotificationsMenuProps = useThemeProps({
    props: inProps,
    name: PREFIX
  });
  const {PaperProps = {className: classes.paper}, ...rest} = props;

  // HOOKS
  const scRoutingContext: SCRoutingContextType = useSCRouting();

  return (
    <Root className={classes.root} PaperProps={PaperProps} {...rest}>
      <SnippetNotifications className={classes.notifications} />
      <Button className={classes.link} component={Link} to={scRoutingContext.url(SCRoutes.USER_NOTIFICATIONS_ROUTE_NAME, {})} variant="text">
        <FormattedMessage id="ui.header.notifications.button.seeMore" defaultMessage="ui.header.notifications.button.seeMore" />
      </Button>
    </Root>
  );
}
