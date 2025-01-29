import React, {useCallback, useEffect, useState} from 'react';
import {styled} from '@mui/material/styles';
import {useThemeProps} from '@mui/system';
import classNames from 'classnames';
import {Box, Collapse, Icon, List, ListItemButton, ListItemIcon, ListItemText} from '@mui/material';
import {PREFIX} from './constants';
import {FormattedMessage} from 'react-intl';
import {SCCourseLessonCompletionStatusType, SCCourseLessonType, SCCourseSectionType, SCCourseType} from '@selfcommunity/types';
import {getCourseData} from '../EditCourse/data';
import {SCOPE_SC_UI} from '../../constants/Errors';
import {Logger} from '@selfcommunity/utils';
import {enqueueSnackbar} from 'notistack';

const classes = {
  root: `${PREFIX}-root`,
  listItem: `${PREFIX}-list-item`,
  listItemIcon: `${PREFIX}-list-item-icon`,
  item: `${PREFIX}-item`,
  itemIcon: `${PREFIX}-item-icon`,
  iconIncomplete: `${PREFIX}-icon-incomplete`,
  iconComplete: `${PREFIX}-icon-complete`
};

const Root = styled(Box, {
  name: PREFIX,
  slot: 'Root',
  overridesResolver: (props, styles) => [styles.root]
})(() => ({}));

export interface CourseContentMenuProps {
  /**
   * The displayed course id
   */
  courseId: number;
  /**
   * The displayed lesson id
   */
  lesson: SCCourseLessonType;

  /**
   * Callback fired on lesson item click
   */
  onLessonClick: (lesson: SCCourseLessonType) => void;
  /**
   * Any other properties
   */
  [p: string]: any;
}

export default function CourseContentMenu(inProps: CourseContentMenuProps): JSX.Element {
  // PROPS
  const props: CourseContentMenuProps = useThemeProps({
    props: inProps,
    name: PREFIX
  });
  const {className = null, lesson, courseId = 1, onLessonClick, ...rest} = props;

  //STATE
  const [expandedSections, setExpandedSections] = useState<number[]>([]);
  const [course, setCourse] = useState<SCCourseType | null>(null);

  const isCourseCreator = false;

  //HANDLERS
  const handleToggle = useCallback(
    (sectionId: number) => {
      setExpandedSections((prev) => (prev.includes(sectionId) ? prev.filter((id) => id !== sectionId) : [...prev, sectionId]));
    },
    [setExpandedSections]
  );

  // EFFECTS
  useEffect(() => {
    getCourseData(courseId)
      .then((courseData) => {
        if (courseData) {
          setCourse(courseData);
          setExpandedSections(courseData.sections.map((section: SCCourseSectionType) => section.id));
        }
      })
      .catch((error) => {
        Logger.error(SCOPE_SC_UI, error);

        enqueueSnackbar(<FormattedMessage id="ui.common.error.action" defaultMessage="ui.common.error.action" />, {
          variant: 'error',
          autoHideDuration: 3000
        });
      });
  }, []);

  /**
   * Rendering
   */

  if (!course) {
    return null;
  }

  return (
    <Root className={classNames(className, classes.root)} {...rest}>
      {course.sections.map((section: SCCourseSectionType) => (
        <React.Fragment key={section.id}>
          <ListItemButton onClick={() => handleToggle(section.id)} className={classes.listItem} disableRipple>
            <ListItemIcon className={classes.listItemIcon}>
              {expandedSections.includes(section.id) ? <Icon>expand_less</Icon> : <Icon>expand_more</Icon>}
            </ListItemIcon>
            <ListItemText primary={section.name} />
          </ListItemButton>
          <Collapse in={expandedSections.includes(section.id)} timeout="auto" unmountOnExit>
            <List component="div" disablePadding>
              {section.lessons.map((_lesson) => (
                <ListItemButton
                  key={_lesson.id}
                  className={classes.item}
                  onClick={() => onLessonClick(_lesson)}
                  selected={_lesson.name === lesson?.name}>
                  {!isCourseCreator && (
                    <ListItemIcon className={classes.itemIcon}>
                      {_lesson.completion_status === SCCourseLessonCompletionStatusType.COMPLETED ? (
                        <Icon className={classes.iconComplete}>circle_checked</Icon>
                      ) : (
                        <Icon className={classes.iconIncomplete}>fiber_manual_record</Icon>
                      )}
                    </ListItemIcon>
                  )}
                  <ListItemText primary={_lesson.name} />
                </ListItemButton>
              ))}
            </List>
          </Collapse>
        </React.Fragment>
      ))}
    </Root>
  );
}
