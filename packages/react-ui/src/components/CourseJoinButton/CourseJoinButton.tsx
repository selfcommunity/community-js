import React, {useEffect, useMemo, useState} from 'react';
import {styled} from '@mui/material';
import {CacheStrategies, Logger} from '@selfcommunity/utils';
import {SCContextType, SCJoinedCoursesManagerType, SCUserContextType, useSCContext, useSCFetchCourse, useSCUser} from '@selfcommunity/react-core';
import {SCCoursePrivacyType, SCCourseJoinStatusType, SCCourseType, SCUserType} from '@selfcommunity/types';
import {LoadingButton} from '@mui/lab';
import {FormattedMessage} from 'react-intl';
import classNames from 'classnames';
import {useThemeProps} from '@mui/system';
import {SCOPE_SC_UI} from '../../constants/Errors';
import {SCCourseEventType, SCTopicType} from '../../constants/PubSub';
import PubSub from 'pubsub-js';

const PREFIX = 'SCCourseJoinButton';

const classes = {
  root: `${PREFIX}-root`
};

const Root = styled(LoadingButton, {
  name: PREFIX,
  slot: 'Root',
  overridesResolver: (props, styles) => styles.root
})(({theme}) => ({}));

export interface CourseJoinButtonProps {
  /**
   * Overrides or extends the styles applied to the component.
   * @default null
   */
  className?: string;
  /**
   * Course Object
   * @default null
   */
  course?: SCCourseType;

  /**
   * Id of the course
   * @default null
   */
  courseId?: number;

  /**
   * The user to be accepted into the course
   * @default null
   */
  user?: SCUserType;

  /**
   * onJoin callback
   * @param user
   * @param joined
   */
  onJoin?: (course: SCCourseType, status: string | null) => any;

  /**
   * Others properties
   */
  [p: string]: any;
}

/**
 * > API documentation for the Community-JS Course Subscribe Button component. Learn about the available props and the CSS API.

 #### Import

 ```jsx
 import {CourseJoinButton} from '@selfcommunity/react-ui';
 ```

 #### Component Name

 The name `SCCourseJoinButton` can be used when providing style overrides in the theme.


 #### CSS

 |Rule Name|Global class|Description|
 |---|---|---|
 |root|.SCCourseJoinButton-root|Styles applied to the root element.|

 * @param inProps
 */
export default function CourseJoinButton(inProps: CourseJoinButtonProps): JSX.Element {
  // PROPS
  const props: CourseJoinButtonProps = useThemeProps({
    props: inProps,
    name: PREFIX
  });

  const {className, courseId, course, user, onJoin, ...rest} = props;

  // STATE
  const [status, setStatus] = useState<string>(null);

  // CONTEXT
  const scContext: SCContextType = useSCContext();
  const scUserContext: SCUserContextType = useSCUser();
  const scCoursesManager: SCJoinedCoursesManagerType = scUserContext.managers.courses;

  // CONST
  const authUserId = scUserContext.user ? scUserContext.user.id : null;

  const {scCourse} = useSCFetchCourse({
    id: courseId,
    course,
    cacheStrategy: authUserId ? CacheStrategies.CACHE_FIRST : CacheStrategies.STALE_WHILE_REVALIDATE
  });

  const isCourseAdmin = useMemo(() => scCourse && scCourse.join_status === SCCourseJoinStatusType.CREATOR, [scCourse]);

  useEffect(() => {
    /**
     * Call scCoursesManager.joinStatus inside an effect
     * to avoid warning rendering child during update parent state
     */
    if (authUserId) {
      setStatus(scCoursesManager.joinStatus(scCourse));
    }
  }, [authUserId, scCoursesManager.joinStatus, scCourse]);

  /**
   * Notify UI when a member is added to a course
   * @param course
   * @param user
   */
  function notifyChanges(course: SCCourseType, user: SCUserType) {
    if (course && user) {
      PubSub.publish(`${SCTopicType.GROUP}.${SCCourseEventType.ADD_MEMBER}`, {course, user});
    }
  }

  const join = (user?: SCUserType) => {
    scCoursesManager
      .join(scCourse, user?.id)
      .then(() => {
        const _status =
          scCourse.privacy === SCCoursePrivacyType.PRIVATE && scCourse.join_status !== SCCourseJoinStatusType.INVITED
            ? SCCourseJoinStatusType.REQUESTED
            : SCCourseJoinStatusType.JOINED;
        notifyChanges(scCourse, user);
        onJoin && onJoin(scCourse, _status);
      })
      .catch((e) => {
        Logger.error(SCOPE_SC_UI, e);
      });
  };

  const leave = () => {
    scCoursesManager
      .leave(scCourse)
      .then(() => {
        onJoin && onJoin(scCourse, null);
      })
      .catch((e) => {
        Logger.error(SCOPE_SC_UI, e);
      });
  };

  const handleClick = () => {
    if (!scUserContext.user) {
      scContext.settings.handleAnonymousAction();
    } else {
      status === SCCourseJoinStatusType.JOINED && !user?.id ? leave() : user?.id ? join(user) : join();
    }
  };

  /**
   * Get current translated status
   */
  const getStatus = useMemo((): JSX.Element => {
    let _status;
    switch (status) {
      case SCCourseJoinStatusType.REQUESTED:
        _status = <FormattedMessage defaultMessage="ui.courseJoinButton.waitingApproval" id="ui.courseJoinButton.waitingApproval" />;
        break;
      case SCCourseJoinStatusType.JOINED:
        _status = <FormattedMessage defaultMessage="ui.courseJoinButton.leave" id="ui.courseJoinButton.leave" />;
        break;
      case SCCourseJoinStatusType.INVITED:
        _status = <FormattedMessage defaultMessage="ui.courseJoinButton.accept" id="ui.courseJoinButton.accept" />;
        break;
      default:
        scCourse.privacy === SCCoursePrivacyType.OPEN
          ? (_status = <FormattedMessage defaultMessage="ui.courseJoinButton.join" id="ui.courseJoinButton.join" />)
          : (_status = <FormattedMessage defaultMessage="ui.courseJoinButton.requestAccess" id="ui.courseJoinButton.requestAccess" />);
        break;
    }
    return _status;
  }, [status, scCourse]);

  if (!scCourse || (isCourseAdmin && user?.id === scUserContext.user.id) || (isCourseAdmin && !user?.id)) {
    return null;
  }

  return (
    <Root
      size="small"
      variant="outlined"
      onClick={handleClick}
      loading={scUserContext.user ? scCoursesManager.isLoading(scCourse) : null}
      disabled={status === SCCourseJoinStatusType.REQUESTED}
      className={classNames(classes.root, className)}
      {...rest}>
      {isCourseAdmin ? <FormattedMessage defaultMessage="ui.courseJoinButton.accept" id="ui.courseJoinButton.accept" /> : getStatus}
    </Root>
  );
}
