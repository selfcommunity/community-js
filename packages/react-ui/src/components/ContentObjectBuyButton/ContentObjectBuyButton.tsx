import {LoadingButton} from '@mui/lab';
import {Icon, SwipeableDrawer, Typography, useMediaQuery, useTheme} from '@mui/material';
import {styled} from '@mui/material/styles';
import {useThemeProps} from '@mui/system';
import {SCContextType, SCThemeType, SCUserContextType, useSCContext, useSCUser} from '@selfcommunity/react-core';
import {
  SCContentProduct,
  SCContentType,
  SCEventSubscriptionStatusType,
  SCGroupSubscriptionStatusType,
  SCPurchasableContent
} from '@selfcommunity/types';
import classNames from 'classnames';
import React, {MouseEvent, ReactNode, useCallback, useEffect, useMemo, useState} from 'react';
import {FormattedMessage} from 'react-intl';
import ContentObjectProductsDialog from '../ContentObjectProductsDialog';
import ContentObjectProducts from '../ContentObjectProducts';
import {CategoryApiClient, GroupApiClient, EventApiClient} from '@selfcommunity/api-services';
import {capitalize} from '@selfcommunity/utils';

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

export interface ContentObjectBuyButtonProps {
  /**
   * Overrides or extends the styles applied to the component.
   * @default null
   */
  className?: string;

  /**
   * Content type
   */
  contentType: SCContentType;

  /**
   * Content id
   */
  id: number | string;

  /**
   * Purchasable Content
   */
  content?: SCPurchasableContent;

  /**
   * Prefetched products
   */
  prefetchedProducts?: SCContentProduct[];

  /**
   * onPurchase callback
   * @param user
   * @param joined
   */
  onPurchase?: (contentType: SCContentType, id: number) => any;

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

  const {className, id, contentType, content, onPurchase, ...rest} = props;

  // STATE
  const [open, setOpen] = useState<boolean>(false);

  // CONTEXT
  const scContext: SCContextType = useSCContext();
  const scUserContext: SCUserContextType = useSCUser();
  const theme = useTheme<SCThemeType>();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  // CONST
  const [purchased, setPurchased] = useState<boolean | null>(null);
  const [btnLabel, setBtnLabel] = useState<ReactNode>(
    <FormattedMessage defaultMessage={`ui.contentObjectBuyButton.buy${contentType}`} id={`ui.contentObjectBuyButton.buy${capitalize(contentType)}`} />
  );

  // HANDLERS
  const handleClose = useCallback(() => {
    setOpen(false);
  }, [open]);

  const handleOpen = useCallback(
    (e: MouseEvent<HTMLElement>) => {
      if (!open) {
        if (!scUserContext.user) {
          scContext.settings.handleAnonymousAction();
        } else {
          setOpen(true);
        }
      }
    },
    [scUserContext.user, open, scContext.settings]
  );

  /**
   * Get current status
   */
  const getStatus = () => {
    switch (contentType) {
      case SCContentType.EVENT:
        // Get status event subscribed
        EventApiClient.getSpecificEventInfo(id ? id : content.id).then((data) => {
          if (scUserContext.user && data?.managed_by?.id !== scUserContext.user.id) {
            if (data.subscription_status === SCEventSubscriptionStatusType.GOING) {
              setBtnLabel(<FormattedMessage defaultMessage="ui.contentObjectBuyButton.purchased" id="ui.contentObjectBuyButton.purchased" />);
            }
            setPurchased(data.subscription_status === SCEventSubscriptionStatusType.GOING);
          }
        });
        break;
      case SCContentType.CATEGORY:
        // Get status category followed
        CategoryApiClient.getSpecificCategory(id ? id : content.id).then((data) => {
          if (data.followed) {
            setBtnLabel(<FormattedMessage defaultMessage="ui.contentObjectBuyButton.subscribed" id="ui.contentObjectBuyButton.subscribed" />);
          }
          setPurchased(data.followed);
        });
        break;
      case SCContentType.GROUP:
        // Get status group subscribed
        GroupApiClient.getSpecificGroupInfo(id ? id : content.id).then((data) => {
          if (scUserContext.user && data?.managed_by?.id !== scUserContext.user.id) {
            if (data.subscription_status === SCGroupSubscriptionStatusType.SUBSCRIBED) {
              setBtnLabel(<FormattedMessage defaultMessage="ui.contentObjectBuyButton.subscribed" id="ui.contentObjectBuyButton.subscribed" />);
            }
            setPurchased(data.subscription_status === SCGroupSubscriptionStatusType.SUBSCRIBED);
          }
        });
        break;
      default:
        break;
    }
  };

  useEffect(() => {
    if ((id || content) && contentType) {
      getStatus();
    }
  }, [id, content, contentType]);

  if ((!id && !content) || !scUserContext.user) {
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
        loading={scUserContext.user && purchased !== null ? Boolean(purchased) : null}
        onClick={handleOpen}
        disabled={purchased}
        {...rest}>
        {btnLabel}
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
              <Typography variant="h5" component="div" marginBottom={2}>
                <b>
                  <FormattedMessage id="ui.contentObjectProductsDialog.title" defaultMessage="ui.contentObjectProductsDialog.title" />
                </b>
              </Typography>
              <ContentObjectProducts contentType={SCContentType.EVENT} id={id} />
            </SwipeableDrawerRoot>
          ) : (
            <ContentObjectProductsDialog
              open
              onClose={handleClose}
              ContentObjectPricesComponentProps={{contentType, id: id, ...(content && {content})}}
            />
          )}
        </>
      )}
    </>
  );
}
