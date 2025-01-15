import React, {useState} from 'react';
import {styled} from '@mui/material/styles';
import {useThemeProps} from '@mui/system';
import {Box} from '@mui/material';
import {PREFIX} from './constants';
import {SCContributionType, SCCourseLessonType, SCCourseType} from '@selfcommunity/types';
import {SCRoutingContextType, useSCFetchFeedObject, useSCRouting} from '@selfcommunity/react-core';
import classNames from 'classnames';
import {LessonAppbar, LessonAppbarProps, LessonDrawer, LessonObject, SCLessonActionsType, LessonDrawerProps} from '@selfcommunity/react-ui';
import {CourseService} from '@selfcommunity/api-services';

const classes = {
  root: `${PREFIX}-root`,
  containerRoot: `${PREFIX}-container-root`
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
})<{open?: boolean}>(({theme}) => ({}));

export interface LessonProps {
  /**
   * Overrides or extends the styles applied to the component.
   * @default null
   */
  className?: string;
  /**
   * The course object
   */
  course: SCCourseType;
  /**
   * Props to spread to LessonAppbar Component
   * @default {title: '', onArrowBackClick: null}
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

const initialLesson: SCCourseLessonType = {id: 1, name: 'Cinture', completed: true};

export default function Lesson(inProps: LessonProps): JSX.Element {
  // PROPS
  const props: LessonProps = useThemeProps({
    props: inProps,
    name: PREFIX
  });
  const {
    className = null,
    feedObjectId = 3078,
    feedObject = null,
    feedObjectType = SCContributionType.DISCUSSION,
    LessonAppbarProps = {title: '', onArrowBackClick: null},
    LessonDrawerProps = {},
    ...rest
  } = props;

  // CONTEXT
  const scRoutingContext: SCRoutingContextType = useSCRouting();

  // STATE
  const [activePanel, setActivePanel] = useState<SCLessonActionsType>(null);
  const [settings, setSettings] = useState(initialLesson);
  const [updating, setUpdating] = useState(true);
  const [lesson, setLesson] = useState({id: 1, name: 'Cinture', completed: true});
  const {obj} = useSCFetchFeedObject({id: feedObjectId, feedObject, feedObjectType});
  // const isEditMode = useMemo(() => {
  //   return value.startsWith(scRoutingContext.url(SCRoutes.COURSE_EDIT_ROUTE_NAME, {}));
  // }, [value, scRoutingContext]);
  const isEditMode = true;
  const isCourseCreator = false;

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
  };

  const handleLessonContentEdit = (content) => {
    console.log('.');
  };

  const handleChangeLesson = (lessonObj) => {
    setLesson(lessonObj);
  };

  /**
   * Handles Lesson Edit
   */
  const handleLessonUpdate = () => {
    setUpdating(true);
    const data: any = {settings};
    CourseService.updateCourseLesson(obj.id, obj.id, obj.id, data)
      .then(() => {
        setUpdating(false);
      })
      .catch((error) => {
        setUpdating(false);
        console.log(error);
      });
  };

  return (
    <Root className={classNames(classes.root, className)} {...rest}>
      <LessonAppbar
        title={LessonAppbarProps.title}
        activePanel={activePanel}
        handleClose={handleCloseDrawer}
        handleOpen={handleOpenDrawer}
        onArrowBackClick={LessonAppbarProps.onArrowBackClick}
        {...LessonAppbarProps}
      />
      <Container open={Boolean(activePanel) || isEditMode} className={classes.containerRoot}>
        <LessonObject
          editMode={isEditMode}
          lesson={lesson}
          lessonObj={obj}
          onContentChange={handleLessonContentEdit}
          onLessonNavigationChange={(l: any) => setLesson(l)}
        />
      </Container>
      <LessonDrawer
        editMode={isEditMode}
        activePanel={activePanel}
        lesson={lesson}
        handleUpdate={handleLessonUpdate}
        handleClose={handleCloseDrawer}
        handleSettingsChange={handleSettingsChange}
        handleChangeLesson={handleChangeLesson}
        {...LessonDrawerProps}
      />
    </Root>
  );
}
