import React, {useState} from 'react';
import {styled} from '@mui/material/styles';
import {useThemeProps} from '@mui/system';
import {
  AppBar,
  Box,
  Button,
  Checkbox,
  Divider,
  Drawer,
  FormControl,
  FormControlLabel,
  FormLabel,
  Icon,
  IconButton,
  List,
  Radio,
  RadioGroup,
  Toolbar,
  Typography,
  useMediaQuery,
  useTheme
} from '@mui/material';
import {PREFIX} from './constants';
import {SCCourseStatusType, SCCourseType} from '@selfcommunity/types';
import {SCContextType, SCRoutingContextType, SCThemeType, useSCContext, useSCRouting} from '@selfcommunity/react-core';
import LessonObject from '../LessonObject';
import {SCLessonActionsType} from '../../types/course';
import ScrollContainer from '../../shared/ScrollContainer';
import {FormattedMessage} from 'react-intl';
import classNames from 'classnames';

const classes = {
  root: `${PREFIX}-root`,
  info: `${PREFIX}-info`,
  settings: `${PREFIX}-settings`,
  drawerRoot: `${PREFIX}-drawer-root`,
  drawerHeader: `${PREFIX}-drawer-header`,
  drawerHeaderEdit: `${PREFIX}-drawer-header-edit`,
  drawerHeaderAction: `${PREFIX}-drawer-header-action`,
  drawerContent: `${PREFIX}-drawer-content`
};

const Root = styled(Box, {
  name: PREFIX,
  slot: 'Root',
  overridesResolver: (props, styles) => [styles.root]
})(() => ({}));

const DrawerRoot = styled(Drawer, {
  name: PREFIX,
  slot: 'DrawerRoot',
  overridesResolver: (props, styles) => styles.drawerRoot
})(({theme}) => ({}));

export interface LessonComponentProps {
  /**
   * The Course title
   */
  title: string;
  /**
   * The course object
   */
  course: SCCourseType;
  /**
   * Overrides or extends the styles applied to the component.
   * @default null
   */
  className?: string;
  /**
   * If the component should be rendered in edit mode.
   * @default false
   */
  isEditMode?: boolean;
  /**
   * onArrowBack Callback
   */
  onArrowBackClick: () => any;
  /**
   * Props to spread to ScrollContainer component
   * This lib use 'react-custom-scrollbars' component to perform scrollbars
   * For more info: https://github.com/malte-wessel/react-custom-scrollbars/blob/master/docs/API.md
   * @default {}
   */
  ScrollContainerProps?: Record<string, any>;
  /**
   * Any other properties
   */
  [p: string]: any;
}

export default function LessonComponent(inProps: LessonComponentProps): JSX.Element {
  // PROPS
  const props: LessonComponentProps = useThemeProps({
    props: inProps,
    name: PREFIX
  });
  const {className = null, title = 'Course Title', onArrowBackClick, ScrollContainerProps = {}, isEditMode = true, ...rest} = props;

  // CONTEXT
  const scContext: SCContextType = useSCContext();
  const scRoutingContext: SCRoutingContextType = useSCRouting();

  // STATE
  const theme = useTheme<SCThemeType>();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [activePanel, setActivePanel] = useState<SCLessonActionsType>(null);
  const [value, setValue] = useState<SCCourseStatusType>(SCCourseStatusType.DRAFT);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setValue((event.target as HTMLInputElement).value);
  };

  // HANDLERS
  const handleIconClick = (panel: SCLessonActionsType) => {
    setActivePanel((prevPanel) => (prevPanel === panel ? null : panel));
  };
  const handleCloseDrawer = () => {
    setActivePanel(null);
  };

  return (
    <Root className={classes.root}>
      <AppBar position="static" color="primary">
        <Toolbar>
          <IconButton edge="start" onClick={onArrowBackClick}>
            <Icon>arrow_back</Icon>
          </IconButton>
          <Typography variant="h6" sx={{flexGrow: 1}}>
            {title}
          </Typography>
          <IconButton onClick={() => handleIconClick(SCLessonActionsType.COMMENTS)}>
            <Icon>chat_bubble_outline</Icon>
          </IconButton>
          <IconButton onClick={() => handleIconClick(SCLessonActionsType.LESSONS)}>
            <Icon>courses</Icon>
          </IconButton>
        </Toolbar>
      </AppBar>
      <Box className={classes.info}>
        <Typography variant="body2" color="text.secondary">
          <FormattedMessage id="ui.lessonComponent.lessonNumber" defaultMessage="ui.lessonComponent.lessonNumber" values={{from: 1, to: 5}} />
        </Typography>
      </Box>
      <LessonObject
        endActions={
          <>
            <IconButton>
              <Icon>arrow_back</Icon>
            </IconButton>
          </>
        }
      />
      {activePanel && (
        <DrawerRoot className={classes.drawerRoot} anchor="right" open={Boolean(activePanel)} onClose={handleCloseDrawer}>
          <Box className={classNames(classes.drawerHeader, {[classes.drawerHeaderEdit]: isEditMode})}>
            {isEditMode ? (
              <>
                <Button variant="outlined" size="small" onClick={handleCloseDrawer}>
                  <FormattedMessage id="ui.lessonComponent.edit.button.see" defaultMessage="ui.lessonComponent.edit.button.see" />
                </Button>
                <Button variant="contained" size="small" onClick={handleCloseDrawer}>
                  <FormattedMessage id="ui.lessonComponent.edit.button.save" defaultMessage="ui.lessonComponent.edit.button.save" />
                </Button>
              </>
            ) : (
              <>
                <Typography variant="h5" textAlign="center">
                  {activePanel === SCLessonActionsType.COMMENTS ? 'Comments' : 'Lesson List'}
                </Typography>
                <IconButton className={classes.drawerHeaderAction} onClick={handleCloseDrawer}>
                  <Icon>close</Icon>
                </IconButton>
              </>
            )}
          </Box>
          <Divider />
          {isEditMode ? (
            <Box className={classes.drawerContent}>
              <FormControl>
                <FormLabel id="status">
                  <FormattedMessage id="ui.lessonComponent.edit.status.title" defaultMessage="ui.lessonComponent.edit.status.title" />
                </FormLabel>
                <RadioGroup
                  aria-labelledby="course-status-radio-buttons-group"
                  name="course-status-radio-buttons-group"
                  value={value}
                  onChange={handleChange}>
                  <FormControlLabel
                    value={SCCourseStatusType.DRAFT}
                    control={<Radio />}
                    label={<FormattedMessage id="ui.lessonComponent.edit.status.draft" defaultMessage="ui.lessonComponent.edit.status.draft" />}
                  />
                  <FormControlLabel
                    value={SCCourseStatusType.PUBLISHED}
                    control={<Radio />}
                    label={
                      <FormattedMessage id="ui.lessonComponent.edit.status.published" defaultMessage="ui.lessonComponent.edit.status.published" />
                    }
                  />
                </RadioGroup>
              </FormControl>
              <FormControl className={classes.settings}>
                <FormLabel id="settings">
                  <FormattedMessage id="ui.lessonComponent.edit.settings.title" defaultMessage="ui.lessonComponent.edit.settings.title" />
                </FormLabel>
                <FormControlLabel
                  control={<Checkbox />}
                  label={
                    <FormattedMessage
                      id="ui.lessonComponent.edit.settings.enableComments"
                      defaultMessage="ui.lessonComponent.edit.settings.enableComments"
                    />
                  }
                />
              </FormControl>
            </Box>
          ) : (
            <ScrollContainer {...ScrollContainerProps}>
              <List className={classes.drawerContent} onClick={handleCloseDrawer}>
                {activePanel === SCLessonActionsType.COMMENTS ? 'Comment content' : 'Lesson content'}
              </List>
            </ScrollContainer>
          )}
        </DrawerRoot>
      )}
    </Root>
  );
}
