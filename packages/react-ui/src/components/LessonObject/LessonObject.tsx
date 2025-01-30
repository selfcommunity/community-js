import React, {useCallback, useMemo, useState} from 'react';
import {styled} from '@mui/material/styles';
import {useThemeProps} from '@mui/system';
import classNames from 'classnames';
import {Box, Button, Icon, Typography} from '@mui/material';
import {PREFIX} from './constants';
import {SCRoutingContextType, useSCRouting} from '@selfcommunity/react-core';
import CardContent from '@mui/material/CardContent';
import {getContributionHtml} from '../../utils/contribution';
import Widget from '../Widget';
import ContentLesson from '../Composer/Content/ContentLesson';
import {EditorProps} from '../Editor';
import {SCCourseJoinStatusType, SCCourseLessonCompletionStatusType, SCCourseLessonType, SCCourseType} from '@selfcommunity/types';
import {FormattedMessage} from 'react-intl';
import HiddenPlaceholder from '../../shared/HiddenPlaceholder';

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
  const {className = null, course, lesson, editMode, EditorProps = {}, onContentChange, isSubmitting, ...rest} = props;
  const [completed, setCompleted] = useState<boolean>(lesson.completion_status === SCCourseLessonCompletionStatusType.COMPLETED);

  // CONTEXT
  const scRoutingContext: SCRoutingContextType = useSCRouting();

  //HOOKS
  const isCourseAdmin = useMemo(
    () => course && (course.join_status === SCCourseJoinStatusType.CREATOR || course.join_status === SCCourseJoinStatusType.MANAGER),
    [course]
  );

  // TODO: mark/unmark lesson as done logic

  // HANDLERS

  const handleChangeLesson = useCallback(
    (content: any) => {
      if (onContentChange) {
        onContentChange(content);
      }
    },
    [onContentChange]
  );

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
              disabled={isSubmitting}
              EditorProps={{
                toolbar: true,
                uploadImage: true,
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
        <Button
          className={classes.button}
          size="small"
          variant={completed ? 'outlined' : 'contained'}
          startIcon={!completed && <Icon>arrow_next</Icon>}
          endIcon={completed && <Icon>circle_checked</Icon>}
          onClick={() => setCompleted(!completed)}>
          {completed ? (
            <FormattedMessage id="ui.lessonObject.button.completed" defaultMessage="ui.lessonObject.button.completed" />
          ) : (
            <FormattedMessage id="ui.lessonObject.button.complete" defaultMessage="ui.lessonObject.button.complete" />
          )}
        </Button>
      )}
    </Root>
  );
}
