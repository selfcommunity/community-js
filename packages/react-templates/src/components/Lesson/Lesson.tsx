import {Fragment, useCallback, useMemo, useState} from 'react';
import {styled} from '@mui/material/styles';
import {useThemeProps} from '@mui/system';
import {Box, Icon, IconButton, Typography, useMediaQuery, useTheme} from '@mui/material';
import {PREFIX} from './constants';
import {SCCourseLessonCompletionStatusType, SCCourseLessonType, SCCourseSectionType, SCCourseType, SCMediaType} from '@selfcommunity/types';
import {SCThemeType, useSCFetchCourse, useSCFetchLesson} from '@selfcommunity/react-core';
import classNames from 'classnames';
import {
  CourseCompletedDialog,
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
import {LoadingButton} from '@mui/lab';

const classes = {
  root: `${PREFIX}-root`,
  containerRoot: `${PREFIX}-container-root`,
  navigation: `${PREFIX}-navigation`,
  navigationTitle: `${PREFIX}-navigation-title`,
  button: `${PREFIX}-button`
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
  courseId?: string | number;
  /**
   * The section id
   */
  sectionId: string | number;
  /**
   * The lesson object
   * @default null
   */
  lesson?: SCCourseLessonType;
  /**
   * The lesson id
   */
  lessonId?: string | number;
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
   * Opens edit mode
   * @default false
   */
  editMode?: boolean;
  /**
   * if the logged-in user is the  editor
   * @default false
   */
  isEditor?: boolean;
  /**
   * Callback fired on edit mode close
   * @default null
   */
  onEditModeClose?: () => void;
  /**
   * Handler on lesson change
   * @default null
   */
  onLessonChange?: (lessonId, sectionId) => void;
  /**
   * Handler on panel change
   * @default null
   */
  onActivePanelChange?: (panel) => void;
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
  const {
    className = null,
    course,
    courseId,
    sectionId,
    lesson = null,
    lessonId,
    LessonAppbarProps = {},
    LessonDrawerProps = {},
    isEditor = false,
    editMode = false,
    onEditModeClose = null,
    onLessonChange = null,
    onActivePanelChange = null,
    ...rest
  } = props;

  // HOOKS
  const theme = useTheme<SCThemeType>();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [_lessonId, setLessonId] = useState<number | string>(lessonId);
  const [_sectionId, setSectionId] = useState<number | string>(sectionId);
  const {scLesson, setSCLesson} = useSCFetchLesson({id: _lessonId, lesson, courseId: courseId ?? lesson.course_id, sectionId: _sectionId});
  const {scCourse, setSCCourse} = useSCFetchCourse({
    id: courseId ?? lesson.course_id,
    course,
    params: {view: isEditor ? CourseInfoViewType.EDIT : CourseInfoViewType.USER}
  });

  // STATE
  const [activePanel, setActivePanel] = useState<SCLessonActionsType>(null);
  const [settings, setSettings] = useState(null);
  const [updating, setUpdating] = useState(false);
  const [lessonContent, setLessonContent] = useState<string>('');
  const [lessonMedias, setLessonMedias] = useState<SCMediaType[]>(scLesson?.medias ?? []);
  const [loading, setLoading] = useState<boolean>(false);
  const [completed, setCompleted] = useState<boolean>(scLesson?.completion_status === SCCourseLessonCompletionStatusType.COMPLETED);
  const currentData = useMemo(() => {
    if (!scCourse || !scLesson) return null;
    return getCurrentSectionAndLessonIndex(scCourse, scLesson.section_id, scLesson.id);
  }, [scCourse, scLesson]);
  const [currentSectionIndex, setCurrentSectionIndex] = useState(currentData?.currentSectionIndex || 0);
  const [currentLessonIndex, setCurrentLessonIndex] = useState(currentData?.currentLessonIndex || 0);
  const [currentSection, setCurrentSection] = useState(scCourse?.sections?.[currentSectionIndex] || null);
  const isPrevDisabled = !scCourse?.sections || (currentSectionIndex === 0 && currentLessonIndex === 0);
  const isNextDisabled =
    !scCourse?.sections ||
    (currentSectionIndex === scCourse?.sections.length - 1 && currentLessonIndex === currentSection?.lessons?.length - 1) ||
    (currentLessonIndex < currentSection?.lessons?.length - 1
      ? currentSection.lessons[currentLessonIndex + 1]?.locked
      : scCourse?.sections[currentSectionIndex + 1]?.lessons[0]?.locked);
  const [openDialog, setOpenDialog] = useState<boolean>(false);

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
    onActivePanelChange && onActivePanelChange(panel);
  };
  const handleCloseDrawer = () => {
    setActivePanel(null);
    onEditModeClose && onEditModeClose();
    onActivePanelChange && onActivePanelChange(null);
  };

  const handleLessonContentEdit = (html: string) => {
    setLessonContent(html);
  };

  const handleLessonMediaEdit = (medias: SCMediaType[]) => {
    setLessonMedias(medias);
  };

  const handleChangeLesson = (l: SCCourseLessonType, s: SCCourseSectionType) => {
    setLessonId(l.id);
    setSectionId(s.id);
    setCurrentSection(s);
    onLessonChange && onLessonChange(l.id, s.id);
  };

  /**
   * Handles Lesson Edit
   */
  const handleLessonUpdate = () => {
    setUpdating(true);
    const mediaIds = lessonMedias.map((media) => media.id);
    const data: any = {...settings, type: scLesson.type, name: scLesson.name, text: lessonContent, medias: mediaIds};
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

  /**
   * Handles prev lesson navigation
   */

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

  /**
   * Handles next lesson navigation
   */
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

  /**
   * Handles toggle lesson complete/uncompleted
   */
  const toggleLessonCompletion = (c: boolean) => {
    setLoading(true);
    const service = completed
      ? () => CourseService.markLessonIncomplete(scLesson.course_id, scLesson.section_id, scLesson.id)
      : () => CourseService.markLessonComplete(scLesson.course_id, scLesson.section_id, scLesson.id);
    service()
      .then(() => {
        setCompleted(!c);
        setLoading(false);
        const updatedCourse = {
          ...scCourse,
          sections: scCourse.sections.map((section: SCCourseSectionType) => ({
            ...section,
            lessons: section.lessons.map((lesson: SCCourseLessonType) =>
              lesson.id === scLesson.id
                ? {...lesson, completion_status: c ? SCCourseLessonCompletionStatusType.UNCOMPLETED : SCCourseLessonCompletionStatusType.COMPLETED}
                : lesson
            )
          })),
          num_lessons_completed: c ? scCourse.num_lessons_completed - 1 : scCourse.num_lessons_completed + 1
        };
        setSCCourse(updatedCourse);
        if (updatedCourse.num_lessons === updatedCourse.num_lessons_completed) {
          setOpenDialog(true);
        }
      })
      .catch((error) => {
        setLoading(false);
        console.log(error);
      });
  };

  /**
   * Handles complete lesson dialog close
   */
  const handleCloseDialog = useCallback(() => {
    setOpenDialog(false);
  }, [setOpenDialog]);

  /**
   * Rendering
   */

  if (!scLesson || !scCourse) {
    return <HiddenPlaceholder />;
  }

  return (
    <Fragment>
      <Root className={classNames(classes.root, className)} {...rest}>
        <LessonAppbar
          showComments={scLesson.comments_enabled}
          editMode={editMode}
          activePanel={activePanel}
          title={scCourse.name}
          handleOpen={handleOpenDrawer}
          onSave={handleLessonUpdate}
          updating={updating}
          {...LessonAppbarProps}
        />
        <Container open={Boolean(activePanel) || editMode} className={classes.containerRoot}>
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
          <LessonObject
            course={scCourse}
            lesson={scLesson}
            editMode={editMode}
            onContentChange={handleLessonContentEdit}
            onMediaChange={handleLessonMediaEdit}
          />
          {!isEditor && (
            <LoadingButton
              className={classes.button}
              loading={loading}
              size="small"
              variant={completed ? 'outlined' : 'contained'}
              startIcon={!completed && <Icon>arrow_next</Icon>}
              endIcon={completed && <Icon>circle_checked</Icon>}
              onClick={() => toggleLessonCompletion(completed)}>
              {completed ? (
                <FormattedMessage id="templates.lesson.button.completed" defaultMessage="templates.lesson.button.completed" />
              ) : (
                <FormattedMessage id="templates.lesson.button.complete" defaultMessage="templates.lesson.button.complete" />
              )}
            </LoadingButton>
          )}
        </Container>
        <LessonDrawer
          course={scCourse}
          lesson={scLesson}
          editMode={isMobile ? activePanel === SCLessonActionsType.SETTINGS : editMode}
          activePanel={activePanel}
          handleClose={handleCloseDrawer}
          handleChangeLesson={handleChangeLesson}
          LessonEditFormProps={{lesson: scLesson, onSave: handleLessonUpdate, updating: updating, onSettingsChange: handleSettingsChange}}
          {...LessonDrawerProps}
        />
      </Root>
      {openDialog && <CourseCompletedDialog course={course} onClose={handleCloseDialog} />}
    </Fragment>
  );
}
