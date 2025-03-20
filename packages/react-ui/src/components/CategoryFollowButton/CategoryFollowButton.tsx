import React, {useEffect, useMemo, useState} from 'react';
import {styled} from '@mui/material/styles';
import {CacheStrategies, Logger} from '@selfcommunity/utils';
import {
  SCContextType,
  SCFollowedCategoriesManagerType,
  SCUserContextType,
  useSCContext,
  useSCFetchCategory,
  useSCPaymentsEnabled,
  useSCUser
} from '@selfcommunity/react-core';
import {SCCategoryAutoFollowType, SCCategoryType, SCContentType} from '@selfcommunity/types';
import {SCOPE_SC_UI} from '../../constants/Errors';
import {LoadingButton} from '@mui/lab';
import {FormattedMessage} from 'react-intl';
import classNames from 'classnames';
import {useThemeProps} from '@mui/system';
import BuyButton from '../BuyButton';

const PREFIX = 'SCCategoryFollowButton';

const classes = {
  root: `${PREFIX}-root`
};

const Root = styled(LoadingButton, {
  name: PREFIX,
  slot: 'Root',
  overridesResolver: (props, styles) => styles.root
})(({theme}) => ({}));

export interface CategoryFollowButtonProps {
  /**
   * Overrides or extends the styles applied to the component.
   * @default null
   */
  className?: string;
  /**
   * Id of the category
   * @default null
   */
  categoryId?: number;

  /**
   * Category Object
   * @default null
   */
  category?: SCCategoryType;

  /**
   * onFollow callback
   * @param user
   * @param followed
   */
  onFollow?: (category: SCCategoryType, followed: boolean) => any;

  /**
   * Disable action if feature payments is enabled and the content is paid item
   */

  disableBuyContentIfPaidContent?: boolean;

  /**
   * Others properties
   */
  [p: string]: any;
}

/**
 * > API documentation for the Community-JS Follow Category Button component. Learn about the available props and the CSS API.

 #### Import

 ```jsx
 import {CategoryFollowButton} from '@selfcommunity/react-ui';
 ```

 #### Component Name

 The name `SCCategoryFollowButton` can be used when providing style overrides in the theme.


 #### CSS

 |Rule Name|Global class|Description|
 |---|---|---|
 |root|.SCCategoryFollowButton-root|Styles applied to the root element.|

 * @param inProps
 */
export default function CategoryFollowButton(inProps: CategoryFollowButtonProps): JSX.Element {
  // PROPS
  const props: CategoryFollowButtonProps = useThemeProps({
    props: inProps,
    name: PREFIX
  });

  const {className, categoryId, category, onFollow, disableBuyContentIfPaidContent, disabled, ...rest} = props;

  // CONTEXT
  const scContext: SCContextType = useSCContext();
  const scUserContext: SCUserContextType = useSCUser();
  const scCategoriesManager: SCFollowedCategoriesManagerType = scUserContext.managers.categories;

  // CONST
  const authUserId = scUserContext.user ? scUserContext.user.id : null;

  // PAYMENTS
  const {isPaymentsEnabled} = useSCPaymentsEnabled();

  const {scCategory} = useSCFetchCategory({
    id: categoryId,
    category,
    cacheStrategy: authUserId ? CacheStrategies.CACHE_FIRST : CacheStrategies.STALE_WHILE_REVALIDATE
  });
  const [followed, setFollowed] = useState<boolean>(null);

  /**
   * Check the button if is disabled
   * Disable action follow/unfollow only if payments feature is active
   * and the category is a paid content and the category isn't paid
   */
  const isActionFollowDisabled = useMemo(
    () => disabled || (scCategory && scUserContext.user && isPaymentsEnabled && scCategory.paywalls?.length > 0 && !scCategory.payment_order),
    [disabled, scCategory, scUserContext.user, isPaymentsEnabled]
  );

  useEffect(() => {
    /**
     * Call scCategoriesManager.isFollowed inside an effect
     * to avoid warning rendering child during update parent state
     */
    if (authUserId) {
      setFollowed(scCategoriesManager.isFollowed(scCategory));
    }
  }, [authUserId, scCategoriesManager.isFollowed]);

  const followCategory = () => {
    scCategoriesManager
      .follow(scCategory)
      .then(() => {
        onFollow && onFollow(scCategory, !followed);
      })
      .catch((e) => {
        Logger.error(SCOPE_SC_UI, e);
      });
  };

  const handleFollowAction = () => {
    if (!scUserContext.user) {
      scContext.settings.handleAnonymousAction();
    } else {
      followCategory();
    }
  };

  if (!scCategory || (scCategory && followed && scCategory.auto_follow === SCCategoryAutoFollowType.FORCED)) {
    return null;
  }

  if (scCategoriesManager.isLoading(scCategory) || followed === null) {
    return (
      <Root size="small" variant="outlined" loading className={classNames(classes.root, className)}>
        <FormattedMessage defaultMessage="ui.categoryFollowButton.follow" id="ui.categoryFollowButton.follow" />
      </Root>
    );
  }

  /**
   * if the category is a paid content and it isn't followed show the Buy button
   */
  if (
    scCategory &&
    scUserContext.user &&
    isPaymentsEnabled &&
    scCategory.paywalls?.length > 0 &&
    (!followed || scCategoriesManager.isLoading(scCategory))
  ) {
    return <BuyButton contentType={SCContentType.CATEGORY} content={scCategory} disabled={disableBuyContentIfPaidContent} />;
  }

  return (
    <Root
      size="small"
      variant="outlined"
      onClick={handleFollowAction}
      loading={scUserContext.user ? scCategoriesManager.isLoading(scCategory) : null}
      className={classNames(classes.root, className)}
      disabled={isActionFollowDisabled}
      {...rest}>
      {followed && scUserContext.user ? (
        <FormattedMessage defaultMessage="ui.categoryFollowButton.unfollow" id="ui.categoryFollowButton.unfollow" />
      ) : (
        <FormattedMessage defaultMessage="ui.categoryFollowButton.follow" id="ui.categoryFollowButton.follow" />
      )}
    </Root>
  );
}
