import React, {useCallback, useMemo, useState} from 'react';
import {styled} from '@mui/material/styles';
import {useThemeProps} from '@mui/system';
import classNames from 'classnames';
import {Box, Icon, Typography} from '@mui/material';
import {PREFIX} from './constants';
import {SCRoutingContextType, useSCRouting} from '@selfcommunity/react-core';
import CardContent from '@mui/material/CardContent';
import {getContributionHtml} from '../../utils/contribution';
import Widget from '../Widget';
import ContentLesson from '../Composer/Content/ContentLesson';
import {EditorProps} from '../Editor';
import {SCCourseJoinStatusType, SCCourseLessonCompletionStatusType, SCCourseLessonType, SCCourseType, SCMediaType} from '@selfcommunity/types';
import {FormattedMessage} from 'react-intl';
import HiddenPlaceholder from '../../shared/HiddenPlaceholder';
import {CourseService} from '@selfcommunity/api-services';
import {LoadingButton} from '@mui/lab';

const classes = {
  root: `${PREFIX}-root`,
  content: `${PREFIX}-content`,
  contentEdit: `${PREFIX}-content-edit`,
  title: `${PREFIX}-title`,
  text: `${PREFIX}-text`,
  navigation: `${PREFIX}-navigation`,
  editor: `${PREFIX}-editor`,
  button: `${PREFIX}-button`
};

const Root = styled(Box, {
  name: PREFIX,
  slot: 'Root',
  overridesResolver: (props, styles) => [styles.root]
})(() => ({}));

export interface LessonObjectProps {
  /**
   * The lesson obj
   */
  lesson: SCCourseLessonType;
  /**
   * The course obj
   */
  course: SCCourseType;
  /**
   * Overrides or extends the styles applied to the component.
   * @default null
   */
  className?: string;
  /**
   * The edit mode
   * @default false
   */
  editMode: boolean;
  /**
   * Callback fired when the lesson content on edit mode changes
   */
  onContentChange?: (content) => void;
  /**
   * Callback fired when the lesson media on edit mode changes
   */
  onMediaChange?: (medias: SCMediaType[]) => void | null;
  /**
   * Editor props
   * @default {}
   */
  EditorProps?: Omit<EditorProps, 'onFocus'>;
  /**
   * Any other properties
   */
  [p: string]: any;
}

export default function LessonObject(inProps: LessonObjectProps): JSX.Element {
  // PROPS
  const props: LessonObjectProps = useThemeProps({
    props: inProps,
    name: PREFIX
  });
  const {className = null, course, lesson, editMode, EditorProps = {}, onContentChange, onMediaChange, isSubmitting, ...rest} = props;
  const [loading, setLoading] = useState<boolean>(false);
  const [completed, setCompleted] = useState<boolean>(lesson.completion_status === SCCourseLessonCompletionStatusType.COMPLETED);

  // CONTEXT
  const scRoutingContext: SCRoutingContextType = useSCRouting();

  //HOOKS
  const isCourseAdmin = useMemo(
    () => course && (course.join_status === SCCourseJoinStatusType.CREATOR || course.join_status === SCCourseJoinStatusType.MANAGER),
    [course]
  );

  // HANDLERS

  const handleChangeLesson = useCallback(
    (content: any) => {
      if (onContentChange) {
        onContentChange(content);
      }
    },
    [onContentChange]
  );

  const handleChangeMedia = useCallback(
    (medias: SCMediaType[]) => {
      if (onMediaChange) {
        onMediaChange(medias);
      }
    },
    [onMediaChange]
  );

  function toggleLessonCompletion(completed) {
    setLoading(true);
    const service = completed
      ? () => CourseService.markLessonIncomplete(course.id, lesson.section_id, lesson.id)
      : () => CourseService.markLessonComplete(course.id, lesson.section_id, lesson.id);
    service()
      .then(() => {
        setCompleted(!completed);
        setLoading(false);
      })
      .catch((error) => {
        setLoading(false);
        console.log(error);
      });
  }

  // RENDER
  if (!course || !lesson) {
    return <HiddenPlaceholder />;
  }

  return (
    <Root className={classNames(className, classes.root)} {...rest}>
      <Widget>
        <CardContent classes={{root: editMode ? classes.contentEdit : classes.content}}>
          {editMode ? (
            <ContentLesson
              value={lesson}
              //error={{error}}
              onChange={handleChangeLesson}
              onMediaChange={handleChangeMedia}
              disabled={isSubmitting}
              EditorProps={{
                toolbar: true,
                uploadImage: false,
                uploadFile: true,
                ...EditorProps
              }}
            />
          ) : (
            <Typography
              component="div"
              gutterBottom
              className={classes.text}
              dangerouslySetInnerHTML={{
                __html: getContributionHtml(lesson.html, scRoutingContext.url)
              }}
            />
          )}
        </CardContent>
      </Widget>
      {!isCourseAdmin && (
        <LoadingButton
          className={classes.button}
          loading={loading}
          size="small"
          variant={completed ? 'outlined' : 'contained'}
          startIcon={!completed && <Icon>arrow_next</Icon>}
          endIcon={completed && <Icon>circle_checked</Icon>}
          onClick={() => toggleLessonCompletion(completed)}>
          {completed ? (
            <FormattedMessage id="ui.lessonObject.button.completed" defaultMessage="ui.lessonObject.button.completed" />
          ) : (
            <FormattedMessage id="ui.lessonObject.button.complete" defaultMessage="ui.lessonObject.button.complete" />
          )}
        </LoadingButton>
      )}
    </Root>
  );
}
