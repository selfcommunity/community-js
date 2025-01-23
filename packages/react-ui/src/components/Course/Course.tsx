import {Avatar, Box, Button, CardActions, CardContent, CardMedia, Chip, Icon, LinearProgress, Typography} from '@mui/material';
import {styled} from '@mui/material/styles';
import {useThemeProps} from '@mui/system';
import {Link, SCRoutes, SCRoutingContextType, SCUserContextType, useSCFetchCourse, useSCRouting, useSCUser} from '@selfcommunity/react-core';
import {SCCourseType} from '@selfcommunity/types';
import classNames from 'classnames';
import React, {useMemo} from 'react';
import {FormattedMessage} from 'react-intl';
import {SCCourseTemplateType} from '../../types/course';
import CourseParticipantsButton, {CourseParticipantsButtonProps} from '../CourseParticipantsButton';
import Widget, {WidgetProps} from '../Widget';
import {PREFIX} from './constants';
import CourseSkeleton, {CourseSkeletonProps} from './Skeleton';
import BaseItem from '../../shared/BaseItem';
import {isCourseCompleted, isCourseNew} from '../../utils/course';

const classes = {
  root: `${PREFIX}-root`,
  chip: `${PREFIX}-chip`,
  previewRoot: `${PREFIX}-preview-root`,
  previewActions: `${PREFIX}-preview-actions`,
  previewAvatar: `${PREFIX}-preview-avatar`,
  previewCategory: `${PREFIX}-preview-category`,
  previewCompletedStatus: `${PREFIX}-preview-completed-status`,
  previewContent: `${PREFIX}-preview-content`,
  previewCreator: `${PREFIX}-preview-creator`,
  previewImage: `${PREFIX}-preview-image`,
  previewImageWrapper: `${PREFIX}-preview-image-wrapper`,
  previewInfo: `${PREFIX}-preview-info`,
  previewName: `${PREFIX}-preview-name`,
  previewNameWrapper: `${PREFIX}-preview-name-wrapper`,
  previewProgressBar: `${PREFIX}-preview-progress-bar`,
  previewProgressStatus: `${PREFIX}-preview-progress-status`,
  snippetRoot: `${PREFIX}-snippet-root`,
  snippetActions: `${PREFIX}-snippet-actions`,
  snippetAvatar: `${PREFIX}-snippet-avatar`,
  snippetImage: `${PREFIX}-snippet-image`,
  snippetPrimary: `${PREFIX}-snippet-primary`,
  snippetSecondary: `${PREFIX}-snippet-secondary`
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
 * This component renders a course item.
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
 |root|.SCCourses-root|Styles applied to the root element.|
 |chip|.SCCourses-chip|Styles applied to the chip element.|
 |previewRoot|.SCCourses-preview-root|Styles applied to the root element in the preview template.|
 |previewActions|.SCCourses-preview-actions|Styles applied to the actions section in the preview template.|
 |previewAvatar|.SCCourses-preview-avatar|Styles applied to the avatar in the preview template.|
 |previewCategory|.SCCourses-preview-category|Styles applied to the category element in the preview template.|
 |previewCompletedStatus|.SCCourses-preview-completed-status|Styles applied to indicate the completed status in the preview template.|
 |previewContent|.SCCourses-preview-content|Styles applied to the content section in the preview template.|
 |previewCreator|.SCCourses-preview-creator|Styles applied to the creator element in the preview template.|
 |previewImage|.SCCourses-preview-image|Styles applied to the image in the preview template.|
 |previewImageWrapper|.SCCourses-preview-image-wrapper|Styles applied to the wrapper of the image in the preview template.|
 |previewInfo|.SCCourses-preview-info|Styles applied to the info section in the preview template.|
 |previewName|.SCCourses-preview-name|Styles applied to the name element in the preview template.|
 |previewNameWrapper|.SCCourses-preview-name-wrapper|Styles applied to the name wrapper in the preview template.|
 |previewProgressBar|.SCCourses-preview-progress-bar|Styles applied to the progress bar in the preview template.|
 |previewProgressStatus|.SCCourses-preview-progress-status|Styles applied to indicate the progress status in the preview template.|
 |snippetRoot|.SCCourses-snippet-root|Styles applied to the root element in the snippet template.|
 |snippetActions|.SCCourses-snippet-actions|Styles applied to the actions section in the snippet template.|
 |snippetAvatar|.SCCourses-snippet-avatar|Styles applied to the avatar element in the snippet template.|
 |snippetImage|.SCCourses-snippet-image|Styles applied to the image element in the snippet template.|
 |snippetPrimary|.SCCourses-snippet-primary|Styles applied to the primary section in the snippet template.|
 |snippetSecondary|.SCCourses-snippet-secondary|Styles applied to the secondary section in the snippet template.|

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
    actions,
    CourseParticipantsButtonComponentProps = {},
    CourseSkeletonComponentProps = {},
    ...rest
  } = props;

  // STATE
  const {scCourse} = useSCFetchCourse({id: courseId, course});

  // CONTEXT
  const scRoutingContext: SCRoutingContextType = useSCRouting();
  const scUserContext: SCUserContextType = useSCUser();
  const isCourseAdmin = useMemo(
    () => scUserContext.user && scCourse?.created_by?.id === scUserContext.user.id,
    [scUserContext.user, scCourse?.created_by?.id]
  );

  /**
   * Renders course object
   */
  if (!scCourse) {
    return <CourseSkeleton template={template} {...CourseSkeletonComponentProps} {...rest} actions={actions} />;
  }
  const renderProgress = () => {
    if (!scCourse.join_status) {
      return (
        <Button variant="outlined" size="small">
          <FormattedMessage defaultMessage="ui.course.enroll" id="ui.course.enroll" />
        </Button>
      );
    } else if (isCourseCompleted(scCourse)) {
      return (
        <Box className={classes.previewCompletedStatus}>
          <Icon color="success">circle_checked</Icon>
          <Typography variant="body1">
            <FormattedMessage defaultMessage="ui.course.completed" id="ui.course.completed" />
          </Typography>
        </Box>
      );
    } else {
      return (
        <Box className={classes.previewProgressStatus}>
          <Typography>
            <FormattedMessage
              id="ui.course.completion.percentage"
              defaultMessage="ui.course.completion.percentage"
              values={{percentage: `${Math.round(scCourse.user_completion_rate)}%`}}
            />
          </Typography>
          <LinearProgress className={classes.previewProgressBar} variant="determinate" color="primary" value={scCourse.user_completion_rate} />
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
          <CardMedia component="img" image={scCourse.image_medium} alt={scCourse.name} className={classes.previewImage} />
          {!isCourseAdmin && (isCourseCompleted(scCourse) || isCourseNew(scCourse)) && (
            <Chip
              size="small"
              component="div"
              color={isCourseCompleted(scCourse) ? 'primary' : 'secondary'}
              label={
                isCourseCompleted(scCourse) ? (
                  <FormattedMessage defaultMessage="ui.course.status.completed" id="ui.course.status.completed" />
                ) : (
                  <FormattedMessage defaultMessage="ui.course.status.new" id="ui.course.status.new" />
                )
              }
              className={classes.chip}
            />
          )}
          <Avatar alt={scCourse.name} src={scCourse.image_medium} className={classes.previewAvatar} />
        </Box>
        <CardContent className={classes.previewContent}>
          <Typography variant="body2" className={classes.previewCreator}>
            {scCourse.created_by.username}
          </Typography>
          <Box className={classes.previewNameWrapper}>
            <Typography variant="h6" className={classes.previewName}>
              {scCourse.name}
            </Typography>
          </Box>
          <Typography className={classes.previewInfo}>
            <FormattedMessage
              id={scCourse.privacy ? `ui.course.privacy.${scCourse.privacy}` : 'ui.course.privacy.draft'}
              defaultMessage={scCourse.privacy ? `ui.course.privacy.${scCourse.privacy}` : 'ui.course.privacy.draft'}
            />
            -
            <FormattedMessage id={`ui.course.type.${scCourse.type}`} defaultMessage={`ui.course.type.${scCourse.type}`} />
          </Typography>
          {scCourse.categories.map((category) => (
            <Chip key={category.id} size="small" component="div" label={category.name} className={classes.previewCategory} />
          ))}
        </CardContent>
        {actions ?? (
          <CardActions className={classes.previewActions}>
            {isCourseAdmin ? <CourseParticipantsButton course={scCourse as any} {...CourseParticipantsButtonComponentProps} /> : renderProgress()}
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
            <Avatar variant="square" alt={scCourse.name} src={scCourse.image_medium} className={classes.snippetAvatar} />
            {!isCourseAdmin && (isCourseCompleted(scCourse) || isCourseNew(scCourse)) && (
              <Chip
                size="small"
                component="div"
                color={isCourseCompleted(scCourse) ? 'primary' : 'secondary'}
                label={
                  isCourseCompleted(scCourse) ? (
                    <FormattedMessage defaultMessage="ui.course.status.completed" id="ui.course.status.completed" />
                  ) : (
                    <FormattedMessage defaultMessage="ui.course.status.new" id="ui.course.status.new" />
                  )
                }
                className={classes.chip}
              />
            )}
          </Box>
        }
        primary={
          <Link to={scRoutingContext.url(SCRoutes.COURSE_ROUTE_NAME, scCourse)} className={classes.snippetPrimary}>
            <Typography component="span">{scCourse.created_by.username}</Typography>
            <Typography variant="body1">{scCourse.name}</Typography>
          </Link>
        }
        secondary={
          <Typography component="p" variant="body2" className={classes.snippetSecondary}>
            <FormattedMessage
              id={scCourse.privacy ? `ui.course.privacy.${scCourse.privacy}` : 'ui.course.privacy.draft'}
              defaultMessage={scCourse.privacy ? `ui.course.privacy.${scCourse.privacy}` : 'ui.course.privacy.draft'}
            />
            -
            <FormattedMessage id={`ui.course.type.${scCourse.type}`} defaultMessage={`ui.course.type.${scCourse.type}`} />
          </Typography>
        }
        actions={
          actions ?? (
            <Box className={classes.snippetActions}>
              <Button size="small" variant="outlined" component={Link} to={scRoutingContext.url(SCRoutes.COURSE_ROUTE_NAME, scCourse)}>
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
