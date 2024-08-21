import React from 'react';
import {styled} from '@mui/material/styles';
import {Avatar, Button, Typography} from '@mui/material';
import {SCEventLocationType, SCEventType} from '@selfcommunity/types';
import {Link, SCRoutes, SCRoutingContextType, useSCFetchEvent, useSCRouting} from '@selfcommunity/react-core';
import {FormattedMessage, useIntl} from 'react-intl';
import classNames from 'classnames';
import {useThemeProps} from '@mui/system';
import BaseItem from '../../shared/BaseItem';
import {WidgetProps} from '../Widget';
import {PREFIX} from './constants';
import EventSkeleton from './Skeleton';

const classes = {
  root: `${PREFIX}-root`,
  avatar: `${PREFIX}-avatar`,
  primary: `${PREFIX}-primary`,
  secondary: `${PREFIX}-secondary`,
  actions: `${PREFIX}-actions`
};

const Root = styled(BaseItem, {
  name: PREFIX,
  slot: 'Root',
  overridesResolver: (props, styles) => styles.root
})(() => ({}));

export interface EventProps extends WidgetProps {
  /**
   * Event Object
   * @default null
   */
  event?: SCEventType;
  /**
   * Id of the event for filter the feed
   * @default null
   */
  eventId?: number;
  /**
   * Any other properties
   */
  [p: string]: any;
}

/**
 * > API documentation for the Community-JS Event component. Learn about the available props and the CSS API.
 *
 *
 * This component renders an event item.
 * Take a look at our <strong>demo</strong> component [here](/docs/sdk/community-js/react-ui/Components/Event)

 #### Import

 ```jsx
 import {event} from '@selfcommunity/react-ui';
 ```

 #### Component Name

 The name `SCEvent` can be used when providing style overrides in the theme.


 #### CSS

 |Rule Name|Global class|Description|
 |---|---|---|
 |root|.SCEvent-root|Styles applied to the root element.|
 |avatar|.SCEvent-avatar|Styles applied to the avatar element.|
 |primary|.SCEvent-primary|Styles applied to the primary item element section|
 |secondary|.SCEvent-secondary|Styles applied to the secondary item element section|
 |actions|.SCEvent-actions|Styles applied to the actions section.|


 *
 * @param inProps
 */
export default function Event(inProps: EventProps): JSX.Element {
  // PROPS
  const props: EventProps = useThemeProps({
    props: inProps,
    name: PREFIX
  });
  const {eventId = null, event = null, className = null, elevation = 0, ...rest} = props;

  // STATE
  const {scEvent} = useSCFetchEvent({id: eventId, event});

  // CONTEXT
  const scRoutingContext: SCRoutingContextType = useSCRouting();

  // HOOKS
  const intl = useIntl();
  /**
   * Renders event object
   */
  if (!scEvent) {
    return <EventSkeleton elevation={elevation} />;
  }

  /**
   * Renders root object
   */
  return (
    <Root
      elevation={elevation}
      disableTypography
      {...rest}
      className={classNames(classes.root, className)}
      image={<Avatar variant="square" alt={scEvent.name} src={scEvent.image_medium} className={classes.avatar} />}
      primary={
        <Link to={scRoutingContext.url(SCRoutes.EVENT_ROUTE_NAME, scEvent)} className={classes.primary}>
          <Typography component="span">{`${intl.formatDate(scEvent.start_date, {weekday: 'long', month: 'long', day: 'numeric'})}`}</Typography>
          <Typography variant="body1">{scEvent.name}</Typography>
        </Link>
      }
      secondary={
        <Typography component="p" variant="body2" className={classes.secondary}>
          <FormattedMessage id={`ui.eventForm.privacy.${scEvent.privacy}`} defaultMessage={`ui.eventForm.privacy.${scEvent.privacy}`} /> -{' '}
          {scEvent?.location === SCEventLocationType.PERSON ? (
            <FormattedMessage id={`ui.eventForm.address.live.label`} defaultMessage={`ui.eventForm.address.live.label`} />
          ) : (
            <FormattedMessage id={`ui.eventForm.address.online.label`} defaultMessage={`ui.eventForm.address.online.label`} />
          )}
        </Typography>
      }
      actions={
        <Button size="small" variant="outlined" component={Link} to={scRoutingContext.url(SCRoutes.EVENT_ROUTE_NAME, scEvent)}>
          <FormattedMessage defaultMessage="ui.event.see" id="ui.event.see" />
        </Button>
      }
    />
  );
}
