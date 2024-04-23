import React, {useEffect, useMemo, useState} from 'react';
import {styled} from '@mui/material/styles';
import {Box, Button, Grid, TextField, Typography} from '@mui/material';
import {SCGroupType} from '@selfcommunity/types';
import {Endpoints, GroupService, http, HttpResponse, SCPaginatedResponse} from '@selfcommunity/api-services';
import {Logger, sortByAttr} from '@selfcommunity/utils';
import {SCPreferences, SCPreferencesContextType, SCUserContextType, useSCPreferences, useSCUser} from '@selfcommunity/react-core';
import Skeleton from './Skeleton';
import {FormattedMessage} from 'react-intl';
import classNames from 'classnames';
import {SCOPE_SC_UI} from '../../constants/Errors';
import {useThemeProps} from '@mui/system';
import HiddenPlaceholder from '../../shared/HiddenPlaceholder';
import {PREFIX} from './constants';
import Group, {GroupProps, GroupSkeleton} from '../Group';
import {DEFAULT_PAGINATION_LIMIT, DEFAULT_PAGINATION_OFFSET} from '../../constants/Pagination';
import InfiniteScroll from '../../shared/InfiniteScroll';

const classes = {
  root: `${PREFIX}-root`,
  filters: `${PREFIX}-filter`,
  groups: `${PREFIX}-groups`,
  item: `${PREFIX}-item`,
  noResults: `${PREFIX}-no-results`,
  showMore: `${PREFIX}-show-more`,
  endMessage: `${PREFIX}-end-message`
};

const Root = styled(Box, {
  name: PREFIX,
  slot: 'Root'
})(() => ({}));

export interface GroupsProps {
  /**
   * Overrides or extends the styles applied to the component.
   * @default null
   */
  className?: string;
  /**
   * Feed API Query Params
   * @default [{'limit': 10, 'offset': 0}]
   */
  endpointQueryParams?: Record<string, string | number>;

  /**
   * Props to spread to single group object
   * @default {variant: 'outlined', ButtonBaseProps: {disableRipple: 'true'}}
   */
  GroupComponentProps?: GroupProps;

  /** If true, it means that the endpoint fetches all groups available
   * @default true
   */

  general: boolean;

  /**
   * Show/Hide filters
   * @default false
   */
  showFilters?: boolean;

  /**
   * Override filter func
   * @default null
   */
  handleFilterGroups?: (groups: SCGroupType[]) => SCGroupType[];

  /**
   * Filters component
   * @param props
   */
  filters?: JSX.Element;
  /**
   * Other props
   */
  [p: string]: any;
}

/**
 * > API documentation for the Community-JS Groups component. Learn about the available props and the CSS API.
 *
 *
 * This component renders the list of the follows of the given group.
 * Take a look at our <strong>demo</strong> component [here](/docs/sdk/community-js/react-ui/Components/Groups)

 #### Import

 ```jsx
 import {Groups} from '@selfcommunity/react-ui';
 ```

 #### Component Name

 The name `SCGroups` can be used when providing style overrides in the theme.


 #### CSS

 |Rule Name|Global class|Description|
 |---|---|---|
 |root|.SCGroups-root|Styles applied to the root element.|
 |title|.SCGroups-title|Styles applied to the title element.|
 |noResults|.SCGroups-no-results|Styles applied to no results section.|
 |showMore|.SCGroups-show-more|Styles applied to show more button element.|
 |dialogRoot|.SCGroups-dialog-root|Styles applied to the dialog root element.|
 |endMessage|.SCGroups-end-message|Styles applied to the end message element.|

 * @param inProps
 */
export default function Groups(inProps: GroupsProps): JSX.Element {
  // PROPS
  const props: GroupsProps = useThemeProps({
    props: inProps,
    name: PREFIX
  });
  const {
    endpointQueryParams = {limit: DEFAULT_PAGINATION_LIMIT, offset: DEFAULT_PAGINATION_OFFSET},
    className,
    GroupComponentProps = {variant: 'outlined', ButtonBaseProps: {disableRipple: true, component: Box}},
    showFilters = false,
    filters,
    handleFilterGroups,
    general = true,
    ...rest
  } = props;

  // STATE
  const [groups, setGroups] = useState<SCGroupType[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [next, setNext] = useState<string>(null);
  const [filterName, setFilterName] = useState<string>('');

  // CONTEXT
  const scUserContext: SCUserContextType = useSCUser();
  const scPreferencesContext: SCPreferencesContextType = useSCPreferences();

  // MEMO
  const contentAvailability = useMemo(
    () =>
      SCPreferences.CONFIGURATIONS_CONTENT_AVAILABILITY in scPreferencesContext.preferences &&
      scPreferencesContext.preferences[SCPreferences.CONFIGURATIONS_CONTENT_AVAILABILITY].value,
    [scPreferencesContext.preferences]
  );

  // CONST
  const authUserId = scUserContext.user ? scUserContext.user.id : null;

  // HANDLERS
  const handleScrollUp = () => {
    window.scrollTo({left: 0, top: 0, behavior: 'smooth'});
  };

  /**
   * Fetches groups list
   */
  const fetchGroups = () => {
    let groupService;
    if (general) {
      groupService = GroupService.searchGroups(endpointQueryParams);
    } else {
      groupService = GroupService.getUserGroups(endpointQueryParams);
    }
    groupService
      .then((res: SCPaginatedResponse<SCGroupType>) => {
        setGroups(res.results);
        setNext(res.next);
        setLoading(false);
      })
      .catch((error) => {
        Logger.error(SCOPE_SC_UI, error);
      });
  };

  /**
   * On mount, fetches groups list
   */
  useEffect(() => {
    if (!contentAvailability && !authUserId) {
      return;
    } else {
      fetchGroups();
    }
  }, [contentAvailability, authUserId]);

  const handleSubscribe = (group) => {
    if (!general) {
      const newGroups = [...groups];
      const _updated = newGroups.filter((g) => g.id !== group.id);
      setGroups(_updated);
    }
  };

  const handleNext = useMemo(
    () => () => {
      if (!next) {
        return;
      }
      return http
        .request({
          url: next,
          method: general ? Endpoints.SearchGroups.method : Endpoints.GetUserGroups.method
        })
        .then((res: HttpResponse<any>) => {
          setGroups([...groups, ...res.data.results]);
          setNext(res.data.next);
        })
        .catch((error) => console.log(error))
        .then(() => setLoading(false));
    },
    [next]
  );

  /**
   * Get groups filtered
   */
  const getFilteredGroups = () => {
    if (handleFilterGroups) {
      return handleFilterGroups(groups);
    }
    if (filterName) {
      return groups.filter((g) => g.name.toLowerCase().includes(filterName.toLowerCase()));
    }
    return groups;
  };

  /**
   * Handle change filter name
   * @param event
   */
  const handleOnChangeFilterName = (event: React.ChangeEvent<HTMLInputElement>) => {
    setFilterName(event.target.value);
  };

  /**
   * Renders groups list
   */
  const filteredGroups = sortByAttr(getFilteredGroups(), 'order');
  const content = (
    <>
      {showFilters && (
        <Grid container direction="row" justifyContent="center" alignItems="center" className={classes.filters}>
          {filters ? (
            filters
          ) : (
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                value={filterName}
                label={<FormattedMessage id="ui.groups.filterByName" defaultMessage="ui.groups.filterByName" />}
                variant="outlined"
                onChange={handleOnChangeFilterName}
                disabled={loading}
              />
            </Grid>
          )}
        </Grid>
      )}
      <>
        {!groups.length ? (
          <Box className={classes.noResults}>
            <Typography variant="h4">
              <FormattedMessage id="ui.groups.noGroups.title" defaultMessage="ui.groups.noGroups.title" />
            </Typography>
            <Typography variant="body1">
              <FormattedMessage id="ui.groups.noGroups.subtitle" defaultMessage="ui.groups.noGroups.subtitle" />
            </Typography>
          </Box>
        ) : (
          <InfiniteScroll
            dataLength={groups.length}
            next={handleNext}
            hasMoreNext={Boolean(next)}
            loaderNext={<GroupSkeleton />}
            endMessage={
              <Typography component="div" className={classes.endMessage}>
                <FormattedMessage
                  id="ui.groups.endMessage"
                  defaultMessage="ui.groups.endMessage"
                  values={{
                    button: (chunk) => (
                      <Button color="secondary" variant="text" onClick={handleScrollUp}>
                        {chunk}
                      </Button>
                    )
                  }}
                />
              </Typography>
            }>
            <Grid container spacing={{xs: 2}} className={classes.groups}>
              {filteredGroups.map((group: SCGroupType) => (
                <Grid item xs={12} sm={8} md={6} key={group.id} className={classes.item}>
                  <Group group={group} groupId={group.id} groupSubscribeButtonProps={{onSubscribe: handleSubscribe}} {...GroupComponentProps} />
                </Grid>
              ))}
            </Grid>
          </InfiniteScroll>
        )}
      </>
    </>
  );
  // RENDER
  if (!contentAvailability && !scUserContext.user) {
    return <HiddenPlaceholder />;
  }
  if (loading) {
    return <Skeleton />;
  }

  return (
    <Root className={classNames(classes.root, className)} {...rest}>
      {content}
    </Root>
  );
}
