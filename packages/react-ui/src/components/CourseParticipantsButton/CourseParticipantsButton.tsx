import {Avatar, AvatarGroup, Button, Icon, List, ListItem, Typography} from '@mui/material';
import {ButtonProps} from '@mui/material/Button/Button';
import {styled} from '@mui/material/styles';
import {useThemeProps} from '@mui/system';
import {Endpoints, EventService, http, HttpResponse, SCPaginatedResponse} from '@selfcommunity/api-services';
import {useSCFetchEvent} from '@selfcommunity/react-core';
import {SCEventPrivacyType, SCEventSubscriptionStatusType, SCCourseType, SCUserType} from '@selfcommunity/types';
import {Logger} from '@selfcommunity/utils';
import classNames from 'classnames';
import {useCallback, useEffect, useMemo, useState} from 'react';
import {FormattedMessage} from 'react-intl';
import {useDeepCompareEffectNoCheck} from 'use-deep-compare-effect';
import {SCOPE_SC_UI} from '../../constants/Errors';
import BaseDialog, {BaseDialogProps} from '../../shared/BaseDialog';
import InfiniteScroll from '../../shared/InfiniteScroll';
import {numberFormatter} from '../../utils/buttonCounters';
import AvatarGroupSkeleton from '../Skeleton/AvatarGroupSkeleton';
import User, {UserSkeleton} from '../User';

const PREFIX = 'SCCourseParticipantsButton';

const classes = {
  root: `${PREFIX}-root`,
  participants: `${PREFIX}-participants`,
  dialogRoot: `${PREFIX}-dialog-root`,
  infiniteScroll: `${PREFIX}-infinite-scroll`,
  endMessage: `${PREFIX}-end-message`
};

const Root = styled(Button, {
  name: PREFIX,
  slot: 'Root',
  overridesResolver: (_props, styles) => styles.root,
  shouldForwardProp: (prop) => prop !== 'followers'
})(() => ({}));

const DialogRoot = styled(BaseDialog, {
  name: PREFIX,
  slot: 'DialogRoot',
  overridesResolver: (_props, styles) => styles.dialogRoot
})(() => ({}));

export interface CourseParticipantsButtonProps extends Pick<ButtonProps, Exclude<keyof ButtonProps, 'onClick' | 'disabled'>> {
  /**
   * Course Object
   * @default null
   */
  course?: SCCourseType;

  /**
   * CourseId of course object
   * @default null
   */
  courseId?: number;

  /**
   * Hide button label
   * @default false
   */
  hideCaption?: boolean;

  /**
   * Props to spread to followedBy dialog
   * @default {}
   */
  DialogProps?: BaseDialogProps;

  /**
   * Any other properties
   */
  [p: string]: any;
}

/**
 *> API documentation for the Community-JS Course Participants Button component. Learn about the available props and the CSS API.
 *
 #### Import
 ```jsx
 import {CourseParticipantsButton} from '@selfcommunity/react-ui';
 ```
 #### Component Name

 The name `SCCourseParticipantsButton` can be used when providing style overrides in the theme.

 * #### CSS
 *
 |Rule Name|Global class|Description|
 |---|---|---|
 |root|.SCCourseParticipantsButton-root|Styles applied to the root element.|
 |dialogRoot|.SCCourseParticipantsButton-dialog-root|Styles applied to the root element.|
 |endMessage|.SCCourseParticipantsButton-end-message|Styles applied to the end message element.|

 * @param inProps
 */
export default function CourseParticipantsButton(inProps: CourseParticipantsButtonProps) {
  // PROPS
  const props: CourseParticipantsButtonProps = useThemeProps({
    props: inProps,
    name: PREFIX
  });

  const {className, courseId, course, hideCaption = false, DialogProps = {}, ...rest} = props;

  // STATE
  const [loading, setLoading] = useState<boolean>(true);
  const [next, setNext] = useState<string | null>(null);
  const [offset, setOffset] = useState<number | null>(null);
  const [followers, setFollowers] = useState<SCUserType[]>([]);
  const [open, setOpen] = useState<boolean>(false);

  // HOOKS

  // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
  // @ts-ignore
  const {scEvent} = useSCFetchEvent({id: courseId, course});
  const participantsAvailable = useMemo(
    () =>
      scEvent?.privacy === SCEventPrivacyType.PUBLIC ||
      [SCEventSubscriptionStatusType.SUBSCRIBED, SCEventSubscriptionStatusType.GOING, SCEventSubscriptionStatusType.NOT_GOING].indexOf(
        scEvent?.subscription_status
      ) > -1,
    [scEvent]
  );

  useDeepCompareEffectNoCheck(() => {
    setFollowers([]);
    setLoading(true);
  }, [scEvent]);

  // FETCH FIRST FOLLOWERS
  useDeepCompareEffectNoCheck(() => {
    if (!scEvent) {
      return;
    }

    if (!followers.length && participantsAvailable) {
      EventService.getUsersGoingToEvent(scEvent.id, {limit: 3}).then((res: SCPaginatedResponse<SCUserType>) => {
        setFollowers([...res.results]);
        setOffset(4);
        setLoading(false);
      });
    } else {
      setOffset(0);
    }
  }, [scEvent, participantsAvailable, followers]);

  useEffect(() => {
    if (open && offset !== null) {
      setLoading(true);
      EventService.getUsersGoingToEvent(scEvent.id, {offset, limit: 20}).then((res: SCPaginatedResponse<SCUserType>) => {
        setFollowers([...(offset === 0 ? [] : followers), ...res.results]);
        setNext(res.next);
        setLoading(false);
        setOffset(null);
      });
    }
  }, [open, followers, offset]);

  /**
   * Memoized fetchFollowers
   */
  const fetchFollowers = useCallback(() => {
    if (!next) {
      return;
    }
    http
      .request({
        url: next,
        method: Endpoints.GetUsersGoingToCourse.method
      })
      .then((res: HttpResponse<any>) => {
        setFollowers([...followers, ...res.data.results]);
        setNext(res.data.next);
      })
      .catch((error) => Logger.error(SCOPE_SC_UI, error))
      .then(() => setLoading(false));
  }, [followers, scEvent, next]);

  const renderSurplus = useCallback(() => numberFormatter(followers.length), [followers]);

  /**
   * Opens dialog votes
   */
  const handleToggleDialogOpen = useCallback(() => {
    setOpen((prev) => !prev);
  }, [setOpen]);

  return (
    <>
      <Root
        className={classNames(classes.root, className)}
        onClick={handleToggleDialogOpen}
        disabled={loading || !scEvent || scEvent.goings_counter === 0}
        // @ts-expect-error this is needed to use followers into SCCourseParticipantsButton
        followers={followers}
        {...rest}>
        {!hideCaption && (
          <Typography className={classes.participants}>
            <Icon>people_alt</Icon>
            <FormattedMessage
              defaultMessage="ui.courseParticipantsButton.participants"
              id="ui.courseParticipantsButton.participants"
              values={{total: followers.length}}
            />
          </Typography>
        )}

        {!followers.length && (loading || !scEvent) ? (
          <AvatarGroupSkeleton {...rest} {...(!participantsAvailable && {skeletonsAnimation: false})} count={4} />
        ) : (
          <AvatarGroup total={followers.length} renderSurplus={renderSurplus}>
            {followers.map((c: SCUserType) => (
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
              defaultMessage="ui.courseParticipantsButton.dialogTitle"
              id="ui.courseParticipantsButton.dialogTitle"
              values={{total: scEvent.goings_counter}}
            />
          }
          onClose={handleToggleDialogOpen}
          open={open}
          {...DialogProps}>
          <InfiniteScroll
            dataLength={followers.length}
            next={fetchFollowers}
            hasMoreNext={next !== null || loading}
            loaderNext={<UserSkeleton elevation={0} />}
            className={classes.infiniteScroll}
            endMessage={
              <Typography className={classes.endMessage}>
                <FormattedMessage
                  id="ui.courseParticipantsButton.noOtherParticipants"
                  defaultMessage="ui.courseParticipantsButton.noOtherParticipants"
                />
              </Typography>
            }>
            <List>
              {followers.map((follower: SCUserType) => (
                <ListItem key={follower.id}>
                  <User elevation={0} user={follower} />
                </ListItem>
              ))}
            </List>
          </InfiniteScroll>
        </DialogRoot>
      )}
    </>
  );
}
