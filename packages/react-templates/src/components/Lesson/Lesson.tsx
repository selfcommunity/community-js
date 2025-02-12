import React, {useMemo, useState} from 'react';
import {styled} from '@mui/material/styles';
import {useThemeProps} from '@mui/system';
import {Box, Icon, IconButton, Typography, useMediaQuery, useTheme} from '@mui/material';
import {PREFIX} from './constants';
import {SCCourseJoinStatusType, SCCourseLessonType, SCCourseSectionType, SCCourseType} from '@selfcommunity/types';
import {SCThemeType, useSCFetchCourse, useSCFetchLesson} from '@selfcommunity/react-core';
import classNames from 'classnames';
import {
  getCurrentSectionAndLessonIndex,
  HiddenPlaceholder,
  LessonAppbar,
  LessonAppbarProps,
  LessonDrawer,
  LessonDrawerProps,
  LessonObject,
  SCLessonActionsType
} from '@selfcommunity/react-ui';
import {CourseInfoViewType, CourseService} from '@selfcommunity/api-services';
import {FormattedMessage} from 'react-intl';

const classes = {
  root: `${PREFIX}-root`,
  containerRoot: `${PREFIX}-container-root`,
  navigation: `${PREFIX}-navigation`,
  navigationTitle: `${PREFIX}-navigation-title`
};

const Root = styled(Box, {
  name: PREFIX,
  slot: 'Root',
  overridesResolver: (props, styles) => [styles.root]
})(() => ({}));

const Container = styled(Box, {
  name: PREFIX,
  slot: 'ContainerRoot',
  overridesResolver: (props, styles) => styles.containerRoot,
  shouldForwardProp: (prop) => prop !== 'open'
})<{open?: boolean}>(() => ({}));

export interface LessonProps {
  /**
   * Overrides or extends the styles applied to the component.
   * @default null
   */
  className?: string;
  /**
   * The course object
   */
  course?: SCCourseType;
  /**
   * The course id
   */
  courseId?: number;
  /**
   * The section id
   */
  sectionId: number;
  /**
   * The lesson id
   */
  lessonId?: number;
  /**
   * Props to spread to LessonAppbar Component
   * @default {}
   */
  LessonAppbarProps?: LessonAppbarProps;
  /**
   * Props to spread to LessonDrawer Component
   * @default {}
   */
  LessonDrawerProps?: LessonDrawerProps;
  /**
   * Any other properties
   */
  [p: string]: any;
}

export default function Lesson(inProps: LessonProps): JSX.Element {
  // PROPS
  const props: LessonProps = useThemeProps({
    props: inProps,
    name: PREFIX
  });
  const {className = null, course, courseId, sectionId, lessonId, LessonAppbarProps = {}, LessonDrawerProps = {}, ...rest} = props;

  // HOOKS
  const theme = useTheme<SCThemeType>();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [_lessonId, setLessonId] = useState<number>(lessonId);
  const [_sectionId, setSectionId] = useState<number>(sectionId);
  const isCourseAdmin = useMemo(
    () => course && (course.join_status === SCCourseJoinStatusType.CREATOR || course.join_status === SCCourseJoinStatusType.MANAGER),
    [course]
  );
  const {scCourse} = useSCFetchCourse({id: courseId, params: {view: isCourseAdmin ? CourseInfoViewType.EDIT : CourseInfoViewType.USER}});
  const {scLesson, setSCLesson} = useSCFetchLesson({id: _lessonId, courseId, sectionId: _sectionId});

  // STATE
  const [activePanel, setActivePanel] = useState<SCLessonActionsType>(null);
  const [settings, setSettings] = useState(null);
  const [updating, setUpdating] = useState(false);
  const [lessonContent, setLessonContent] = useState<string>('');
  const [editMode, setEditMode] = useState(isCourseAdmin);
  const isEditMode = editMode;
  // const isEditMode = useMemo(() => {
  //   return value.startsWith(scRoutingContext.url(SCRoutes.COURSE_EDIT_ROUTE_NAME, {}));
  // }, [value, scRoutingContext]);

  // HANDLERS
  /**
   * Handles lesson settings change
   * @param newSettings
   */
  const handleSettingsChange = (newSettings) => {
    setSettings(newSettings);
  };

  const handleOpenDrawer = (panel: SCLessonActionsType) => {
    setActivePanel((prevPanel) => (prevPanel === panel ? null : panel));
  };
  const handleCloseDrawer = () => {
    setActivePanel(null);
    setEditMode(false);
  };

  const handleLessonContentEdit = (html: string) => {
    setLessonContent(html);
  };

  const handleChangeLesson = (l: SCCourseLessonType, s: SCCourseSectionType) => {
    setLessonId(l.id);
    setSectionId(s.id);
    setCurrentSection(s);
  };

  /**
   * Handles Lesson Edit
   */
  const handleLessonUpdate = () => {
    setUpdating(true);
    const data: any = {...settings, type: scLesson.type, name: scLesson.name, text: lessonContent};
    CourseService.updateCourseLesson(scCourse.id, sectionId, scLesson.id, data)
      .then((data: SCCourseLessonType) => {
        setUpdating(false);
        setSCLesson(data);
      })
      .catch((error) => {
        setUpdating(false);
        console.log(error);
      });
  };

  const currentData = useMemo(() => {
    if (!scCourse || !scLesson) return null;
    return getCurrentSectionAndLessonIndex(scCourse, scLesson.section_id, scLesson.id);
  }, [scCourse, scLesson]);

  const [currentSectionIndex, setCurrentSectionIndex] = useState(currentData?.currentSectionIndex || 0);
  const [currentLessonIndex, setCurrentLessonIndex] = useState(currentData?.currentLessonIndex || 0);
  const [currentSection, setCurrentSection] = useState(scCourse?.sections?.[currentSectionIndex] || null);

  const handlePrev = () => {
    if (currentLessonIndex > 0) {
      const newLessonIndex = currentLessonIndex - 1;
      setCurrentLessonIndex(newLessonIndex);
      handleChangeLesson(currentSection.lessons[newLessonIndex], currentSection);
    } else if (currentSectionIndex > 0) {
      const prevSectionIndex = currentSectionIndex - 1;
      const prevSection = scCourse?.sections[prevSectionIndex];
      const newLessonIndex = prevSection.lessons.length - 1;
      setCurrentSectionIndex(prevSectionIndex);
      setCurrentLessonIndex(newLessonIndex);
      handleChangeLesson(prevSection.lessons[newLessonIndex], prevSection);
    }
  };

  const handleNext = () => {
    if (currentLessonIndex < currentSection.lessons.length - 1) {
      const newLessonIndex = currentLessonIndex + 1;
      setCurrentLessonIndex(newLessonIndex);
      handleChangeLesson(currentSection.lessons[newLessonIndex], currentSection);
    } else if (currentSectionIndex < scCourse?.sections.length - 1) {
      const newSectionIndex = currentSectionIndex + 1;
      setCurrentSectionIndex(newSectionIndex);
      setCurrentLessonIndex(0);
      handleChangeLesson(scCourse?.sections[newSectionIndex].lessons[0], scCourse.sections[newSectionIndex]);
    }
  };

  const isPrevDisabled = !scCourse?.sections || (currentSectionIndex === 0 && currentLessonIndex === 0);
  const isNextDisabled =
    !scCourse?.sections || (currentSectionIndex === scCourse?.sections.length - 1 && currentLessonIndex === currentSection?.lessons?.length - 1);

  if (!scLesson || !scCourse) {
    return <HiddenPlaceholder />;
  }

  return (
    <Root className={classNames(classes.root, className)} {...rest}>
      <LessonAppbar
        showComments={scLesson.comments_enabled}
        editMode={isEditMode}
        activePanel={activePanel}
        title={scCourse.name}
        handleOpen={handleOpenDrawer}
        onSave={handleLessonUpdate}
        updating={updating}
        {...LessonAppbarProps}
      />
      <Container open={Boolean(activePanel) || isEditMode} className={classes.containerRoot}>
        <Box className={classes.navigation}>
          <Typography variant="body2" color="text.secondary">
            <FormattedMessage
              id="templates.lesson.number"
              defaultMessage="templates.lesson.number"
              values={{from: currentLessonIndex + 1, to: currentSection?.lessons?.length}}
            />
          </Typography>
        </Box>
        <Box className={classes.navigationTitle}>
          <Typography variant="h5">{scLesson.name}</Typography>
          <Box>
            <IconButton onClick={handlePrev} disabled={isPrevDisabled}>
              <Icon>arrow_back</Icon>
            </IconButton>
            <IconButton onClick={handleNext} disabled={isNextDisabled}>
              <Icon>arrow_next</Icon>
            </IconButton>
          </Box>
        </Box>
        <LessonObject course={scCourse} lesson={scLesson} editMode={isEditMode} onContentChange={handleLessonContentEdit} />
      </Container>
      <LessonDrawer
        course={scCourse}
        lesson={scLesson}
        editMode={isMobile ? activePanel === SCLessonActionsType.SETTINGS : isEditMode}
        activePanel={activePanel}
        handleClose={handleCloseDrawer}
        handleChangeLesson={handleChangeLesson}
        LessonEditFormProps={{lesson: scLesson, onSave: handleLessonUpdate, updating: updating, onSettingsChange: handleSettingsChange}}
        {...LessonDrawerProps}
      />
    </Root>
  );
}
