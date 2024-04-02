import React, {useEffect, useMemo, useState} from 'react';
import {styled} from '@mui/material/styles';
import {Box, Grid, Typography} from '@mui/material';
import {SCGroupType} from '@selfcommunity/types';
import {http, EndpointType} from '@selfcommunity/api-services';
import {Logger} from '@selfcommunity/utils';
import {
  SCPreferences,
  SCPreferencesContextType,
  SCUserContextType,
  useIsComponentMountedRef,
  useSCPreferences,
  useSCUser
} from '@selfcommunity/react-core';
import Skeleton from './Skeleton';
import {FormattedMessage} from 'react-intl';
import classNames from 'classnames';
import {SCOPE_SC_UI} from '../../constants/Errors';
import {useThemeProps} from '@mui/system';
import HiddenPlaceholder from '../../shared/HiddenPlaceholder';
import {PREFIX} from './constants';
import Group, {GroupProps} from '../Group';
import {AxiosResponse} from 'axios';

const classes = {
  root: `${PREFIX}-root`,
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
   * Endpoint to call
   */
  endpoint: EndpointType;
  /**
   * Props to spread to single group object
   * @default {variant: 'outlined', ButtonBaseProps: {disableRipple: 'true'}}
   */
  GroupComponentProps?: GroupProps;
  /**
   * Prefetch groups. Useful for SSR.
   * Use this to init the component with groups
   * @default null
   */
  prefetchedGroups?: SCGroupType[];

  /** If true, it means that the endpoint fetches all groups available
   * @default null
   */
  general?: boolean;
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
    endpoint,
    className,
    GroupComponentProps = {variant: 'outlined', ButtonBaseProps: {disableRipple: true, component: Box}},
    prefetchedGroups = [],
    general,
    ...rest
  } = props;

  // STATE
  const [groups, setGroups] = useState<SCGroupType[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

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

  // REFS
  const isMountedRef = useIsComponentMountedRef();

  /**
   * Fetches groups list
   */
  const fetchGroups = async (next: string = endpoint.url({})): Promise<[]> => {
    const response: AxiosResponse<any> = await http.request({
      url: next,
      method: endpoint.method
    });
    const data = response.data;
    return data.next ? data.results.concat(await fetchGroups(data.next)) : data.results;
  };

  /**
   * On mount, fetches groups list
   */
  useEffect(() => {
    if (!contentAvailability && !authUserId) {
      return;
    } else if (prefetchedGroups.length) {
      setGroups(prefetchedGroups);
      setLoading(false);
    } else {
      fetchGroups()
        .then((data: any) => {
          if (isMountedRef.current) {
            setGroups(data);
            setLoading(false);
          }
        })
        .catch((error) => {
          Logger.error(SCOPE_SC_UI, error);
        });
    }
  }, [contentAvailability, authUserId, prefetchedGroups.length]);

  const handleSubscribe = (group) => {
    if (!general) {
      const newGroups = [...groups];
      const _updated = newGroups.filter((g) => g.id !== group.id);
      setGroups(_updated);
    }
  };

  // RENDER
  if (!contentAvailability && !scUserContext.user) {
    return <HiddenPlaceholder />;
  }
  const content = (
    <>
      {loading ? (
        <Skeleton />
      ) : (
        <Grid container spacing={{xs: 3}} className={classes.groups}>
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
            <>
              {groups.map((group: SCGroupType) => (
                <Grid item xs={12} sm={8} md={6} key={group.id} className={classes.item}>
                  <Group group={group} groupId={group.id} groupSubscribeButtonProps={{onSubscribe: handleSubscribe}} {...GroupComponentProps} />
                </Grid>
              ))}
            </>
          )}
        </Grid>
      )}
    </>
  );
  return (
    <Root className={classNames(classes.root, className)} {...rest}>
      {content}
    </Root>
  );
}
