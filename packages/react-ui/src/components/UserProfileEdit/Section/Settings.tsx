import React, {ChangeEvent, useEffect, useState} from 'react';
import {styled} from '@mui/material/styles';
import {Box, FormControl, FormControlLabel, FormLabel, Radio, RadioGroup, Typography} from '@mui/material';
import {FormattedMessage} from 'react-intl';
import {SCNotification, SCUserContextType, useSCUser} from '@selfcommunity/react-core';
import {SCUserSettingsType} from '@selfcommunity/types';
import classNames from 'classnames';
import SettingsSkeleton from './SettingsSkeleton';
import {useSnackbar} from 'notistack';
import {useThemeProps} from '@mui/system';
import {DEFAULT_SETTINGS} from '../../../constants/UserProfile';
import {SCUserProfileSettings} from '../../../types';

const PREFIX = 'SCUserProfileEditSectionSettings';

const classes = {
  root: `${PREFIX}-root`,
  control: `${PREFIX}-control`
};

const Root = styled(Box, {
  name: PREFIX,
  slot: 'Root',
  overridesResolver: (props, styles) => styles.root
})(({theme}) => ({
  [`& .${classes.control}`]: {
    margin: theme.spacing(0, 0, 2, 0),
    ['& .MuiFormControl-root']: {
      display: 'block'
    }
  }
}));

export interface SettingsProps {
  /**
   * Id of user object
   * @default null
   */
  id?: string;

  /**
   * Overrides or extends the styles applied to the component.
   * @default null
   */
  className?: string;

  /**
   * Settings to display in the profile
   * @default [notification, interaction, private_message]
   */
  settings?: SCUserProfileSettings[];

  /**
   * Callback on edit data with success
   */
  onEditSuccess?: () => void;

  /**
   * Any other properties
   */
  [p: string]: any;
}

export default function Settings(inProps: SettingsProps): JSX.Element {
  // PROPS
  const props: SettingsProps = useThemeProps({
    props: inProps,
    name: PREFIX
  });
  const {id = null, className = null, settings = [...DEFAULT_SETTINGS], onEditSuccess = null, ...rest} = props;

  // CONTEXT
  const scUserContext: SCUserContextType = useSCUser();

  // STATE
  const [_settings, setSetting] = useState<SCUserSettingsType>(null);

  // HOOKS
  const {enqueueSnackbar} = useSnackbar();

  // EFFECTS
  useEffect(() => {
    if (scUserContext.user) {
      setSetting(scUserContext.managers.settings.all());
    }
  }, [scUserContext.user, scUserContext.managers.settings.all]);

  // HANDLERS

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    scUserContext.managers.settings
      .update(event.target.name, parseInt(event.target.value, 10))
      .then((res: SCUserSettingsType) => {
        setSetting(res);
        if (onEditSuccess) {
          onEditSuccess();
        } else {
          enqueueSnackbar(<FormattedMessage id="ui.userProfileEditSettings.saved" defaultMessage="ui.userProfileEditSettings.saved" />, {
            variant: 'success',
            autoHideDuration: 3000
          });
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };

  // RENDER
  if (!scUserContext.user) {
    return null;
  }

  if (_settings === null) {
    return <SettingsSkeleton />;
  }

  const renderSetting = (setting: SCUserProfileSettings) => {
    switch (setting) {
      case SCUserProfileSettings.NOTIFICATION:
        return (
          <React.Fragment key={setting}>
            <Typography gutterBottom variant="body1">
              <FormattedMessage id="ui.userProfileEditSettings.notification.title" defaultMessage="ui.userProfileEditSettings.notification.title" />
            </Typography>
            <Box className={classes.control}>
              <FormControl>
                <FormLabel>
                  <FormattedMessage
                    id="ui.userProfileEditSettings.notification.label"
                    defaultMessage="ui.userProfileEditSettings.notification.label"
                  />
                </FormLabel>
                <RadioGroup
                  aria-labelledby="notification settings"
                  value={_settings.show_toast_notifications}
                  name={SCNotification.NOTIFICATIONS_SETTINGS_SHOW_TOAST}
                  onChange={handleChange}>
                  <FormControlLabel
                    value={1}
                    control={<Radio size="small" />}
                    label={<FormattedMessage id="ui.common.yes" defaultMessage="ui.common.yes" />}
                  />
                  <FormControlLabel
                    value={0}
                    control={<Radio size="small" />}
                    label={<FormattedMessage id="ui.common.no" defaultMessage="ui.common.no" />}
                  />
                </RadioGroup>
              </FormControl>
              {/*
        <FormControl>
          <FormLabel>
            <FormattedMessage
              id="ui.userProfileEditSettings.notificationSound.label"
              defaultMessage="ui.userProfileEditSettings.notificationSound.label"
            />
          </FormLabel>
          <RadioGroup
            aria-labelledby="notification sound settings"
            value={_settings.toast_notifications_emit_sound}
            name={SCNotification.NOTIFICATIONS_SETTINGS_TOAST_EMIT_SOUND}
            onChange={handleChange}>
            <FormControlLabel
              value={1}
              control={<Radio size="small" />}
              label={<FormattedMessage id="ui.common.yes" defaultMessage="ui.common.yes" />}
            />
            <FormControlLabel
              value={0}
              control={<Radio size="small" />}
              label={<FormattedMessage id="ui.common.no" defaultMessage="ui.common.no" />}
            />
          </RadioGroup>
        </FormControl>
        */}
            </Box>
          </React.Fragment>
        );
      case SCUserProfileSettings.INTERACTION:
        return (
          <React.Fragment key={setting}>
            <Typography gutterBottom variant="body1">
              <FormattedMessage id="ui.userProfileEditSettings.interaction.title" defaultMessage="ui.userProfileEditSettings.interaction.title" />
            </Typography>
            <Box className={classes.control}>
              <FormControl>
                <FormLabel>
                  <FormattedMessage id="ui.userProfileEditSettings.interaction.label" defaultMessage="ui.userProfileEditSettings.interaction.label" />
                </FormLabel>
                <RadioGroup
                  aria-labelledby="email notification settings"
                  value={_settings.qa_frequency}
                  name={SCNotification.NOTIFICATIONS_SETTINGS_QA_FREQUENCY}
                  onChange={handleChange}>
                  <FormControlLabel
                    value={-1}
                    control={<Radio size="small" />}
                    label={
                      <FormattedMessage
                        id="ui.userProfileEditSettings.interaction.immediatly"
                        defaultMessage="ui.userProfileEditSettings.interaction.immediatly"
                      />
                    }
                  />
                  <FormControlLabel
                    value={1}
                    control={<Radio size="small" />}
                    label={
                      <FormattedMessage
                        id="ui.userProfileEditSettings.interaction.daily"
                        defaultMessage="ui.userProfileEditSettings.interaction.daily"
                      />
                    }
                  />
                  <FormControlLabel
                    value={0}
                    control={<Radio size="small" />}
                    label={
                      <FormattedMessage
                        id="ui.userProfileEditSettings.interaction.never"
                        defaultMessage="ui.userProfileEditSettings.interaction.never"
                      />
                    }
                  />
                </RadioGroup>
              </FormControl>
            </Box>
          </React.Fragment>
        );
      case SCUserProfileSettings.PRIVATE_MESSAGE:
        return (
          <React.Fragment key={setting}>
            <Typography gutterBottom variant="body1">
              <FormattedMessage
                id="ui.userProfileEditSettings.privateMessage.title"
                defaultMessage="ui.userProfileEditSettings.privateMessage.title"
              />
            </Typography>
            <Box className={classes.control}>
              <FormControl>
                <FormLabel>
                  <FormattedMessage
                    id="ui.userProfileEditSettings.privateMessage.label"
                    defaultMessage="ui.userProfileEditSettings.privateMessage.label"
                  />
                </FormLabel>
                <RadioGroup
                  aria-labelledby="email notification settings"
                  value={_settings.email_notification_not_qa}
                  name={SCNotification.NOTIFICATIONS_SETTINGS_EMAIL_NOT_QA}
                  onChange={handleChange}>
                  <FormControlLabel
                    value={1}
                    control={<Radio size="small" />}
                    label={
                      <FormattedMessage
                        id="ui.userProfileEditSettings.privateMessage.email"
                        defaultMessage="ui.userProfileEditSettings.privateMessage.email"
                      />
                    }
                  />
                  <FormControlLabel
                    value={0}
                    control={<Radio size="small" />}
                    label={
                      <FormattedMessage
                        id="ui.userProfileEditSettings.privateMessage.frontend"
                        defaultMessage="ui.userProfileEditSettings.privateMessage.frontend"
                      />
                    }
                  />
                </RadioGroup>
              </FormControl>
            </Box>
          </React.Fragment>
        );
      default:
        return null;
    }
  };

  return (
    <Root id={id} className={classNames(classes.root, className)} {...rest}>
      {settings.map((setting) => renderSetting(setting))}
    </Root>
  );
}
