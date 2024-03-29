import {Box, Button, Menu, MenuProps, styled} from '@mui/material';
import {Link, SCRoutes, SCRoutingContextType, useSCRouting} from '@selfcommunity/react-core';
import {FormattedMessage} from 'react-intl';
import React from 'react';
import {useThemeProps} from '@mui/system';
import SnippetNotifications, {SnippetNotificationsProps} from '../SnippetNotifications';
import {PREFIX} from './constants';

const classes = {
  root: `${PREFIX}-notifications-menu-root`,
  paper: `${PREFIX}-paper`,
  notifications: `${PREFIX}-notifications`,
  link: `${PREFIX}-link`
};
const Root = styled(Menu, {
  name: PREFIX,
  slot: 'NotificationsMenuRoot'
})(() => ({}));

export interface NotificationsMenuProps extends MenuProps {
  /**
   * Props to spread to the SnippetNotifications component
   * @default {}
   */
  SnippetNotificationsProps?: SnippetNotificationsProps;
}

export default function NotificationMenu(inProps: NotificationsMenuProps) {
  // PROPS
  const props: NotificationsMenuProps = useThemeProps({
    props: inProps,
    name: PREFIX
  });
  const {PaperProps = {className: classes.paper}, MenuListProps = {component: Box}, SnippetNotificationsProps = {}, ...rest} = props;

  // HOOKS
  const scRoutingContext: SCRoutingContextType = useSCRouting();

  return (
    // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
    // @ts-ignore
    <Root className={classes.root} PaperProps={PaperProps} MenuListProps={MenuListProps} {...rest}>
      <SnippetNotifications className={classes.notifications} {...SnippetNotificationsProps} />
      <Button className={classes.link} component={Link} to={scRoutingContext.url(SCRoutes.USER_NOTIFICATIONS_ROUTE_NAME, {})} variant="text">
        <FormattedMessage id="ui.header.notifications.button.seeMore" defaultMessage="ui.header.notifications.button.seeMore" />
      </Button>
    </Root>
  );
}
