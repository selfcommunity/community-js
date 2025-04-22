import React, {useCallback, useMemo, useState} from 'react';
import {SCCategoryType, SCEventType, SCFeedTypologyType, SCGroupType, SCMediaType, SCPollType, SCTagType} from '@selfcommunity/types';
import {
  Link,
  SCContextType,
  SCPreferences,
  SCPreferencesContextType,
  SCRoutes,
  SCRoutingContextType,
  SCUserContextType,
  UserUtils,
  useSCContext,
  useSCPreferences,
  useSCRouting,
  useSCUser
} from '@selfcommunity/react-core';
import {Avatar, Box, Button, CardContent, styled} from '@mui/material';
import {SCMediaObjectType} from '../../types/media';
import {FormattedMessage} from 'react-intl';
import {useSnackbar} from 'notistack';
import Widget, {WidgetProps} from '../Widget';
import {useThemeProps} from '@mui/system';
import Composer from '../Composer';
import {File, Link as MediaLink} from '../../shared/Media';
import {PREFIX} from './constants';
import HiddenPlaceholder from '../../shared/HiddenPlaceholder';

const classes = {
  root: `${PREFIX}-root`,
  content: `${PREFIX}-content`,
  input: `${PREFIX}-input`,
  avatar: `${PREFIX}-avatar`
};

const Root = styled(Widget, {
  name: PREFIX,
  slot: 'Root'
})(() => ({}));

export interface InlineComposerWidgetProps extends Omit<WidgetProps, 'defaultValue'> {
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
    event?: SCEventType;
    group?: SCGroupType;
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
  /**
   * The label showed inside the composer
   */
  label?: any;
  /**
   * The feed where the component is rendered
   * @default SCFeedTypologyType.HOME
   */
  feedType?: SCFeedTypologyType;
}

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
 |avatar|.SCInlineComposerWidget-avatar|Styles applied to the avatar element.|


 * @param inProps
 */
export default function InlineComposerWidget(inProps: InlineComposerWidgetProps): JSX.Element {
  // PROPS
  const props: InlineComposerWidgetProps = useThemeProps({
    props: inProps,
    name: PREFIX
  });
  const {mediaObjectTypes = [File, MediaLink], defaultValue, onSuccess = null, label, feedType = SCFeedTypologyType.HOME, ...rest} = props;

  // Context
  const scContext: SCContextType = useSCContext();
  const scUserContext: SCUserContextType = useSCUser();
  const scRoutingContext: SCRoutingContextType = useSCRouting();
  const {enqueueSnackbar} = useSnackbar();

  // PREFERENCES
  const preferences: SCPreferencesContextType = useSCPreferences();
  const onlyStaffEnabled = useMemo(
    () => preferences.preferences[SCPreferences.CONFIGURATIONS_POST_ONLY_STAFF_ENABLED].value,
    [preferences.preferences]
  );

  // State variables
  const [open, setOpen] = useState<boolean>(false);

  // Handlers
  const handleOpen = useCallback(() => {
    if (scUserContext.user) {
      if (UserUtils.isBlocked(scUserContext.user)) {
        enqueueSnackbar(<FormattedMessage id="ui.common.userBlocked" defaultMessage="ui.common.userBlocked" />, {
          variant: 'warning',
          autoHideDuration: 3000
        });
      } else {
        setOpen(true);
      }
    } else {
      scContext.settings.handleAnonymousAction();
    }
  }, [scUserContext.user, scContext.settings]);

  const handleClose = useCallback(() => {
    setOpen(false);
  }, []);

  const handleSuccess = (feedObject) => {
    if (onSuccess) {
      onSuccess(feedObject);
    } else {
      enqueueSnackbar(<FormattedMessage id="ui.inlineComposerWidget.success" defaultMessage="ui.inlineComposerWidget.success" />, {
        variant: 'success',
        autoHideDuration: 3000
      });
    }
    setOpen(false);
  };

  if (!UserUtils.isStaff(scUserContext.user) && onlyStaffEnabled) {
    return <HiddenPlaceholder />;
  }

  return (
    <React.Fragment>
      <Root className={classes.root} {...rest}>
        <CardContent className={classes.content}>
          <Box className={classes.input}>
            <Button variant="text" disableFocusRipple disableRipple disableElevation onClick={handleOpen} fullWidth color="inherit">
              {label ?? <FormattedMessage id="ui.inlineComposerWidget.label" defaultMessage="ui.inlineComposerWidget.label" />}
            </Button>
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
      {open && (
        <Composer
          open={open}
          mediaObjectTypes={mediaObjectTypes}
          defaultValue={defaultValue}
          fullWidth
          onClose={handleClose}
          onSuccess={handleSuccess}
          feedType={feedType}
        />
      )}
    </React.Fragment>
  );
}
