import {Avatar, Box, Button, CardActions, CardContent, CardMedia, Chip, Icon, LinearProgress, Typography} from '@mui/material';
import {styled} from '@mui/material/styles';
import {useThemeProps} from '@mui/system';
import {Link, SCRoutes, SCRoutingContextType, SCUserContextType, useSCFetchEvent, useSCRouting, useSCUser} from '@selfcommunity/react-core';
import {SCCourseType, SCEventLocationType} from '@selfcommunity/types';
import classNames from 'classnames';
import React, {useMemo} from 'react';
import {FormattedMessage} from 'react-intl';
import {SCCourseTemplateType} from '../../types/course';
import CourseParticipantsButton, {CourseParticipantsButtonProps} from '../CourseParticipantsButton';
import Widget, {WidgetProps} from '../Widget';
import {PREFIX} from './constants';
import CourseSkeleton, {CourseSkeletonProps} from './Skeleton';
import BaseItem from '../../shared/BaseItem';

const classes = {
  root: `${PREFIX}-root`,
  snippetRoot: `${PREFIX}-snippet-root`,
  snippetImage: `${PREFIX}-snippet-image`,
  snippetAvatar: `${PREFIX}-snippet-avatar`,
  snippetInProgress: `${PREFIX}-snippet-in-progress`,
  snippetPrimary: `${PREFIX}-snippet-primary`,
  snippetSecondary: `${PREFIX}-snippet-secondary`,
  snippetActions: `${PREFIX}-snippet-actions`,
  previewRoot: `${PREFIX}-preview-root`,
  previewImageWrapper: `${PREFIX}-preview-image-wrapper`,
  previewImage: `${PREFIX}-preview-image`,
  previewAvatar: `${PREFIX}-preview-avatar`,
  previewCreator: `${PREFIX}-preview-creator`,
  previewChip: `${PREFIX}-preview-chip`,
  previewNameWrapper: `${PREFIX}-preview-name-wrapper`,
  previewName: `${PREFIX}-preview-name`,
  previewContent: `${PREFIX}-preview-content`,
  previewInfo: `${PREFIX}-preview-info`,
  previewUser: `${PREFIX}-preview-user`,
  previewActions: `${PREFIX}-preview-actions`,
  previewProgressStatus: `${PREFIX}-preview-progress-status`,
  previewCompletedStatus: `${PREFIX}-preview-completed-status`
};

const Root = styled(Widget, {
  name: PREFIX,
  slot: 'Root',
  overridesResolver: (_props, styles) => styles.root
})(() => ({}));

const PreviewRoot = styled(Box, {
  name: PREFIX,
  slot: 'PreviewRoot',
  overridesResolver: (_props, styles) => styles.previewRoot
})(() => ({}));

const SnippetRoot = styled(BaseItem, {
  name: PREFIX,
  slot: 'SnippetRoot',
  overridesResolver: (_props, styles) => styles.snippetRoot
})(() => ({}));

export interface CourseProps extends WidgetProps {
  /**
   * Course Object
   * @default null
   */
  course?: SCCourseType;
  /**
   * Id of the course for filter the feed
   * @default null
   */
  courseId?: number;
  /**
   * Course template type
   * @default 'preview'
   */
  template?: SCCourseTemplateType;
  /**
   * Actions
   * @default null
   */
  actions?: React.ReactNode;
  /**
   * Hide in progress
   * @default false
   */
  hideInProgress?: boolean;
  /**
   * Hide participants
   * @default false
   */
  hideCourseParticipants?: boolean;
  /**
   * Props to spread to CourseParticipantsButton component
   * @default {}
   */
  CourseParticipantsButtonComponentProps?: CourseParticipantsButtonProps;
  /**
   * Props to spread to CourseSkeleton component
   * @default {}
   */
  CourseSkeletonComponentProps?: CourseSkeletonProps;
  /**
   * Any other properties
   */
  [p: string]: any;
}

/**
 * > API documentation for the Community-JS Course component. Learn about the available props and the CSS API.
 *
 *
 * This component renders an course item.
 * Take a look at our <strong>demo</strong> component [here](/docs/sdk/community-js/react-ui/Components/Course)

 #### Import

 ```jsx
 import {course} from '@selfcommunity/react-ui';
 ```

 #### Component Name

 The name `SCCourse` can be used when providing style overrides in the theme.


 #### CSS

 |Rule Name|Global class|Description|
 |---|---|---|
 |root|.SCCourse-root|Styles applied to the root element.|
 |avatar|.SCCourse-avatar|Styles applied to the avatar element.|
 |primary|.SCCourse-primary|Styles applied to the primary item element section|
 |secondary|.SCCourse-secondary|Styles applied to the secondary item element section|
 |actions|.SCCourse-actions|Styles applied to the actions section.|


 *
 * @param inProps
 */
export default function Course(inProps: CourseProps): JSX.Element {
  // PROPS
  const props: CourseProps = useThemeProps({
    props: inProps,
    name: PREFIX
  });
  const {
    id = `course_object_${props.courseId ? props.courseId : props.course ? props.course.id : ''}`,
    courseId = null,
    course = null,
    className = null,
    template = SCCourseTemplateType.PREVIEW,
    hideInProgress = false,
    hideCourseParticipants = false,
    actions,
    CourseParticipantsButtonComponentProps = {},
    CourseSkeletonComponentProps = {},
    ...rest
  } = props;

  // STATE
  const {scEvent} = useSCFetchEvent({id: courseId, course, autoSubscribe: false});
  const inProgress = useMemo(() => scEvent && scEvent.active && scEvent.running, [scEvent]);

  // CONTEXT
  const scRoutingContext: SCRoutingContextType = useSCRouting();
  const scUserContext: SCUserContextType = useSCUser();
  const isCourseAdmin = useMemo(
    () => scUserContext.user && scEvent?.managed_by?.id === scUserContext.user.id,
    [scUserContext.user, scEvent?.managed_by?.id]
  );

  /**
   * Renders course object
   */
  if (!scEvent) {
    return <CourseSkeleton template={template} {...CourseSkeletonComponentProps} {...rest} actions={actions} />;
  }
  const renderProgress = () => {
    const currentDate = new Date();
    const startDate = new Date(scEvent.start_date);
    const endDate = new Date(scEvent.end_date);

    if (currentDate < startDate) {
      return (
        <Button variant="outlined" size="small">
          <FormattedMessage defaultMessage="ui.course.enroll" id="ui.course.enroll" />
        </Button>
      );
    } else if (currentDate > endDate) {
      return (
        <Box className={classes.previewCompletedStatus}>
          <Icon color="success">circle_checked</Icon>
          <Typography variant="body1">
            <FormattedMessage defaultMessage="ui.course.completed" id="ui.course.completed" />
          </Typography>
        </Box>
      );
    } else {
      const progress = ((currentDate - startDate) / (endDate - startDate)) * 100;
      return (
        <Box className={classes.previewProgressStatus}>
          <Typography variant="h4">
            <FormattedMessage
              id="ui.course.completion.percentage"
              defaultMessage="ui.course.completion.percentage"
              values={{percentage: `${Math.round(progress)}%`}}
            />
          </Typography>
          <LinearProgress variant="determinate" color="success" value={progress} />
        </Box>
      );
    }
  };

  /**
   * Renders course object
   */
  let contentObj: React.ReactElement;
  if (template === SCCourseTemplateType.PREVIEW) {
    contentObj = (
      <PreviewRoot className={classes.previewRoot}>
        <Box className={classes.previewImageWrapper}>
          <CardMedia component="img" image={scEvent.image_medium} alt={scEvent.name} className={classes.previewImage} />
          {!hideInProgress && inProgress && <Chip size="small" component="div" label="NEW" className={classes.previewChip} />}
          <Avatar alt={scEvent.name} src={scEvent.image_medium} className={classes.previewAvatar} />
        </Box>
        <CardContent className={classes.previewContent}>
          <Typography className={classes.previewCreator}>{scEvent.created_by.username}</Typography>
          <Box className={classes.previewNameWrapper}>
            <Typography variant="h5" className={classes.previewName}>
              {scEvent.name}
            </Typography>
          </Box>
          <Typography className={classes.previewInfo}>
            <FormattedMessage id={`ui.course.privacy.${scEvent.privacy}`} defaultMessage={`ui.course.privacy.${scEvent.privacy}`} />-
            {scEvent?.location === SCEventLocationType.PERSON ? (
              <FormattedMessage id={`ui.eventForm.address.live.label`} defaultMessage={`ui.eventForm.address.live.label`} />
            ) : (
              <FormattedMessage id={`ui.eventForm.address.online.label`} defaultMessage={`ui.eventForm.address.online.label`} />
            )}
          </Typography>
          <Chip size="small" component="div" label="Category" className={classes.previewChip} />
        </CardContent>
        {actions ?? (
          <CardActions className={classes.previewActions}>
            {isCourseAdmin ? <CourseParticipantsButton course={scEvent} {...CourseParticipantsButtonComponentProps} /> : renderProgress()}
          </CardActions>
        )}
      </PreviewRoot>
    );
  } else {
    contentObj = (
      <SnippetRoot
        elevation={0}
        className={classes.snippetRoot}
        image={
          <Box className={classes.snippetImage}>
            <Avatar variant="square" alt={scEvent.name} src={scEvent.image_medium} className={classes.snippetAvatar} />{' '}
            {!hideInProgress && inProgress && (
              <Chip
                size="small"
                component="div"
                label={<FormattedMessage id="ui.event.inProgress" defaultMessage="ui.event.inProgress" />}
                className={classes.snippetInProgress}
              />
            )}
          </Box>
        }
        primary={
          <Link to={scRoutingContext.url(SCRoutes.COURSE_ROUTE_NAME, scEvent)} className={classes.snippetPrimary}>
            <Typography component="span">{scEvent.created_by.username}</Typography>
            <Typography variant="body1">{scEvent.name}</Typography>
          </Link>
        }
        secondary={
          <Typography component="p" variant="body2" className={classes.snippetSecondary}>
            <FormattedMessage id={`ui.course.privacy.${scEvent.privacy}`} defaultMessage={`ui.course.privacy.${scEvent.privacy}`} /> -{' '}
            {scEvent?.location === SCEventLocationType.PERSON ? (
              <FormattedMessage id={`ui.eventForm.address.live.label`} defaultMessage={`ui.eventForm.address.live.label`} />
            ) : (
              <FormattedMessage id={`ui.eventForm.address.online.label`} defaultMessage={`ui.eventForm.address.online.label`} />
            )}
          </Typography>
        }
        actions={
          actions ?? (
            <Box className={classes.snippetActions}>
              <Button size="small" variant="outlined" component={Link} to={scRoutingContext.url(SCRoutes.COURSE_ROUTE_NAME, scEvent)}>
                <FormattedMessage defaultMessage="ui.course.see" id="ui.course.see" />
              </Button>
            </Box>
          )
        }
      />
    );
  }
  /**
   * Renders root object
   */
  return (
    <Root id={id} className={classNames(classes.root, className, `${PREFIX}-${template}`)} {...rest}>
      {contentObj}
    </Root>
  );
}
