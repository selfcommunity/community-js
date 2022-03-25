import React, {ReactNode, useEffect, useRef, useState} from 'react';
import {styled} from '@mui/material/styles';
import {Button, CardContent} from '@mui/material';
import PubSub from 'pubsub-js';
import {FormattedMessage} from 'react-intl';
import classNames from 'classnames';
import Widget from '../Widget';

const PREFIX = 'SCFeedUpdates';

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

export interface FeedUpdatesProps {
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
   * @default <FormattedMessage id="ui.feedUpdates.message" defaultMessage="ui.feedUpdates.message" />
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
 * > API documentation for the Community-UI FeedUpdates component. Learn about the available props and the CSS API.
 * This Component subscribe to updates from PubSub channel (eg. websocket) and tell the feed to updates if necessary.

 #### Import

 ```jsx
 import {FeedUpdates} from '@selfcommunity/ui';
 ```

 #### Component Name

 The name `SCFeedUpdates` can be used when providing style overrides in the theme.


 #### CSS

 |Rule Name|Global class|Description|
 |---|---|---|
 |root|.SCFeedUpdates-root|Styles applied to the root element.|
 |image|.SCFeedUpdates-image|Styles applied to the image element.|
 *
 * @param props
 */
export default function FeedUpdates(props: FeedUpdatesProps): JSX.Element {
  // PROPS
  const {
    id = 'feed_updates',
    className = null,
    message = <FormattedMessage id="ui.feedUpdates.message" defaultMessage="ui.feedUpdates.message" />,
    subscriptionChannel,
    subscriptionChannelUpdatesCallback = (msg, data) => true,
    publicationChannel = null,
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

  if (!updates) {
    return null;
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
            <FormattedMessage id="ui.feedUpdates.reload" defaultMessage="ui.feedUpdates.reload" />
          </Button>
        )}
      </CardContent>
    </Root>
  );
}
