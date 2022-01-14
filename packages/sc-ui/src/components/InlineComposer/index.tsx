import React, {useContext, useMemo, useState} from 'react';
import {SCPreferences, SCPreferencesContext, SCPreferencesContextType, SCUserContext, SCUserContextType} from '@selfcommunity/core';
import {Avatar, Box, Button, IconButton, PaperProps} from '@mui/material';
import {styled} from '@mui/material/styles';
import {SCMediaObjectType} from '../../types/media';
import Paper from '@mui/material/Paper';
import {Document, Image, Link} from '../../shared/Media';
import Composer, {MAIN_VIEW, POLL_VIEW} from '../Composer';
import PollIcon from '@mui/icons-material/BarChartOutlined';
import {FormattedMessage} from 'react-intl';
import {DistributiveOmit} from '@mui/types';
import {OverrideProps} from '@mui/material/OverridableComponent';

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
  marginBottom: theme.spacing(2),
  [`& .${classes.input}`]: {
    flexGrow: 2
  },
  [`& .${classes.input} .MuiButton-text`]: {
    justifyContent: 'flex-start'
  }
}));

export interface InlineComposerTypeMap<P = {}, D extends React.ElementType = 'div'> {
  props: P &
    DistributiveOmit<PaperProps, 'defaultValue'> & {
      /**
       * Media objects available
       * @default Image, Document, Link
       */
      mediaObjectTypes?: SCMediaObjectType[];
      /**
       * Callback triggered on success contribution creation
       * @default null
       */
      onSuccess?: (res: any) => void;
    };
  defaultComponent: D;
}

export type InlineComposerProps<D extends React.ElementType = InlineComposerTypeMap['defaultComponent'], P = {}> = OverrideProps<
  InlineComposerTypeMap<P, D>,
  D
>;

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

export default function InlineComposer(props: InlineComposerProps): JSX.Element {
  // PROPS
  const {mediaObjectTypes = [Image, Document, Link], onSuccess = null, ...rest} = props;

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
      <Root {...rest}>
        <Box className={classes.input}>
          <Button variant="text" disableFocusRipple disableRipple disableElevation onClick={handleOpen(MAIN_VIEW)} fullWidth>
            <FormattedMessage id="ui.inlineComposer.label" defaultMessage="ui.inlineComposer.label" />
          </Button>
        </Box>
        <Box className={classes.actions}>
          {mediaObjectTypes
            .filter((mediaObjectType: SCMediaObjectType) => mediaObjectType.editButton !== null)
            .map((mediaObjectType: SCMediaObjectType) => (
              <mediaObjectType.editButton key={mediaObjectType.name} onClick={handleOpen(mediaObjectType.name)} />
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
        mediaObjectTypes={mediaObjectTypes}
        maxWidth="sm"
        fullWidth
        scroll="body"
        onClose={handleClose}
        onSuccess={handleSuccess}
      />
    </React.Fragment>
  );
}
