import {Box, BoxProps, FormControl, Icon, InputLabel, MenuItem, Select, Stack, Switch, Typography} from '@mui/material';
import {styled} from '@mui/material/styles';
import {useThemeProps} from '@mui/system';
import {SCLiveStreamViewType} from '@selfcommunity/types';
import classNames from 'classnames';
import React from 'react';
import {FormattedMessage} from 'react-intl';

export const PREFIX = 'SCLiveStreamFormSettings';

const classes = {
  root: `${PREFIX}-root`,
  switch: `${PREFIX}-switch`,
  switchLabel: `${PREFIX}-switch-Label`,
  accessView: `${PREFIX}-access-view`,
  accessViewIcon: `${PREFIX}-access-view-icon`
};

const Root = styled(Box, {
  name: PREFIX,
  slot: 'Root'
})(({theme}) => ({}));

export interface LiveStreamFormSettingsProps extends BoxProps {
  /**
   * Overrides or extends the styles applied to the component.
   * @default null
   */
  className?: string;

  /**
   * Event Object
   * @default null
   */
  settings?: Record<string, any>;

  /**
   * onChange callback
   * @param data
   */
  onChange?: (data) => void;

  /**
   * Any other properties
   */
  [p: string]: any;
}

/**
 *> API documentation for the Community-JS LiveStreamSettingsForm component. Learn about the available props and the CSS API.
 *
 #### Import
 ```jsx
 import {LiveStreamSettingsForm} from '@selfcommunity/react-ui';
 ```

 #### Component Name
 The name `LiveStreamSettingsForm` can be used when providing style overrides in the theme.

 #### CSS

 |Rule Name|Global class|Description|
 |---|---|---|
 |root|.SCLiveStreamForm-root|Styles applied to the root element.|
 |switch|.SCLiveStreamForm-switch|Styles applied to the switch element.|
 |switchLabel|.SCLiveStreamForm-switch-label|Styles applied to the switchLabel element.|
 |accessView|.SCLiveStreamForm-access-view|Styles applied to the access view.|

 * @param inProps
 */
export default function LiveStreamSettingsForm(inProps: LiveStreamFormSettingsProps): JSX.Element {
  //PROPS
  const props: LiveStreamFormSettingsProps = useThemeProps({
    props: inProps,
    name: PREFIX
  });
  const {className, settings = {}, onChange, ...rest} = props;

  /**
   * Renders root object
   */
  return (
    <Root className={classNames(classes.root, className)} {...rest}>
      <Stack direction="row" spacing={1} alignItems="center">
        <Switch
          className={classes.switch}
          checked={Boolean(settings?.muteParticipant)}
          onChange={() => onChange({...settings, ...{['muteParticipant']: !settings?.muteParticipant}})}
        />
        <Typography className={classes.switchLabel}>
          <FormattedMessage id="ui.liveStreamForm.muteParticipant" defaultMessage="ui.liveStreamForm.muteParticipant" />
        </Typography>
      </Stack>
      <Stack direction="row" spacing={1} alignItems="center">
        <Switch
          className={classes.switch}
          checked={Boolean(settings?.hideParticipantList)}
          onChange={() => onChange({...settings, ...{['hideParticipantList']: !settings?.hideParticipantList}})}
        />
        <Typography className={classes.switchLabel}>
          <FormattedMessage id="ui.liveStreamForm.hideParticipantList" defaultMessage="ui.liveStreamForm.hideParticipantList" />
        </Typography>
      </Stack>
      <Stack direction="row" spacing={1} alignItems="center">
        <Switch
          className={classes.switch}
          checked={Boolean(settings?.automaticallyNotifyFollowers)}
          onChange={() => onChange({...settings, ...{['automaticallyNotifyFollowers']: !settings?.automaticallyNotifyFollowers}})}
        />
        <Typography className={classes.switchLabel}>
          <FormattedMessage id="ui.liveStreamForm.automaticallyNotifyFollowers" defaultMessage="ui.liveStreamForm.automaticallyNotifyFollowers" />
        </Typography>
      </Stack>
      <Stack direction="row" spacing={1} alignItems="center">
        <Switch
          className={classes.switch}
          checked={Boolean(settings?.disableVideo)}
          onChange={() => onChange({...settings, ...{['disableVideo']: !settings?.disableVideo}})}
        />
        <Typography className={classes.switchLabel}>
          <FormattedMessage id="ui.liveStreamForm.disableVideo" defaultMessage="ui.liveStreamForm.disableVideo" />
        </Typography>
      </Stack>
      <Stack direction="row" spacing={1} alignItems="center">
        <Switch
          className={classes.switch}
          checked={Boolean(settings?.disableChat)}
          onChange={() => onChange({...settings, ...{['disableChat']: !settings?.disableChat}})}
        />
        <Typography className={classes.switchLabel}>
          <FormattedMessage id="ui.liveStreamForm.disableChat" defaultMessage="ui.liveStreamForm.disableChat" />
        </Typography>
      </Stack>
      <FormControl className={classes.accessView}>
        <InputLabel id="viewLabel">
          <FormattedMessage id="ui.liveStreamForm.view.label" defaultMessage="ui.liveStreamForm.view.label" />
        </InputLabel>
        <Select
          name="view"
          label={<FormattedMessage id="ui.liveStreamForm.view.label" defaultMessage="ui.liveStreamForm.view.label" />}
          labelId="viewLabel"
          fullWidth
          value={settings?.view ?? SCLiveStreamViewType.SPEAKER}
          onChange={(e) => onChange({...settings, ...{['view']: e.target.value}})}
          displayEmpty
          renderValue={(selected) => {
            return (
              <>
                <Icon className={classes.accessViewIcon}>{selected === SCLiveStreamViewType.SPEAKER ? 'upload' : 'category'}</Icon>&nbsp;
                <FormattedMessage id={`ui.liveStreamForm.view.${selected}`} defaultMessage={`ui.liveStreamForm.view.${selected}`} />
              </>
            );
          }}>
          {Object.values(SCLiveStreamViewType).map((f) => (
            <MenuItem value={f} key={f}>
              <Box>
                <Typography variant="body1">
                  <b>
                    <Icon className={classes.accessViewIcon}>{f === SCLiveStreamViewType.SPEAKER ? 'upload' : 'category'}</Icon>&nbsp;
                    <FormattedMessage id={`ui.liveStreamForm.view.${f}`} defaultMessage={`ui.liveStreamForm.view.${f}`} />
                  </b>
                </Typography>
                <Typography>
                  <FormattedMessage id={`ui.liveStreamForm.view.${f}.description`} defaultMessage={`ui.liveStreamForm.view.${f}.description`} />
                </Typography>
              </Box>
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </Root>
  );
}