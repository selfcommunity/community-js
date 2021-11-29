import React, {useContext, useMemo, useState} from 'react';
import {SCPreferences, SCPreferencesContext, SCPreferencesContextType, SCUserContext, SCUserContextType} from '@selfcommunity/core';
import {Avatar, Box, Button, CardProps, IconButton} from '@mui/material';
import {styled} from '@mui/material/styles';
import {SCComposerMediaActionType} from '../../types/composer';
import Paper from '@mui/material/Paper';
import {Document, Image, Link} from '../Composer/MediaAction';
import Composer, {MAIN_VIEW, POLL_VIEW} from '../Composer';
import PollIcon from '@mui/icons-material/BarChartOutlined';
import {FormattedMessage} from 'react-intl';

const PREFIX = 'SCInlineComposer';

const classes = {
  input: `${PREFIX}-input`,
  actions: `${PREFIX}-actions`,
  avatar: `${PREFIX}-avatar`
};

const Root = styled(Paper, {
  name: PREFIX,
  slot: 'Root',
  overridesResolver: (props, styles) => styles.root
})(({theme}) => ({
  padding: theme.spacing(),
  display: 'flex',
  flexDirection: 'row',
  justifyContent: 'space-between',
  [`& .${classes.input}`]: {
    flexGrow: 2
  },
  [`& .${classes.input} .MuiButton-text`]: {
    justifyContent: 'flex-start'
  }
}));

const PREFERENCES = [
  SCPreferences.CONFIGURATIONS_POST_TYPE_ENABLED,
  SCPreferences.CONFIGURATIONS_DISCUSSION_TYPE_ENABLED,
  SCPreferences.ADDONS_POST_GEOLOCATION_ENABLED,
  SCPreferences.ADDONS_POLLS_ENABLED,
  SCPreferences.ADDONS_VIDEO_UPLOAD_ENABLED
];

const INITIAL_STATE = {
  open: false,
  view: null
};

export default function InlineComposer({
  mediaActions = [Image, Document, Link],
  onSuccess = null,
  ...props
}: {
  mediaActions?: SCComposerMediaActionType[];
  onSuccess?: (feedObject: any) => void;
  props: CardProps;
}): JSX.Element {
  // Context
  const scPrefernces: SCPreferencesContextType = useContext(SCPreferencesContext);
  const scUser: SCUserContextType = useContext(SCUserContext);

  // State variables
  const [state, setState] = useState({...INITIAL_STATE});
  const {open, view} = state;

  /*
   * Compute preferences
   */
  const preferences = useMemo(() => {
    const _preferences = {};
    PREFERENCES.map((p) => (_preferences[p] = p in scPrefernces.preferences ? scPrefernces.preferences[p].value : null));
    return _preferences;
  }, [scPrefernces.preferences]);

  // Handlers
  const handleOpen = (view) => {
    return () => setState({view, open: true});
  };

  const handleClose = () => {
    setState({...INITIAL_STATE});
  };

  const handleSuccess = (feedObject) => {
    onSuccess && onSuccess(feedObject);
    setState({...INITIAL_STATE});
  };

  return (
    <React.Fragment>
      <Root {...props}>
        <Box className={classes.input}>
          <Button variant="text" disableFocusRipple disableRipple disableElevation onClick={handleOpen(MAIN_VIEW)} fullWidth>
            <FormattedMessage id="ui.inlineComposer.label" defaultMessage="ui.inlineComposer.label" />
          </Button>
        </Box>
        <Box className={classes.actions}>
          {mediaActions.map((action: SCComposerMediaActionType) => (
            <action.button key={action.name} onClick={handleOpen(action.name)} />
          ))}
          {preferences[SCPreferences.ADDONS_POLLS_ENABLED] && (
            <IconButton onClick={handleOpen(POLL_VIEW)}>
              <PollIcon />
            </IconButton>
          )}
        </Box>
        <Box className={classes.avatar}>
          <Avatar alt={scUser.user.username} variant="circular" src={scUser.user.avatar} />
        </Box>
      </Root>
      <Composer
        open={open}
        view={view}
        mediaActions={mediaActions}
        maxWidth="sm"
        fullWidth
        scroll="body"
        onClose={handleClose}
        onSuccess={handleSuccess}
      />
    </React.Fragment>
  );
}
