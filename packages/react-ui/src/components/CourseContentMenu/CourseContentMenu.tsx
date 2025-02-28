import React, {useCallback, useState} from 'react';
import {styled} from '@mui/material/styles';
import {useThemeProps} from '@mui/system';
import classNames from 'classnames';
import {Box, Collapse, Icon, List, ListItemButton, ListItemIcon, ListItemText} from '@mui/material';
import {PREFIX} from './constants';
import {
  SCCourseJoinStatusType,
  SCCourseLessonCompletionStatusType,
  SCCourseLessonType,
  SCCourseSectionType,
  SCCourseType
} from '@selfcommunity/types';

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
   * The course obj
   */
  course: SCCourseType;
  /**
   * The lesson obj
   */
  lesson: SCCourseLessonType;
  /**
   * Callback fired on lesson item click
   */
  onLessonClick: (lesson: SCCourseLessonType, section: SCCourseSectionType) => void;
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
  const {className = null, lesson, course, onLessonClick, ...rest} = props;

  //STATE
  const [expandedSections, setExpandedSections] = useState<number[]>(lesson?.course_id ? [lesson.course_id] : []);

  //HANDLERS
  const handleToggle = useCallback(
    (sectionId: number) => {
      setExpandedSections((prev) => (prev.includes(sectionId) ? prev.filter((id) => id !== sectionId) : [...prev, sectionId]));
    },
    [setExpandedSections]
  );

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
                  onClick={() => onLessonClick(_lesson, section)}
                  selected={_lesson.name === lesson.name}>
                  {course.join_status !== SCCourseJoinStatusType.MANAGER && (
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
