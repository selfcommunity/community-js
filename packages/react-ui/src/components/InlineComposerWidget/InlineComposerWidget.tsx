import React, {useContext, useMemo, useState} from 'react';
import {SCCategoryType, SCMediaType, SCPollType, SCTagType} from '@selfcommunity/types';
import {
  SCContext,
  SCContextType,
  SCPreferences,
  SCPreferencesContext,
  SCPreferencesContextType,
  SCRoutes,
  SCRoutingContextType,
  SCUserContext,
  SCUserContextType,
  UserUtils,
  useSCRouting,
  Link,
  SCThemeType
} from '@selfcommunity/react-core';
import {Avatar, Box, Button, IconButton, CardProps, CardContent} from '@mui/material';
import {styled} from '@mui/material/styles';
import {SCMediaObjectType} from '../../types/media';
import {Document, Image, Link as MediaLink} from '../../shared/Media';
import Composer, {MAIN_VIEW, POLL_VIEW} from '../Composer';
import Icon from '@mui/material/Icon';
import {FormattedMessage} from 'react-intl';
import {DistributiveOmit} from '@mui/types';
import {OverrideProps} from '@mui/material/OverridableComponent';
import {useSnackbar} from 'notistack';
import Widget from '../Widget';
import {useThemeProps} from '@mui/system';

const PREFIX = 'SCInlineComposerWidget';

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
})(({theme}: {theme: SCThemeType}) => ({}));

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

export type InlineComposerWidgetProps<D extends React.ElementType = InlineComposerTypeMap['defaultComponent'], P = {}> = OverrideProps<
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
 * > API documentation for the Community-JS Inline Composer component. Learn about the available props and the CSS API.
 *
 *
 * This component renders This component renders the section used for feed objects creation
 * Take a look at our <strong>demo</strong> component [here](/docs/sdk/community-js/react-ui/Components/InlineComposer)

 #### Import
 ```jsx
 import {InlineComposerWidget} from '@selfcommunity/react-ui';
 ```
 #### Component Name
 The name `SCInlineComposerWidget` can be used when providing style overrides in the theme.

 #### CSS

 |Rule Name|Global class|Description|
 |---|---|---|
 |root|.SCInlineComposerWidget-root|Styles applied to the root element.|
 |content|.SCInlineComposerWidget-content|Styles applied to the content element.|
 |input|.SCInlineComposerWidget-input|Styles applied to the input element.|
 |actions|.SCInlineComposerWidget-actions|Styles applied to the actions section.|
 |avatar|.SCInlineComposerWidget-avatar|Styles applied to the avatar element.|


 * @param inProps
 */
export default function InlineComposerWidget(inProps: InlineComposerWidgetProps): JSX.Element {
  // PROPS
  const props: InlineComposerWidgetProps = useThemeProps({
    props: inProps,
    name: PREFIX
  });
  const {mediaObjectTypes = [Image, Document, MediaLink], defaultValue, onSuccess = null, ...rest} = props;

  // Context
  const scContext: SCContextType = useContext(SCContext);
  const scPreferencesContext: SCPreferencesContextType = useContext(SCPreferencesContext);
  const scUserContext: SCUserContextType = useContext(SCUserContext);
  const scRoutingContext: SCRoutingContextType = useSCRouting();
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
    enqueueSnackbar(<FormattedMessage id="ui.inlineComposerWidget.success" defaultMessage="ui.inlineComposerWidget.success" />, {
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
              <FormattedMessage id="ui.inlineComposerWidget.label" defaultMessage="ui.inlineComposerWidget.label" />
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
              <Link to={scRoutingContext.url(SCRoutes.USER_PROFILE_ROUTE_NAME, scUserContext.user)}>
                <Avatar alt={scUserContext.user.username} variant="circular" src={scUserContext.user.avatar} />
              </Link>
            )}
          </Box>
        </CardContent>
      </Root>
      <Composer
        open={open}
        view={view}
        mediaObjectTypes={mediaObjectTypes}
        defaultValue={defaultValue}
        fullWidth
        scroll="body"
        onClose={handleClose}
        onSuccess={handleSuccess}
      />
    </React.Fragment>
  );
}
