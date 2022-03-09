import React, {useContext, useMemo, useState} from 'react';
import {
  SCCategoryType,
  SCContext,
  SCContextType,
  SCMediaType,
  SCPollType,
  SCPreferences,
  SCPreferencesContext,
  SCPreferencesContextType,
  SCTagType,
  SCUserContext,
  SCUserContextType,
  UserUtils
} from '@selfcommunity/core';
import {Avatar, Box, Button, IconButton, PaperProps} from '@mui/material';
import {styled} from '@mui/material/styles';
import {SCMediaObjectType} from '../../types/media';
import Paper from '@mui/material/Paper';
import {Document, Image, Link} from '../../shared/Media';
import Composer, {MAIN_VIEW, POLL_VIEW} from '../Composer';
import Icon from '@mui/material/Icon';
import {FormattedMessage} from 'react-intl';
import {DistributiveOmit} from '@mui/types';
import {OverrideProps} from '@mui/material/OverridableComponent';
import {useSnackbar} from 'notistack';

const PREFIX = 'SCInlineComposer';

const classes = {
  root: `${PREFIX}-root`,
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
    justifyContent: 'flex-start',
    textTransform: 'none'
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
       * Initialization Data for the Composer, this is a hook to generate custom posts
       * @default null
       */
      defaultValue?: {
        title?: string;
        text?: string;
        categories?: SCCategoryType[];
        audience?: string;
        addressing?: SCTagType[];
        medias?: SCMediaType[];
        poll?: SCPollType;
        location?: string;
      };
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
/**
 > API documentation for the Community-UI Inline Composer component. Learn about the available props and the CSS API.
 *
 #### Import
 ```jsx
 import {InlineComposer} from '@selfcommunity/ui';
 ```
 #### Component Name
 The name `SCInlineComposer` can be used when providing style overrides in the theme.

 #### CSS

 |Rule Name|Global class|Description|
 |---|---|---|
 |root|.SCInlineComposer-root|Styles applied to the root element.|
 |input|.SCInlineComposer-input|Styles applied to the input element.|
 |actions|.SCInlineComposer-actions|Styles applied to the actions section.|
 |avatar|.SCInlineComposer-avatar|Styles applied to the avatar element.|


 * @param props
 */
export default function InlineComposer(props: InlineComposerProps): JSX.Element {
  // PROPS
  const {mediaObjectTypes = [Image, Document, Link], defaultValue, onSuccess = null, ...rest} = props;

  // Context
  const scContext: SCContextType = useContext(SCContext);
  const scPreferencesContext: SCPreferencesContextType = useContext(SCPreferencesContext);
  const scUserContext: SCUserContextType = useContext(SCUserContext);
  const {enqueueSnackbar} = useSnackbar();

  // State variables
  const [state, setState] = useState({...INITIAL_STATE});
  const {open, view} = state;

  /*
   * Compute preferences
   */
  const preferences = useMemo(() => {
    const _preferences = {};
    PREFERENCES.map((p) => (_preferences[p] = p in scPreferencesContext.preferences ? scPreferencesContext.preferences[p].value : null));
    return _preferences;
  }, [scPreferencesContext.preferences]);

  // Handlers
  const handleOpen = (view) => {
    return () => {
      if (scUserContext.user) {
        if (UserUtils.isBlocked(scUserContext.user)) {
          enqueueSnackbar(<FormattedMessage id="ui.common.userBlocked" defaultMessage="ui.common.userBlocked" />, {
            variant: 'warning'
          });
        } else {
          setState({view, open: true});
        }
      } else {
        scContext.settings.handleAnonymousAction();
      }
    };
  };

  const handleClose = () => {
    setState({...INITIAL_STATE});
  };

  const handleSuccess = (feedObject) => {
    if (onSuccess) {
      onSuccess(feedObject);
    }
    enqueueSnackbar(<FormattedMessage id="ui.inlineComposer.success" defaultMessage="ui.inlineComposer.success" />, {
      variant: 'success'
    });
    setState({...INITIAL_STATE});
  };

  return (
    <React.Fragment>
      <Root className={classes.root} {...rest}>
        <Box className={classes.input}>
          <Button variant="text" disableFocusRipple disableRipple disableElevation onClick={handleOpen(MAIN_VIEW)} fullWidth color="inherit">
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
              <Icon>bar_chart</Icon>
            </IconButton>
          )}
        </Box>
        <Box className={classes.avatar}>
          {!scUserContext.user ? (
            <Avatar variant="circular" />
          ) : (
            <Avatar alt={scUserContext.user.username} variant="circular" src={scUserContext.user.avatar} />
          )}
        </Box>
      </Root>
      <Composer
        open={open}
        view={view}
        mediaObjectTypes={mediaObjectTypes}
        defaultValue={defaultValue}
        maxWidth="sm"
        fullWidth
        scroll="body"
        onClose={handleClose}
        onSuccess={handleSuccess}
      />
    </React.Fragment>
  );
}
