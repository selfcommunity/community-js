import React, {useContext} from 'react';
import {styled} from '@mui/material/styles';
import Box from '@mui/material/Box';
import {useThemeProps} from '@mui/system';
import classNames from 'classnames';
import {PREFIX} from '../../constants';
import {Button, Icon, IconButton, Typography} from '@mui/material';
import {FormattedMessage} from 'react-intl';
import {Link, SCContextType, SCPreferences, SCPreferencesContext, SCPreferencesContextType, useSCContext} from '@selfcommunity/react-core';
import {FACEBOOK_SHARE, LINKEDIN_SHARE, X_SHARE} from '../../../../constants/SocialShare';
import {SCOnBoardingStepStatusType, SCStepType} from '@selfcommunity/types';
import {MAKE_MARKETING_PROD, MAKE_MARKETING_STAGE} from '../../../PlatformWidget/constants';

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
   * The category step
   */
  step: SCStepType;
  /**
   * Overrides or extends the styles applied to the component.
   * @default null
   */
  className?: string;
  /**
   * Callback triggered on complete action click
   * @default null
   */
  onCompleteAction: (id: number) => void;
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
  const {className, step, onCompleteAction} = props;
  // CONTEXT
  const scContext: SCContextType = useSCContext();
  const scPreferencesContext: SCPreferencesContextType = useContext(SCPreferencesContext);
  const facebookShareEnabled =
    SCPreferences.ADDONS_SHARE_POST_ON_FACEBOOK_ENABLED in scPreferencesContext.preferences &&
    scPreferencesContext.preferences[SCPreferences.ADDONS_SHARE_POST_ON_FACEBOOK_ENABLED].value;
  const xShareEnabled =
    SCPreferences.ADDONS_SHARE_POST_ON_TWITTER_ENABLED in scPreferencesContext.preferences &&
    scPreferencesContext.preferences[SCPreferences.ADDONS_SHARE_POST_ON_TWITTER_ENABLED].value;
  const linkedinShareEnabled =
    SCPreferences.ADDONS_SHARE_POST_ON_LINKEDIN_ENABLED in scPreferencesContext.preferences &&
    scPreferencesContext.preferences[SCPreferences.ADDONS_SHARE_POST_ON_LINKEDIN_ENABLED].value;
  const url = scContext.settings.portal;
  const isStage = scContext.settings.portal.includes('stage');

  // HANDLERS
  const handleCompleteAction = () => {
    if (step?.status !== SCOnBoardingStepStatusType.COMPLETED && step?.status !== SCOnBoardingStepStatusType.IN_PROGRESS) {
      onCompleteAction(step.id);
    }
  };

  const handleShare = (shareUrl, shareType) => {
    window.open(shareUrl, `${shareType}-share-dialog`, 'width=626,height=436');
    handleCompleteAction();
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
          {facebookShareEnabled && (
            <IconButton onClick={() => handleShare(FACEBOOK_SHARE + url, 'facebook')}>
              <Icon classes={{root: classes.icon}}>facebook</Icon>
            </IconButton>
          )}
          {xShareEnabled && (
            <IconButton onClick={() => handleShare(X_SHARE + url, 'x')}>
              <Icon classes={{root: classes.icon}}>twitter</Icon>
            </IconButton>
          )}
          {linkedinShareEnabled && (
            <IconButton onClick={() => handleShare(LINKEDIN_SHARE + url, 'linkedin')}>
              <Icon classes={{root: classes.icon}}>linkedin</Icon>
            </IconButton>
          )}
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
        <Button
          variant="outlined"
          size="small"
          component={Link}
          to={isStage ? MAKE_MARKETING_STAGE : MAKE_MARKETING_PROD}
          target="_blank"
          onClick={handleCompleteAction}>
          <FormattedMessage defaultMessage="ui.onBoardingWidget.step.invite.button" id="ui.onBoardingWidget.step.invite.button" />
        </Button>
      </Box>
    </Root>
  );
}
