import {Fragment, useCallback, useEffect, useMemo, useState} from 'react';
import {styled} from '@mui/material/styles';
import {useThemeProps} from '@mui/system';
import {Box, Icon, IconButton, Typography, useMediaQuery, useTheme, Alert} from '@mui/material';
import {PREFIX} from './constants';
import {SCCourseJoinStatusType, SCCourseLessonCompletionStatusType, SCCourseLessonType, SCCourseSectionType, SCMediaType} from '@selfcommunity/types';
import {SCRoutes, SCRoutingContextType, SCThemeType, useSCFetchCourse, useSCFetchLesson, useSCRouting, Link} from '@selfcommunity/react-core';
import classNames from 'classnames';
import {
  CourseCompletedDialog,
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
import {useSnackbar} from 'notistack';
import {getUrlLesson} from '@selfcommunity/react-ui';

const classes = {
  root: `${PREFIX}-root`,
  containerRoot: `${PREFIX}-container-root`,
  navigation: `${PREFIX}-navigation`,
  navigationTitle: `${PREFIX}-navigation-title`,
  previewInfo: `${PREFIX}-preview-info`,
  button: `${PREFIX}-button`
};

const Root = styled(Box, {
  name: PREFIX,
  slot: 'Root',
  overridesResolver: (_props, styles) => [styles.root]
})(() => ({}));

const Container = styled(Box, {
  name: PREFIX,
  slot: 'ContainerRoot',
  overridesResolver: (_props, styles) => styles.containerRoot,
  shouldForwardProp: (prop) => prop !== 'open'
})<{open?: boolean}>(() => ({}));

export interface LessonProps {
  /**
   * Overrides or extends the styles applied to the component.
   * @default null
   */
  className?: string;
  /**
   * The course id
   */
  courseId: string | number;
  /**
   * The section id
   */
  sectionId: string | number;
  /**
   * The lesson id
   */
  lessonId: string | number;
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
   * Renders preview mode
   * @default false
   */
  previewMode?: boolean;
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
   * Handler on status change
   * @default null
   */
  onLessonStatusChange?: () => void;
  /**
   * If passed renders the component with a specific section opened
   * @default null
   */
  lessonAction?: SCLessonActionsType;
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
    courseId,
    sectionId,
    lessonId,
    LessonAppbarProps = {},
    LessonDrawerProps = {},
    editMode = false,
    previewMode = false,
    onEditModeClose = null,
    onLessonChange = null,
    onActivePanelChange = null,
    onLessonStatusChange = null,
    lessonAction = null,
    ...rest
  } = props;

  // HOOKS
  const theme = useTheme<SCThemeType>();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [_lessonId, setLessonId] = useState<number | string>(lessonId);
  const [_sectionId, setSectionId] = useState<number | string>(sectionId);
  const {scLesson, setSCLesson} = useSCFetchLesson({id: _lessonId, courseId, sectionId: _sectionId});
  const {scCourse, refreshCourse} = useSCFetchCourse({
    id: courseId,
    params: {view: editMode || previewMode ? CourseInfoViewType.EDIT : CourseInfoViewType.USER}
  });
  const {enqueueSnackbar} = useSnackbar();
  const scRoutingContext: SCRoutingContextType = useSCRouting();

  // STATE
  const [activePanel, setActivePanel] = useState<SCLessonActionsType>(lessonAction);
  const [settings, setSettings] = useState(null);
  const [updating, setUpdating] = useState(false);
  const [lessonContent, setLessonContent] = useState<string>('');
  const [lessonMedias, setLessonMedias] = useState<SCMediaType[]>(scLesson?.medias ?? []);
  const [loading, setLoading] = useState<boolean>(false);
  const [completed, setCompleted] = useState<boolean | null>(null);
  const availableLessons = useMemo(() => {
    if (!scCourse?.sections) return [];
    return scCourse.sections.flatMap((section: SCCourseSectionType) => section.lessons.map((lesson: SCCourseLessonType) => ({...lesson, section})));
  }, [scCourse]);

  const [currentLessonIndex, setCurrentLessonIndex] = useState<number>(
    availableLessons.findIndex((lesson: SCCourseLessonType) => lesson.id === lessonId)
  );
  const isPrevDisabled = availableLessons.length === 0 || currentLessonIndex <= 0 || availableLessons[currentLessonIndex - 1]?.locked;
  const isNextDisabled =
    availableLessons.length === 0 || currentLessonIndex >= availableLessons.length - 1 || availableLessons[currentLessonIndex + 1]?.locked;
  const [openDialog, setOpenDialog] = useState<boolean>(false);
  const isCourseAdmin = useMemo(() => scCourse && scCourse.join_status === SCCourseJoinStatusType.CREATOR, [scCourse]);

  //EFFECTS

  useEffect(() => {
    const index = availableLessons.findIndex((lesson: SCCourseLessonType) => lesson.id === lessonId);
    setCurrentLessonIndex(index);
  }, [lessonId, availableLessons]);

  useEffect(() => {
    if (scLesson) {
      setCompleted(scLesson.completion_status === SCCourseLessonCompletionStatusType.COMPLETED);
    }
  }, [scLesson]);

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
        enqueueSnackbar(<FormattedMessage id="templates.lesson.save.success" defaultMessage="templates.lesson.save.success" />, {
          variant: 'success',
          autoHideDuration: 3000
        });
      })
      .catch((error) => {
        setUpdating(false);
        enqueueSnackbar(<FormattedMessage id="templates.lesson.save.error" defaultMessage="templates.lesson.save.error" />, {
          variant: 'error',
          autoHideDuration: 3000
        });
        console.log(error);
      });
  };

  /**
   * Handles prev lesson navigation
   */

  const handlePrev = () => {
    if (isPrevDisabled) return;
    const newLessonIndex = currentLessonIndex - 1;
    const newLesson = availableLessons[newLessonIndex];
    setCurrentLessonIndex(newLessonIndex);
    handleChangeLesson(newLesson, newLesson.section);
  };

  /**
   * Handles next lesson navigation
   */
  const handleNext = () => {
    if (isNextDisabled) return;
    const newLessonIndex = currentLessonIndex + 1;
    const newLesson = availableLessons[newLessonIndex];
    setCurrentLessonIndex(newLessonIndex);
    handleChangeLesson(newLesson, newLesson.section);
  };

  /**
   * Handles toggle lesson complete/uncompleted
   */
  const toggleLessonCompletion = () => {
    setLoading(true);
    const service = completed
      ? () => CourseService.markLessonIncomplete(scLesson.course_id, scLesson.section_id, scLesson.id)
      : () => CourseService.markLessonComplete(scLesson.course_id, scLesson.section_id, scLesson.id);
    service()
      .then(() => {
        setCompleted(!completed);
        setLoading(false);
        refreshCourse();
        if (!completed && scCourse.num_lessons === scCourse.num_lessons_completed + 1) {
          setOpenDialog(true);
        }
        onLessonStatusChange?.();
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
          {previewMode && (
            <Alert severity="info" className={classes.previewInfo}>
              <Typography variant="body1">
                <FormattedMessage
                  id="templates.lesson.previewMode"
                  defaultMessage="templates.lesson.previewMode"
                  values={{
                    link: (...chunks) => (
                      <Link to={scRoutingContext.url(SCRoutes.COURSE_LESSON_EDIT_ROUTE_NAME, getUrlLesson(scCourse, scLesson))}>{chunks}</Link>
                    ),
                    linkBack: (...chunks) => <Link to={scRoutingContext.url(SCRoutes.COURSE_DASHBOARD_ROUTE_NAME, scCourse)}>{chunks}</Link>
                  }}
                />
              </Typography>
            </Alert>
          )}
          <Box className={classes.navigation}>
            <Typography variant="body2" color="text.secondary">
              <FormattedMessage
                id="templates.lesson.number"
                defaultMessage="templates.lesson.number"
                values={{from: currentLessonIndex + 1, to: availableLessons.length}}
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
          {!isCourseAdmin && !editMode && !previewMode && (
            <LoadingButton
              className={classes.button}
              loading={loading}
              size="small"
              variant={completed ? 'outlined' : 'contained'}
              startIcon={!completed && <Icon>arrow_next</Icon>}
              endIcon={completed && <Icon>circle_checked</Icon>}
              onClick={toggleLessonCompletion}>
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
          previewMode={previewMode}
          activePanel={activePanel}
          handleClose={handleCloseDrawer}
          handleChangeLesson={handleChangeLesson}
          LessonEditFormProps={{lesson: scLesson, onSave: handleLessonUpdate, updating: updating, onSettingsChange: handleSettingsChange}}
          {...LessonDrawerProps}
        />
      </Root>
      {openDialog && <CourseCompletedDialog course={scCourse} onClose={handleCloseDialog} />}
    </Fragment>
  );
}
