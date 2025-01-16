import React from 'react';
import {styled} from '@mui/material/styles';
import {useThemeProps} from '@mui/system';
import classNames from 'classnames';
import {AppBar, Button, Icon, IconButton, Toolbar, Typography} from '@mui/material';
import {PREFIX} from './constants';
import {SCLessonActionsType} from '../../types';
import {FormattedMessage} from 'react-intl';

const classes = {
  root: `${PREFIX}-root`,
  title: `${PREFIX}-title`
};

const Root = styled(AppBar, {
  name: PREFIX,
  slot: 'Root',
  overridesResolver: (props, styles) => [styles.root],
  shouldForwardProp: (prop) => prop !== 'open'
})<{open: boolean}>(({theme}) => ({}));

export interface LessonAppbarProps {
  /**
   * The appbar title
   */
  title: string;
  /**
   * The edit mode
   * @default false
   */
  editMode: boolean;
  /**
   * onArrowBack Callback
   */
  onArrowBackClick: () => void;
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
  const {className = null, title = '', activePanel = null, handleOpen, onSave, editMode, onArrowBackClick, ...rest} = props;

  return (
    <Root position="fixed" open={Boolean(activePanel)} className={classNames(classes.root, className)} {...rest}>
      <Toolbar>
        <IconButton edge="start" onClick={onArrowBackClick}>
          <Icon>arrow_back</Icon>
        </IconButton>
        <Typography variant="h6" className={classes.title}>
          {title}
        </Typography>
        {editMode ? (
          <>
            <IconButton onClick={() => handleOpen(SCLessonActionsType.SETTINGS)} color="primary">
              <Icon>settings</Icon>
            </IconButton>
            <Button variant="contained" size="small" onClick={onSave}>
              <FormattedMessage id="ui.lessonAppbar.button.save" defaultMessage="ui.lessonAppbar.button.save" />
            </Button>
          </>
        ) : (
          <>
            <IconButton onClick={() => handleOpen(SCLessonActionsType.COMMENTS)}>
              <Icon>chat_bubble_outline</Icon>
            </IconButton>
            <IconButton onClick={() => handleOpen(SCLessonActionsType.LESSONS)}>
              <Icon>courses</Icon>
            </IconButton>
          </>
        )}
      </Toolbar>
    </Root>
  );
}
