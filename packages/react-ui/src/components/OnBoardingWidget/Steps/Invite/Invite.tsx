import React, {useContext, useMemo} from 'react';
import {styled} from '@mui/material/styles';
import Box from '@mui/material/Box';
import {useThemeProps} from '@mui/system';
import classNames from 'classnames';
import {PREFIX} from '../../constants';
import {Button, Icon, IconButton, Typography} from '@mui/material';
import {FormattedMessage} from 'react-intl';
import {SCPreferences, SCPreferencesContext, SCPreferencesContextType} from '@selfcommunity/react-core';
import {FACEBOOK_SHARE, LINKEDIN_SHARE, X_SHARE} from '../../../../constants/SocialShare';
import {Endpoints, http, HttpResponse} from '@selfcommunity/api-services';

const classes = {
  root: `${PREFIX}-invite-root`,
  title: `${PREFIX}-invite-title`,
  social: `${PREFIX}-invite-social`,
  email: `${PREFIX}-invite-email`,
  iconContainer: `${PREFIX}-invite-social-icon-container`,
  icon: `${PREFIX}-invite-social-icon`,
  action: `${PREFIX}-invite-action`
};

export interface InviteProps {
  /**
   * Overrides or extends the styles applied to the component.
   * @default null
   */
  className?: string;
  /**
   * Callback triggered on complete action click
   * @default null
   */
  onCompleteAction: () => void;
}

const Root = styled(Box, {
  name: PREFIX,
  slot: 'InviteRoot'
})(() => ({}));

export default function Invite(inProps: InviteProps) {
  // PROPS
  const props: InviteProps = useThemeProps({
    props: inProps,
    name: PREFIX
  });
  const {className, onCompleteAction = null} = props;
  // CONTEXT
  const scPreferencesContext: SCPreferencesContextType = useContext(SCPreferencesContext);
  const url = useMemo(
    () =>
      scPreferencesContext.preferences &&
      SCPreferences.CONFIGURATIONS_GROUPS_ENABLED in scPreferencesContext.preferences &&
      scPreferencesContext.preferences[SCPreferences.CONFIGURATIONS_APP_URL].value,
    [scPreferencesContext.preferences]
  );

  // HANDLERS
  const handleShare = (shareUrl, shareType) => {
    window.open(shareUrl, `${shareType}-share-dialog`, 'width=626,height=436');
    onCompleteAction();
  };

  /**
   * Fetches platform url
   */
  function fetchPlatform(query: string) {
    http
      .request({
        url: Endpoints.Platform.url(),
        method: Endpoints.Platform.method,
        params: {
          next: query
        }
      })
      .then((res: HttpResponse<any>) => {
        const platformUrl = res.data.platform_url;
        window.open(platformUrl, '_blank').focus();
      })
      .catch((error) => {
        console.log(error);
      });
  }

  const handleCompleteAction = () => {
    onCompleteAction();
    fetchPlatform('/marketing/invitation');
  };

  return (
    <Root className={classNames(classes.root, className)}>
      <Typography variant="h4" className={classes.title}>
        <FormattedMessage id="ui.onBoardingWidget.invite" defaultMessage="ui.onBoardingWidget.invite" />
      </Typography>
      <Box className={classes.social}>
        <Typography className={classes.title} variant="h4">
          <FormattedMessage id="ui.onBoardingWidget.step.invite.social.title" defaultMessage="ui.onBoardingWidget.step.invite.social.title" />
        </Typography>
        <Typography variant="subtitle1">
          <FormattedMessage id="ui.onBoardingWidget.step.invite.social.subtitle" defaultMessage="ui.onBoardingWidget.step.invite.social.subtitle" />
        </Typography>
        <Box className={classes.iconContainer}>
          <IconButton onClick={() => handleShare(FACEBOOK_SHARE + url, 'facebook')} disabled={!url}>
            <Icon classes={{root: classes.icon}}>facebook</Icon>
          </IconButton>
          <IconButton onClick={() => handleShare(X_SHARE + url, 'x')} disabled={!url}>
            <Icon classes={{root: classes.icon}}>twitter</Icon>
          </IconButton>
          <IconButton onClick={() => handleShare(LINKEDIN_SHARE + url, 'linkedin')} disabled={!url}>
            <Icon classes={{root: classes.icon}}>linkedin</Icon>
          </IconButton>
        </Box>
      </Box>
      <Box className={classes.email}>
        <Typography className={classes.title} variant="h4">
          <FormattedMessage id="ui.onBoardingWidget.step.invite.email.title" defaultMessage="ui.onBoardingWidget.step.invite.email.title" />
        </Typography>
        <Typography variant="subtitle1">
          <FormattedMessage id="ui.onBoardingWidget.step.invite.email.subtitle" defaultMessage="ui.onBoardingWidget.step.invite.email.subtitle" />
        </Typography>
      </Box>
      <Box component="span" className={classes.action}>
        <Button variant="outlined" size="small" onClick={handleCompleteAction}>
          <FormattedMessage defaultMessage="ui.onBoardingWidget.step.invite.button" id="ui.onBoardingWidget.step.invite.button" />
        </Button>
      </Box>
    </Root>
  );
}
