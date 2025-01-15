import React from 'react';
import {styled} from '@mui/material/styles';
import {useThemeProps} from '@mui/system';
import classNames from 'classnames';
import {AppBar, Icon, IconButton, Toolbar, Typography} from '@mui/material';
import {PREFIX} from './constants';
import {SCLessonActionsType} from '../../types';

const classes = {
  root: `${PREFIX}-root`
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
   * onArrowBack Callback
   */
  onArrowBackClick: () => void;
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
   * Handles panel closing
   */
  handleClose: () => void;
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
  const {className = null, title = '', activePanel = null, handleOpen, handleClose, onArrowBackClick, ...rest} = props;

  return (
    <Root position="fixed" open={Boolean(activePanel)} className={classNames(classes.root, className)} {...rest}>
      <Toolbar>
        <IconButton edge="start" onClick={onArrowBackClick}>
          <Icon>arrow_back</Icon>
        </IconButton>
        <Typography variant="h6" sx={{flexGrow: 1}}>
          {title}
        </Typography>
        <IconButton onClick={() => handleOpen(SCLessonActionsType.COMMENTS)}>
          <Icon>chat_bubble_outline</Icon>
        </IconButton>
        <IconButton onClick={() => handleOpen(SCLessonActionsType.LESSONS)}>
          <Icon>courses</Icon>
        </IconButton>
      </Toolbar>
    </Root>
  );
}
