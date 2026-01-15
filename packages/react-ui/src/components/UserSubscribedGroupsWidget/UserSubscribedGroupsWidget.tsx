import React, {useEffect, useMemo, useReducer, useState} from 'react';
import {Button, CardContent, ListItem, Typography, styled, List} from '@mui/material';
import {GroupService, SCPaginatedResponse} from '@selfcommunity/api-services';
import {CacheStrategies, isInteger, Logger} from '@selfcommunity/utils';
import {SCCache, SCPreferences, SCPreferencesContextType, SCUserContextType, useSCPreferences, useSCUser} from '@selfcommunity/react-core';
import {actionWidgetTypes, dataWidgetReducer, stateWidgetInitializer} from '../../utils/widget';
import {SCFeatureName, SCGroupPrivacyType, SCGroupSubscriptionStatusType, SCGroupType} from '@selfcommunity/types';
import {SCOPE_SC_UI} from '../../constants/Errors';
import {FormattedMessage} from 'react-intl';
import Skeleton from './Skeleton';
import classNames from 'classnames';
import BaseDialog, {BaseDialogProps} from '../../shared/BaseDialog';
import Widget, {WidgetProps} from '../Widget';
import {useThemeProps} from '@mui/system';
import HiddenPlaceholder from '../../shared/HiddenPlaceholder';
import {VirtualScrollerItemProps} from '../../types/virtualScroller';
import {PREFIX} from './constants';
import Group, {GroupProps, GroupSkeleton} from '../Group';

const classes = {
  root: `${PREFIX}-root`,
  title: `${PREFIX}-title`,
  noResults: `${PREFIX}-no-results`,
  showMore: `${PREFIX}-show-more`,
  dialogRoot: `${PREFIX}-dialog-root`,
  endMessage: `${PREFIX}-end-message`
};

const Root = styled(Widget, {
  name: PREFIX,
  slot: 'Root'
})(() => ({}));

const DialogRoot = styled(BaseDialog, {
  name: PREFIX,
  slot: 'DialogRoot'
})(() => ({}));

export interface UserSubscribedGroupsWidgetProps extends VirtualScrollerItemProps, WidgetProps {
  /**
   * The user id
   * @default null
   */
  userId: number;
  /**
   * Hides this component
   * @default false
   */
  autoHide?: boolean;
  /**
   * Limit the number of groups to show
   * @default false
   */
  limit?: number;
  /**
   * Props to spread to single group object
   * @default empty object
   */
  GroupProps?: GroupProps;

  /**
   * Caching strategies
   * @default CacheStrategies.CACHE_FIRST
   */
  cacheStrategy?: CacheStrategies;

  /**
   * Props to spread to subscribed groups dialog
   * @default {}
   */
  DialogProps?: BaseDialogProps;

  /**
   * Other props
   */
  [p: string]: any;
}

/**
 * > API documentation for the Community-JS User Profile Groups Subscribed Widget component. Learn about the available props and the CSS API.
 *
 *
 * This component renders the list of the groups that the given user follows.
 * Take a look at our <strong>demo</strong> component [here](/docs/sdk/community-js/react-ui/Components/UserSubscribedGroups)

 #### Import
 ```jsx
 import {UserSubscribedGroupsWidget} from '@selfcommunity/react-ui';
 ```
 #### Component Name
 The name `SCUserSubscribedGroupsWidget` can be used when providing style overrides in the theme.

 #### CSS

 |Rule Name|Global class|Description|
 |---|---|---|
 |root|.SCUserSubscribedGroupsWidget-root|Styles applied to the root element.|
 |title|.SCUserSubscribedGroupsWidget-title|Styles applied to the title element.|
 |noResults|.SCUserSubscribedGroupsWidget-no-results|Styles applied to no results section.|
 |showMore|.SCUserSubscribedGroupsWidget-show-more|Styles applied to show more button element.|
 |dialogRoot|.SCUserSubscribedGroupsWidget-dialog-root|Styles applied to the root dialog element.|
 |endMessage|.SCUserSubscribedGroupsWidget-end-message|Styles applied to the end message element.|
 * @param inProps
 */
export default function UserSubscribedGroupsWidget(inProps: UserSubscribedGroupsWidgetProps): JSX.Element {
  // PROPS
  const props: UserSubscribedGroupsWidgetProps = useThemeProps({
    props: inProps,
    name: PREFIX
  });
  const {
    userId,
    autoHide,
    limit = 3,
    className,
    GroupProps = {},
    cacheStrategy = CacheStrategies.NETWORK_ONLY,
    onHeightChange,
    onStateChange,
    DialogProps = {},
    ...rest
  } = props;

  // CONTEXT
  const scUserContext: SCUserContextType = useSCUser();
  const isMe = useMemo(() => scUserContext.user && userId === scUserContext.user.id, [scUserContext.user, userId]);
  const {preferences, features}: SCPreferencesContextType = useSCPreferences();
  const groupsEnabled = useMemo(
    () =>
      preferences &&
      features &&
      features.includes(SCFeatureName.TAGGING) &&
      features.includes(SCFeatureName.GROUPING) &&
      SCPreferences.CONFIGURATIONS_GROUPS_ENABLED in preferences &&
      preferences[SCPreferences.CONFIGURATIONS_GROUPS_ENABLED].value,
    [preferences, features]
  );
  // STATE
  const [state, dispatch] = useReducer(
    dataWidgetReducer,
    {
      isLoadingNext: false,
      next: null,
      cacheKey: SCCache.getWidgetStateCacheKey(SCCache.GROUPS_SUBSCRIBED_TOOLS_STATE_CACHE_PREFIX_KEY, userId),
      cacheStrategy
    },
    stateWidgetInitializer
  );
  const [openDialog, setOpenDialog] = useState<boolean>(false);

  /**
   * Initialize component
   * Fetch data only if the component is not initialized and it is not loading data
   */
  const _initComponent = useMemo(
    () => (): void => {
      if (!state.initialized && !state.isLoadingNext) {
        GroupService.getUserSubscribedGroups(userId)
          .then((groups: SCPaginatedResponse<SCGroupType>) => {
            dispatch({
              type: actionWidgetTypes.LOAD_NEXT_SUCCESS,
              payload: {
                count: groups.count,
                results: groups.results,
                initialized: true
              }
            });
          })
          .catch((error) => {
            dispatch({type: actionWidgetTypes.LOAD_NEXT_FAILURE, payload: {errorLoadNext: error}});
            Logger.error(SCOPE_SC_UI, error);
          });
      }
    },
    [state.isLoadingNext, state.initialized, userId, dispatch]
  );

  // EFFECTS
  useEffect(() => {
    let _t;
    if (groupsEnabled && isInteger(userId) && scUserContext.user !== undefined) {
      _t = setTimeout(_initComponent);
      return (): void => {
        _t && clearTimeout(_t);
      };
    }
  }, [scUserContext.user, groupsEnabled, userId]);

  /**
   * Virtual feed update
   */
  useEffect(() => {
    onHeightChange && onHeightChange();
  }, [state.results.length]);

  useEffect(() => {
    if (!groupsEnabled && !scUserContext.user && !isInteger(userId)) {
      return;
    } else if (cacheStrategy === CacheStrategies.NETWORK_ONLY) {
      onStateChange && onStateChange({cacheStrategy: CacheStrategies.CACHE_FIRST});
    }
  }, [groupsEnabled, cacheStrategy, scUserContext.user, userId]);

  // HANDLERS
  const handleOnSubscribe = (group): void => {
    if (isMe) {
      const newGroups = [...state.results];
      const index = newGroups.findIndex((u) => u.id === group.id);
      if (index !== -1) {
        if (group.subscription_status === SCGroupSubscriptionStatusType.SUBSCRIBED) {
          newGroups[index].subscribers_counter = group.subscribers_counter - 1;
          newGroups[index].subscription_status = null;
        } else {
          newGroups[index].subscribers_counter =
            group.privacy === SCGroupPrivacyType.PUBLIC ? group.subscribers_counter + 1 : group.subscribers_counter;
          newGroups[index].subscription_status =
            group.privacy === SCGroupPrivacyType.PUBLIC ? SCGroupSubscriptionStatusType.SUBSCRIBED : SCGroupSubscriptionStatusType.REQUESTED;
        }
        dispatch({type: actionWidgetTypes.SET_RESULTS, payload: {results: newGroups}});
      }
    }
  };

  const handleToggleDialogOpen = (): void => {
    setOpenDialog((prev) => !prev);
  };

  // RENDER
  if (!groupsEnabled || (autoHide && !state.count && state.initialized) || !userId) {
    return <HiddenPlaceholder />;
  }
  if (!state.initialized) {
    return <Skeleton />;
  }

  const content = (
    <CardContent>
      <Typography className={classes.title} variant="h5">
        <FormattedMessage
          id="ui.userSubscribedGroupsWidget.title"
          defaultMessage="ui.userSubscribedGroupsWidget.title"
          values={{
            total: isMe ? state.results.filter((g) => g.subscription_status === SCGroupSubscriptionStatusType.SUBSCRIBED).length : state.count
          }}
        />
      </Typography>
      {!state.count ? (
        <Typography className={classes.noResults} variant="body2">
          <FormattedMessage id="ui.userSubscribedGroupsWidget.subtitle.noResults" defaultMessage="ui.userSubscribedGroupsWidget.subtitle.noResults" />
        </Typography>
      ) : (
        <React.Fragment>
          <List>
            {state.results.slice(0, limit).map((group: SCGroupType) => (
              <ListItem key={group.id}>
                <Group elevation={0} group={group} GroupSubscribeButtonComponentProps={{onSubscribe: handleOnSubscribe}} {...GroupProps} />
              </ListItem>
            ))}
          </List>
          {limit < state.count && (
            <Button className={classes.showMore} onClick={handleToggleDialogOpen}>
              <FormattedMessage id="ui.userSubscribedGroupsWidget.button.showAll" defaultMessage="ui.userSubscribedGroupsWidget.button.showAll" />
            </Button>
          )}
          {openDialog && (
            <DialogRoot
              className={classes.dialogRoot}
              title={
                <FormattedMessage
                  id="ui.userSubscribedGroupsWidget.title"
                  defaultMessage="ui.userSubscribedGroupsWidget.title"
                  values={{total: state.count}}
                />
              }
              onClose={handleToggleDialogOpen}
              open={openDialog}
              scroll="paper"
              {...DialogProps}>
              <List>
                {state.results.map((g) => (
                  <ListItem key={g.id}>
                    <Group elevation={0} group={g} groupSubscribeButtonProps={{onSubscribe: handleOnSubscribe}} {...GroupProps} />
                  </ListItem>
                ))}
                {state.isLoadingNext && (
                  <ListItem>
                    <GroupSkeleton elevation={0} {...GroupProps} />
                  </ListItem>
                )}
              </List>
              <Typography className={classes.endMessage}>
                <FormattedMessage id="ui.userSubscribedGroupsWidget.noMoreResults" defaultMessage="ui.userSubscribedGroupsWidget.noMoreResults" />
              </Typography>
            </DialogRoot>
          )}
        </React.Fragment>
      )}
    </CardContent>
  );
  return (
    <Root className={classNames(classes.root, className)} {...rest}>
      {content}
    </Root>
  );
}
