import {useThemeProps} from '@mui/system';
import classNames from 'classnames';
import {AppBar, Icon, IconButton, Toolbar, Typography, Box, styled, Button} from '@mui/material';
import {PREFIX} from './constants';
import {SCLessonActionsType} from '../../types';
import {FormattedMessage} from 'react-intl';

const classes = {
  root: `${PREFIX}-root`,
  startItems: `${PREFIX}-start-items`,
  endItems: `${PREFIX}-end-items`,
  title: `${PREFIX}-title`
};

const Root = styled(AppBar, {
  name: PREFIX,
  slot: 'Root',
  overridesResolver: (_props, styles) => [styles.root],
  shouldForwardProp: (prop) => prop !== 'open'
})<{open: boolean}>(() => ({}));

export interface LessonAppbarProps {
  /**
   * The appbar title
   */
  title: string;
  /**
   *  If comments are enabled for the lesson showed
   */
  showComments: boolean;
  /**
   * The edit mode
   * @default false
   */
  editMode: boolean;
  /**
   * onArrowBack Callback
   */
  onArrowBackClick?: () => void;
  /**
   * onSaveCallback
   */
  onSave: () => void;
  /**
   * The active panel
   */
  activePanel: SCLessonActionsType | null;
  /**
   * Handles panel opening
   * @param panel
   */
  handleOpen: (panel: SCLessonActionsType) => void;
  /**
   * Indicates whether an update is currently in progress.
   */
  updating: boolean;
  /**
   * Any other properties
   */
  [p: string]: any;
}

export default function LessonAppbar(inProps: LessonAppbarProps): JSX.Element {
  // PROPS
  const props: LessonAppbarProps = useThemeProps({
    props: inProps,
    name: PREFIX
  });
  const {className = null, title = '', showComments, activePanel = null, handleOpen, onSave, editMode, onArrowBackClick, updating, ...rest} = props;

  return (
    <Root position="fixed" open={Boolean(activePanel)} className={classNames(classes.root, className)} {...rest}>
      <Toolbar>
        <Box className={classes.startItems}>
          <IconButton edge="start" onClick={onArrowBackClick}>
            <Icon>arrow_back</Icon>
          </IconButton>
          <Typography variant="h6" className={classes.title}>
            {title}
          </Typography>
        </Box>
        {editMode ? (
          <>
            <IconButton onClick={() => handleOpen(SCLessonActionsType.SETTINGS)} color="primary">
              <Icon>settings</Icon>
            </IconButton>
            <Button variant="contained" size="small" onClick={onSave} loading={updating}>
              <FormattedMessage id="ui.lessonAppbar.button.save" defaultMessage="ui.lessonAppbar.button.save" />
            </Button>
          </>
        ) : (
          <Box className={classes.endItems}>
            {showComments && (
              <IconButton onClick={() => handleOpen(SCLessonActionsType.COMMENTS)}>
                <Icon>chat_bubble_outline</Icon>
              </IconButton>
            )}
            <IconButton onClick={() => handleOpen(SCLessonActionsType.LESSONS)}>
              <Icon>courses</Icon>
            </IconButton>
          </Box>
        )}
      </Toolbar>
    </Root>
  );
}
