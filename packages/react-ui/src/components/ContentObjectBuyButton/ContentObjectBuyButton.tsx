import {LoadingButton} from '@mui/lab';
import {
  Box,
  Button,
  Checkbox,
  CircularProgress,
  FormControlLabel,
  Icon,
  Menu,
  MenuItem,
  SwipeableDrawer,
  useMediaQuery,
  useTheme
} from '@mui/material';
import {styled} from '@mui/material/styles';
import {useThemeProps} from '@mui/system';
import {
  SCContextType,
  SCSubscribedEventsManagerType,
  SCThemeType,
  SCUserContextType,
  useSCContext,
  useSCFetchEvent,
  useSCUser
} from '@selfcommunity/react-core';
import {SCEventPrivacyType, SCEventSubscriptionStatusType, SCEventType, SCUserType} from '@selfcommunity/types';
import {CacheStrategies, Logger} from '@selfcommunity/utils';
import classNames from 'classnames';
import PubSub from 'pubsub-js';
import {MouseEvent, ReactNode, useCallback, useEffect, useMemo, useState} from 'react';
import {FormattedMessage} from 'react-intl';
import {SCOPE_SC_UI} from '../../constants/Errors';
import {SCGroupEventType, SCTopicType} from '../../constants/PubSub';
import ContentObjectPricesDialog from '../ContentObjectPricesDialog';
import {SCContentType} from '../../types/paywall';
import ContentObjectPrices from '../ContentObjectPrices';

const PREFIX = 'SCContentObjectBuyButton';

const classes = {
  requestRoot: `${PREFIX}-request-root`,
  selectRoot: `${PREFIX}-select-root`,
  drawerRoot: `${PREFIX}-drawer-root`,
  menuRoot: `${PREFIX}-menu-root`,
  paper: `${PREFIX}-paper`,
  item: `${PREFIX}-item`,
  going: `${PREFIX}-going`,
  notGoing: `${PREFIX}-not-going`
};

const RequestRoot = styled(LoadingButton, {
  name: PREFIX,
  slot: 'RequestRoot'
})(() => ({}));

const SwipeableDrawerRoot = styled(SwipeableDrawer, {
  name: PREFIX,
  slot: 'DrawerRoot'
})(() => ({}));

const MenuRoot = styled(Menu, {
  name: PREFIX,
  slot: 'MenuRoot'
})(() => ({}));

export interface ContentObjectBuyButtonProps {
  /**
   * Overrides or extends the styles applied to the component.
   * @default null
   */
  className?: string;

  /**
   * Event Object
   * @default null
   */
  event?: SCEventType;

  /**
   * Id of the event
   * @default null
   */
  eventId?: number;

  /**
   * onPurchase callback
   * @param user
   * @param joined
   */
  onPurchase?: (event: SCEventType) => any;

  /**
   * Others properties
   */
  [p: string]: any;
}

/**
 * > API documentation for the Community-JS Content Object Buy Button Button component. Learn about the available props and the CSS API.

 #### Import

 ```jsx
 import {ContentObjectBuyButton} from '@selfcommunity/react-ui';
 ```

 #### Component Name

 The name `ContentObjectBuyButton` can be used when providing style overrides in the theme.


 #### CSS

 |Rule Name|Global class|Description|
 |---|---|---|
 |root|.SCContentObjectBuyButton-root|Styles applied to the root element.|

 * @param inProps
 */
export default function ContentObjectBuyButton(inProps: ContentObjectBuyButtonProps): JSX.Element {
  // PROPS
  const props: ContentObjectBuyButtonProps = useThemeProps({
    props: inProps,
    name: PREFIX
  });

  const {className, eventId, event, user, onPurchase, ...rest} = props;

  // STATE
  const [loading, setLoading] = useState<boolean>(false);
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
  const open = Boolean(anchorEl);

  // CONTEXT
  const scContext: SCContextType = useSCContext();
  const scUserContext: SCUserContextType = useSCUser();
  const scEventsManager: SCSubscribedEventsManagerType = scUserContext.managers.events;
  const theme = useTheme<SCThemeType>();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  // CONST
  const authUserId = scUserContext.user ? scUserContext.user.id : null;

  const {scEvent, setSCEvent} = useSCFetchEvent({
    id: eventId,
    event,
    cacheStrategy: authUserId ? CacheStrategies.CACHE_FIRST : CacheStrategies.STALE_WHILE_REVALIDATE
  });

  const isEventAdmin = useMemo(
    () => scUserContext.user && scEvent?.managed_by?.id === scUserContext.user.id,
    [scUserContext.user, scEvent?.managed_by?.id]
  );

  // HANDLERS
  const handleClose = useCallback(() => {
    setAnchorEl(null);
  }, [setAnchorEl]);

  const handleOpen = useCallback(
    (event: MouseEvent<HTMLElement>) => {
      if (!scUserContext.user) {
        scContext.settings.handleAnonymousAction();
      } else {
        setAnchorEl(event.currentTarget);
      }
    },
    [scUserContext.user, setAnchorEl, scContext.settings]
  );

  /**
   * Get current translated status
   */
  const getStatus = useMemo((): JSX.Element => {
    let _status: ReactNode = <>Buy event!</>;

    /* switch (status) {
			case SCEventSubscriptionStatusType.REQUESTED:
				_status = <FormattedMessage defaultMessage="ui.eventSubscribeButton.waitingApproval" id="ui.eventSubscribeButton.waitingApproval" />;
				break;
			case SCEventSubscriptionStatusType.GOING:
				_status = <FormattedMessage defaultMessage="ui.eventSubscribeButton.going" id="ui.eventSubscribeButton.going" />;
				break;
			default:
				break;
		} */

    return _status;
  }, [status, scEvent]);

  if (!scEvent || (isEventAdmin && user?.id === scUserContext.user.id) || (isEventAdmin && !user?.id)) {
    return null;
  }

  return (
    <>
      <RequestRoot
        className={classNames(classes.requestRoot, className)}
        variant="contained"
        color="secondary"
        size="small"
        startIcon={<Icon>card_giftcard</Icon>}
        // loading={scUserContext.user ? scEventsManager.isLoading(scEvent) : null}
        onClick={handleOpen}
        {...rest}>
        {getStatus}
      </RequestRoot>
      {open && (
        <>
          {isMobile ? (
            <SwipeableDrawerRoot
              className={classes.drawerRoot}
              PaperProps={{className: classes.paper}}
              open
              onClose={handleClose}
              onOpen={handleOpen}
              anchor="bottom"
              disableSwipeToOpen>
              <ContentObjectPrices contentType={SCContentType.EVENT} id={scEvent.id} />
            </SwipeableDrawerRoot>
          ) : (
            <ContentObjectPricesDialog open ContentObjectPricesComponentProps={{contentType: SCContentType.EVENT, id: scEvent.id}} />
          )}
        </>
      )}
    </>
  );
}
