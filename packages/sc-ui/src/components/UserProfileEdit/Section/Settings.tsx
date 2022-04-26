import React, {ChangeEvent, useEffect, useState} from 'react';
import {styled} from '@mui/material/styles';
import {Box, FormControl, FormControlLabel, FormLabel, Radio, RadioGroup, Typography} from '@mui/material';
import {FormattedMessage} from 'react-intl';
import {Endpoints, http, SCUserContextType, SCUserSettingsType, useSCUser} from '@selfcommunity/core';
import {DEFAULT_FIELDS} from '../../../constants/UserProfile';
import classNames from 'classnames';
import {AxiosResponse} from 'axios';
import SettingsSkeleton from './SettingsSkeleton';
import {useSnackbar} from 'notistack';
import useThemeProps from '@mui/material/styles/useThemeProps';

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
  const {id = null, className = null, fields = [...DEFAULT_FIELDS], ...rest} = props;

  // CONTEXT
  const scUserContext: SCUserContextType = useSCUser();

  // STATE
  const [settings, setSetting] = useState<SCUserSettingsType>(null);

  // HOOKS
  const {enqueueSnackbar} = useSnackbar();

  // EFFECTS
  useEffect(() => {
    if (scUserContext.user) {
      http
        .request({
          url: Endpoints.UserSettings.url({id: scUserContext.user.id}),
          method: Endpoints.UserSettings.method
        })
        .then((res: AxiosResponse<SCUserSettingsType>) => {
          setSetting(res.data);
        })
        .catch((error) => {
          console.log(error);
        });
    }
  }, [scUserContext.user]);

  // HANDLERS

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    setSetting({...settings, [event.target.name]: event.target.value});
    http
      .request({
        url: Endpoints.UserSettingsPatch.url({id: scUserContext.user.id}),
        method: Endpoints.UserSettingsPatch.method,
        data: {[event.target.name]: parseInt(event.target.value, 10)}
      })
      .then((res: AxiosResponse<SCUserSettingsType>) => {
        setSetting(res.data);
        enqueueSnackbar(<FormattedMessage id="ui.userProfileEditSettings.saved" defaultMessage="ui.userProfileEditSettings.saved" />, {
          variant: 'success',
          autoHideDuration: 3000
        });
      })
      .catch((error) => {
        console.log(error);
      });
  };

  if (!scUserContext.user) {
    return null;
  }

  if (settings === null) {
    return <SettingsSkeleton />;
  }

  return (
    <Root id={id} className={classNames(classes.root, className)} {...rest}>
      <Typography gutterBottom variant="body1">
        <FormattedMessage id="ui.userProfileEditSettings.notification.title" defaultMessage="ui.userProfileEditSettings.notification.title" />
      </Typography>
      <Box className={classes.control}>
        <FormControl>
          <FormLabel>
            <FormattedMessage id="ui.userProfileEditSettings.notification.label" defaultMessage="ui.userProfileEditSettings.notification.label" />
          </FormLabel>
          <RadioGroup
            aria-labelledby="notification settings"
            value={settings.show_toast_notifications}
            name="show_toast_notifications"
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
        <FormControl>
          <FormLabel>
            <FormattedMessage
              id="ui.userProfileEditSettings.notificationSound.label"
              defaultMessage="ui.userProfileEditSettings.notificationSound.label"
            />
          </FormLabel>
          <RadioGroup
            aria-labelledby="notification sound settings"
            value={settings.toast_notifications_emit_sound}
            name="toast_notifications_emit_sound"
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
      </Box>
      <Typography gutterBottom variant="body1">
        <FormattedMessage id="ui.userProfileEditSettings.interaction.title" defaultMessage="ui.userProfileEditSettings.interaction.title" />
      </Typography>
      <Box className={classes.control}>
        <FormControl>
          <FormLabel>
            <FormattedMessage id="ui.userProfileEditSettings.interaction.label" defaultMessage="ui.userProfileEditSettings.interaction.label" />
          </FormLabel>
          <RadioGroup aria-labelledby="email notification settings" value={settings.qa_frequency} name="qa_frequency" onChange={handleChange}>
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
                <FormattedMessage id="ui.userProfileEditSettings.interaction.daily" defaultMessage="ui.userProfileEditSettings.interaction.daily" />
              }
            />
            <FormControlLabel
              value={0}
              control={<Radio size="small" />}
              label={
                <FormattedMessage id="ui.userProfileEditSettings.interaction.never" defaultMessage="ui.userProfileEditSettings.interaction.never" />
              }
            />
          </RadioGroup>
        </FormControl>
      </Box>
      <Typography gutterBottom variant="body1">
        <FormattedMessage id="ui.userProfileEditSettings.privateMessage.title" defaultMessage="ui.userProfileEditSettings.privateMessage.title" />
      </Typography>
      <Box className={classes.control}>
        <FormControl>
          <FormLabel>
            <FormattedMessage id="ui.userProfileEditSettings.privateMessage.label" defaultMessage="ui.userProfileEditSettings.privateMessage.label" />
          </FormLabel>
          <RadioGroup
            aria-labelledby="email notification settings"
            value={settings.email_notification_not_qa}
            name="email_notification_not_qa"
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
    </Root>
  );
}
