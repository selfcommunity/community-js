import React, {useContext, useMemo, useState} from 'react';
import {SCCategoryType, SCMediaType, SCPollType, SCTagType} from '@selfcommunity/types';
import {
  SCContext,
  SCContextType,
  SCPreferences,
  SCPreferencesContext,
  SCPreferencesContextType,
  SCUserContext,
  SCUserContextType,
  UserUtils
} from '@selfcommunity/react-core';
import {Avatar, Box, Button, IconButton, CardProps, CardContent} from '@mui/material';
import {styled} from '@mui/material/styles';
import {SCMediaObjectType} from '../../types/media';
import {Document, Image, Link} from '../../shared/Media';
import Composer, {MAIN_VIEW, POLL_VIEW} from '../Composer';
import Icon from '@mui/material/Icon';
import {FormattedMessage} from 'react-intl';
import {DistributiveOmit} from '@mui/types';
import {OverrideProps} from '@mui/material/OverridableComponent';
import {useSnackbar} from 'notistack';
import Widget from '../Widget';
import {useThemeProps} from '@mui/system';

const PREFIX = 'SCInlineComposer';

const classes = {
  root: `${PREFIX}-root`,
  content: `${PREFIX}-content`,
  input: `${PREFIX}-input`,
  actions: `${PREFIX}-actions`,
  avatar: `${PREFIX}-avatar`
};

const Root = styled(Widget, {
  name: PREFIX,
  slot: 'Root',
  overridesResolver: (props, styles) => styles.root
})(({theme}) => ({
  marginBottom: theme.spacing(2),
  [`& .${classes.content}`]: {
    padding: theme.spacing(),
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    '&:last-child': {
      paddingBottom: 5
    },
    [`& .${classes.input}`]: {
      flexGrow: 2
    },
    [`& .${classes.input} .MuiButton-text`]: {
      justifyContent: 'flex-start',
      textTransform: 'none'
    }
  }
}));

export interface InlineComposerTypeMap<P = {}, D extends React.ElementType = 'div'> {
  props: P &
    DistributiveOmit<CardProps, 'defaultValue'> & {
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
 > API documentation for the Community-JS Inline Composer component. Learn about the available props and the CSS API.
 *
 #### Import
 ```jsx
 import {InlineComposer} from '@selfcommunity/react-ui';
 ```
 #### Component Name
 The name `SCInlineComposer` can be used when providing style overrides in the theme.

 #### CSS

 |Rule Name|Global class|Description|
 |---|---|---|
 |root|.SCInlineComposer-root|Styles applied to the root element.|
 |content|.SCInlineComposer-content|Styles applied to the content element.|
 |input|.SCInlineComposer-input|Styles applied to the input element.|
 |actions|.SCInlineComposer-actions|Styles applied to the actions section.|
 |avatar|.SCInlineComposer-avatar|Styles applied to the avatar element.|


 * @param inProps
 */
export default function InlineComposer(inProps: InlineComposerProps): JSX.Element {
  // PROPS
  const props: InlineComposerProps = useThemeProps({
    props: inProps,
    name: PREFIX
  });
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
            variant: 'warning',
            autoHideDuration: 3000
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
      variant: 'success',
      autoHideDuration: 3000
    });
    setState({...INITIAL_STATE});
  };

  return (
    <React.Fragment>
      <Root className={classes.root} {...rest}>
        <CardContent className={classes.content}>
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
        </CardContent>
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
