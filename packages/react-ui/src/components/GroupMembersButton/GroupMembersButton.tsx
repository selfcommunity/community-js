import React, {useEffect, useMemo, useState} from 'react';
import {styled} from '@mui/material/styles';
import {Avatar, AvatarGroup, Button, List, ListItem, Typography, useTheme} from '@mui/material';
import BaseDialog, {BaseDialogProps} from '../../shared/BaseDialog';
import {FormattedMessage} from 'react-intl';
import InfiniteScroll from '../../shared/InfiniteScroll';
import User, {UserSkeleton} from '../User';
import {Endpoints, GroupService, http, HttpResponse, SCPaginatedResponse} from '@selfcommunity/api-services';
import {SCThemeType, useSCFetchGroup} from '@selfcommunity/react-core';
import {SCGroupPrivacyType, SCGroupType, SCUserType} from '@selfcommunity/types';
import AvatarGroupSkeleton from '../Skeleton/AvatarGroupSkeleton';
import classNames from 'classnames';
import {useThemeProps} from '@mui/system';
import useMediaQuery from '@mui/material/useMediaQuery';
import {ButtonProps} from '@mui/material/Button/Button';
import {Logger} from '@selfcommunity/utils';
import {SCOPE_SC_UI} from '../../constants/Errors';
import {useDeepCompareEffectNoCheck} from 'use-deep-compare-effect';

const PREFIX = 'SCGroupMembersButton';

const classes = {
  root: `${PREFIX}-root`,
  dialogRoot: `${PREFIX}-dialog-root`,
  endMessage: `${PREFIX}-end-message`
};

const Root = styled(Button, {
  name: PREFIX,
  slot: 'Root',
  overridesResolver: (props, styles) => styles.root
})(() => ({}));

const DialogRoot = styled(BaseDialog, {
  name: PREFIX,
  slot: 'Root',
  overridesResolver: (props, styles) => styles.dialogRoot
})(() => ({}));

export interface GroupMembersButtonProps extends Pick<ButtonProps, Exclude<keyof ButtonProps, 'onClick' | 'disabled'>> {
  /**
   * Group Object
   * @default null
   */
  group?: SCGroupType;

  /**
   * Id of the group
   * @default null
   */
  groupId?: number | string;

  /**
   * Props to spread to followedBy dialog
   * @default {}
   */
  DialogProps?: BaseDialogProps;
  /**
   * Hides this component
   * @default false
   */
  autoHide?: boolean;
  /**
   * Any other properties
   */
  [p: string]: any;
}

/**
 *> API documentation for the Community-JS Group Members Button component. Learn about the available props and the CSS API.
 *
 #### Import
 ```jsx
 import {GroupMembersButton} from '@selfcommunity/react-ui';
 ```
 #### Component Name

 The name `SCGroupMembersButton` can be used when providing style overrides in the theme.

 * #### CSS
 *
 |Rule Name|Global class|Description|
 |---|---|---|
 |root|.SCGroupMembersButton-root|Styles applied to the root element.|
 |dialogRoot|.SCGroupMembersButton-dialog-root|Styles applied to the root element.|
 |endMessage|.SCCategoriesFollowedWidget-end-message|Styles applied to the end message element.|

 * @param inProps
 */
export default function GroupMembersButton(inProps: GroupMembersButtonProps): JSX.Element {
  // PROPS
  const props: GroupMembersButtonProps = useThemeProps({
    props: inProps,
    name: PREFIX
  });

  const {className, groupId, group, DialogProps = {}, autoHide = false, ...rest} = props;

  // STATE
  const [loading, setLoading] = useState<boolean>(true);
  const [next, setNext] = useState<string>(null);
  const [offset, setOffset] = useState<number | null>(null);
  const [members, setMembers] = useState<SCUserType[]>([]);
  const [open, setOpen] = useState<boolean>(false);

  // HOOKS
  const {scGroup} = useSCFetchGroup({id: groupId, group});

  // FETCH FIRST FOLLOWERS
  useDeepCompareEffectNoCheck(() => {
    if (!scGroup || (scGroup && scGroup.privacy !== SCGroupPrivacyType.PUBLIC && autoHide)) {
      return;
    }
    if (members.length === 0) {
      GroupService.getGroupMembers(scGroup.id, {limit: 3}).then((res: SCPaginatedResponse<SCUserType>) => {
        setMembers([...res.results]);
        setOffset(3);
        setLoading(false);
      });
    } else {
      setOffset(0);
    }
  }, [scGroup]);

  useEffect(() => {
    if (open && offset !== null) {
      setLoading(true);
      GroupService.getGroupMembers(scGroup.id, {offset, limit: 20}).then((res: SCPaginatedResponse<SCUserType>) => {
        setMembers([...(offset === 0 ? [] : members), ...res.results]);
        setNext(res.next);
        setLoading(false);
        setOffset(null);
      });
    }
  }, [open, members, offset]);

  /**
   * Memoized fetchMembers
   */
  const fetchMembers = useMemo(
    () => (): void => {
      if (!next) {
        return;
      }
      http
        .request({
          url: next,
          method: Endpoints.GetGroupSubscribers.method
        })
        .then((res: HttpResponse<any>) => {
          setMembers([...members, ...res.data.results]);
          setNext(res.data.next);
        })
        .catch((error) => Logger.error(SCOPE_SC_UI, error))
        .then(() => setLoading(false));
    },
    [members, scGroup, next]
  );

  /**
   * Opens dialog votes
   */
  const handleToggleDialogOpen = useMemo(
    () => (): void => {
      setOpen((prev) => !prev);
    },
    [setOpen]
  );

  // RENDER
  const theme = useTheme<SCThemeType>();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  return (
    <>
      <Root
        className={classNames(classes.root, className)}
        onClick={handleToggleDialogOpen}
        disabled={loading || !scGroup || scGroup.subscribers_counter === 0}
        {...rest}>
        {loading || !scGroup ? (
          <AvatarGroupSkeleton {...rest} />
        ) : (
          <AvatarGroup total={scGroup.subscribers_counter}>
            {members.map((c: SCUserType) => (
              <Avatar key={c.id} alt={c.username} src={c.avatar} />
            ))}
          </AvatarGroup>
        )}
      </Root>
      {open && (
        <DialogRoot
          className={classes.dialogRoot}
          title={
            <FormattedMessage
              defaultMessage="ui.groupMembersButton.dialogTitle"
              id="ui.groupMembersButton.dialogTitle"
              values={{total: scGroup.subscribers_counter}}
            />
          }
          onClose={handleToggleDialogOpen}
          open={open}
          {...DialogProps}>
          <InfiniteScroll
            dataLength={members.length}
            next={fetchMembers}
            hasMoreNext={next !== null || loading}
            loaderNext={<UserSkeleton elevation={0} />}
            height={isMobile ? '100%' : 400}
            endMessage={
              <Typography className={classes.endMessage}>
                <FormattedMessage id="ui.groupMembersButton.noOtherMembers" defaultMessage="ui.groupMembersButton.noOtherMembers" />
              </Typography>
            }>
            <List>
              {members.map((member: SCUserType) => (
                <ListItem key={member.id}>
                  <User elevation={0} user={member} />
                </ListItem>
              ))}
            </List>
          </InfiniteScroll>
        </DialogRoot>
      )}
    </>
  );
}
