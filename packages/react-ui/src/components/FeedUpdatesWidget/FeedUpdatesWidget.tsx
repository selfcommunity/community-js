import React, {ReactNode, useEffect, useRef, useState} from 'react';
import {styled} from '@mui/material/styles';
import {Button, CardContent} from '@mui/material';
import PubSub from 'pubsub-js';
import {FormattedMessage} from 'react-intl';
import classNames from 'classnames';
import Widget from '../Widget';
import {useThemeProps} from '@mui/system';
import HiddenPlaceholder from '../../shared/HiddenPlaceholder';
import {VirtualScrollerItemProps} from '../../types/virtualScroller';

const PREFIX = 'SCFeedUpdatesWidget';

const classes = {
  root: `${PREFIX}-root`,
  image: `${PREFIX}-image`
};

const Root = styled(Widget, {
  name: PREFIX,
  slot: 'Root',
  overridesResolver: (props, styles) => styles.root
})(({theme}) => ({
  marginBottom: theme.spacing(2),
  '& div:last-child': {
    paddingBottom: theme.spacing(2)
  }
}));

export interface FeedUpdatesWidgetProps extends VirtualScrollerItemProps {
  /**
   * Id of the feed object
   * @default 'custom_adv'
   */
  id?: string;

  /**
   * Overrides or extends the styles applied to the component.
   * @default null
   */
  className?: string;

  /**
   * Update message, rendered when no more feed item can be displayed
   * @default <FormattedMessage id="ui.feedUpdatesWidget.message" defaultMessage="ui.feedUpdatesWidget.message" />
   */
  message?: ReactNode;

  /**
   * Subscription channel for updates notification
   */
  subscriptionChannel: string;

  /**
   * Callback used to check if the message published to the channel is an update message
   * @default (msg, data) => true
   * @return boolean
   */
  subscriptionChannelUpdatesCallback?: (msg, data) => boolean;

  /**
   * Publish channel for refresh notification
   */
  publicationChannel?: string;

  /**
   * Other Card props
   */
  [p: string]: any;
}

/**
 * > API documentation for the Community-JS Feed Updates Widget component. Learn about the available props and the CSS API.
 * This Component subscribe to updates from PubSub channel (eg. websocket) and tell the feed to updates if necessary.

 #### Import

 ```jsx
 import {FeedUpdates} from '@selfcommunity/react-ui';
 ```

 #### Component Name

 The name `SCFeedUpdatesWidget` can be used when providing style overrides in the theme.


 #### CSS

 |Rule Name|Global class|Description|
 |---|---|---|
 |root|.SCFeedUpdatesWidget-root|Styles applied to the root element.|
 |image|.SCFeedUpdatesWidget-image|Styles applied to the image element.|
 *
 * @param inProps
 */
export default function FeedUpdatesWidget(inProps: FeedUpdatesWidgetProps): JSX.Element {
  // PROPS
  const props: FeedUpdatesWidgetProps = useThemeProps({
    props: inProps,
    name: PREFIX
  });

  const {
    id = 'feed_updates',
    className = null,
    message = <FormattedMessage id="ui.feedUpdatesWidget.message" defaultMessage="ui.feedUpdatesWidget.message" />,
    subscriptionChannel,
    subscriptionChannelUpdatesCallback = (msg, data) => true,
    publicationChannel = null,
    onHeightChange,
    ...rest
  } = props;

  // STATE
  const [updates, setUpdates] = useState<boolean>(false);

  // REFS
  const updatesSubscription = useRef(null);

  // Subscripber for pubsub callback
  const subscriber = (msg, data) => {
    if (subscriptionChannelUpdatesCallback(msg, data)) {
      setUpdates(true);
    }
  };

  /**
   * On mount, fetches first page of notifications
   * On mount, subscribe to receive notification updates
   */
  useEffect(() => {
    updatesSubscription.current = PubSub.subscribe(subscriptionChannel, subscriber);
    return () => {
      PubSub.unsubscribe(updatesSubscription.current);
    };
  }, []);

  /**
   * Virtual Feed update
   */
  useEffect(() => {
    onHeightChange && onHeightChange();
  }, [updates]);

  if (!updates) {
    return <HiddenPlaceholder />;
  }

  // HANDLERS
  const handleClick = () => {
    PubSub.publishSync(publicationChannel, {refresh: true});
    setUpdates(false);
  };

  return (
    <Root id={id} className={classNames(classes.root, className)} {...rest}>
      <CardContent>
        {message}
        {publicationChannel && (
          <Button onClick={handleClick}>
            <FormattedMessage id="ui.feedUpdatesWidget.reload" defaultMessage="ui.feedUpdatesWidget.reload" />
          </Button>
        )}
      </CardContent>
    </Root>
  );
}
