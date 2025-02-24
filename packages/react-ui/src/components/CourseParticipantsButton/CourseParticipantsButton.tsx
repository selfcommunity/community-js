import {Avatar, AvatarGroup, Button, Icon, List, ListItem, Typography} from '@mui/material';
import {ButtonProps} from '@mui/material/Button/Button';
import {styled} from '@mui/material/styles';
import {useThemeProps} from '@mui/system';
import {CourseService, Endpoints, http, HttpResponse, SCPaginatedResponse} from '@selfcommunity/api-services';
import {useSCFetchCourse} from '@selfcommunity/react-core';
import {SCCourseJoinStatusType, SCCourseType, SCUserType} from '@selfcommunity/types';
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
import HiddenPlaceholder from '../../shared/HiddenPlaceholder';

const PREFIX = 'SCCourseParticipantsButton';

const classes = {
  root: `${PREFIX}-root`,
  dialogRoot: `${PREFIX}-dialog-root`,
  endMessage: `${PREFIX}-end-message`,
  infiniteScroll: `${PREFIX}-infinite-scroll`,
  participants: `${PREFIX}-participants`
};

const Root = styled(Button, {
  name: PREFIX,
  slot: 'Root',
  overridesResolver: (_props, styles) => styles.root,
  shouldForwardProp: (prop) => prop !== 'enrolled'
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
 |dialogRoot|.SCCourseParticipantsButton-dialog-root|Styles applied to the dialog root element.|
 |endMessage|.SCCourseParticipantsButton-end-message|Styles applied to the end message element.|
 |infiniteScroll|.SCCourseParticipantsButton-infinite-scroll|Styles applied to the infinite scroll element.|
 |participants|.SCCourseParticipantsButton-participants|Styles applied to the participants section.|
 
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
  const [enrolled, setEnrolled] = useState<SCUserType[]>([]);
  const [open, setOpen] = useState<boolean>(false);

  // HOOKS
  const {scCourse} = useSCFetchCourse({id: courseId, course});
  const participantsAvailable = useMemo(
    () => scCourse?.join_status === SCCourseJoinStatusType.CREATOR || scCourse?.join_status === SCCourseJoinStatusType.MANAGER,
    [scCourse]
  );

  useDeepCompareEffectNoCheck(() => {
    setEnrolled([]);
    setLoading(true);
  }, [scCourse]);

  // FETCH FIRST FOLLOWERS
  useDeepCompareEffectNoCheck(() => {
    if (!scCourse) {
      return;
    }

    if (!enrolled.length && participantsAvailable) {
      CourseService.getCourseJoinedUsers(scCourse.id, {limit: 3}).then((res: SCPaginatedResponse<SCUserType>) => {
        setEnrolled([...res.results]);
        setOffset(4);
        setLoading(false);
      });
    } else {
      setOffset(0);
    }
  }, [scCourse, participantsAvailable, enrolled]);

  useEffect(() => {
    if (open && offset !== null) {
      setLoading(true);
      CourseService.getCourseJoinedUsers(scCourse.id, {offset, limit: 20}).then((res: SCPaginatedResponse<SCUserType>) => {
        setEnrolled([...(offset === 0 ? [] : enrolled), ...res.results]);
        setNext(res.next);
        setLoading(false);
        setOffset(null);
      });
    }
  }, [open, enrolled, offset]);

  /**
   * Memoized fetchEnrolledUsers
   */
  const fetchEnrolledUsers = useCallback(() => {
    if (!next) {
      return;
    }
    http
      .request({
        url: next,
        method: Endpoints.GetUsersGoingToCourse.method
      })
      .then((res: HttpResponse<any>) => {
        setEnrolled([...enrolled, ...res.data.results]);
        setNext(res.data.next);
      })
      .catch((error) => Logger.error(SCOPE_SC_UI, error))
      .then(() => setLoading(false));
  }, [enrolled, scCourse, next]);

  const renderSurplus = useCallback(() => numberFormatter(enrolled.length), [enrolled]);

  /**
   * Opens participants dialog
   */
  const handleToggleDialogOpen = useCallback(() => {
    setOpen((prev) => !prev);
  }, [setOpen]);

  /**
   * Rendering
   */

  if (!participantsAvailable || !scCourse.privacy) {
    return <HiddenPlaceholder />;
  }

  return (
    <>
      <Root
        className={classNames(classes.root, className)}
        onClick={handleToggleDialogOpen}
        disabled={loading || !scCourse || enrolled.length === 0}
        // @ts-expect-error this is needed to use enrolled into SCCourseParticipantsButton
        enrolled={enrolled}
        {...rest}>
        {!hideCaption && (
          <Typography className={classes.participants}>
            <Icon>people_alt</Icon>
            <FormattedMessage
              defaultMessage="ui.courseParticipantsButton.participants"
              id="ui.courseParticipantsButton.participants"
              values={{total: enrolled.length}}
            />
          </Typography>
        )}

        {!enrolled.length && (loading || !scCourse) ? (
          <AvatarGroupSkeleton {...rest} {...(!participantsAvailable && {skeletonsAnimation: false})} count={4} />
        ) : (
          <AvatarGroup total={enrolled.length} renderSurplus={renderSurplus}>
            {enrolled.map((c: SCUserType) => (
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
              values={{total: enrolled.length}}
            />
          }
          onClose={handleToggleDialogOpen}
          open
          {...DialogProps}>
          <InfiniteScroll
            dataLength={enrolled.length}
            next={fetchEnrolledUsers}
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
              {enrolled.map((e: SCUserType) => (
                <ListItem key={e.id}>
                  <User elevation={0} user={e} />
                </ListItem>
              ))}
            </List>
          </InfiniteScroll>
        </DialogRoot>
      )}
    </>
  );
}
