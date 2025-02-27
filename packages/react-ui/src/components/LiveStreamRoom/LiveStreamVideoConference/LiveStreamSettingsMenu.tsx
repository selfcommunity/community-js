import * as React from 'react';
import Button from '@mui/material/Button';
import Menu from '@mui/material/Menu';
import {Box, FormControlLabel, Icon, Switch, Typography} from '@mui/material';
import {styled} from '@mui/material/styles';
import {useThemeProps} from '@mui/system';
import classNames from 'classnames';
// import {useIsRecording, useMaybeLayoutContext, useRoomContext} from '@livekit/components-react';
import {Fragment, useEffect, useMemo, useState} from 'react';
import {FormattedMessage} from 'react-intl';

const PREFIX = 'SCLiveStreamSettingsMenu';

const classes = {
  root: `${PREFIX}-root`,
  menuRoot: `${PREFIX}-menu-root`
};

const Root = styled(Button, {
  name: PREFIX,
  slot: 'Root',
  overridesResolver: (props, styles) => styles.root
})(({theme}) => ({
  borderRadius: 7,
  color: theme.palette.common.white,
  paddingLeft: theme.spacing(),
  paddingRight: theme.spacing(),
  minWidth: 45
}));

const MenuRoot = styled(Menu, {
  name: PREFIX,
  slot: 'Root',
  overridesResolver: (props, styles) => styles.menuRoot
})(({theme}) => ({
  '& .MuiPaper-root': {
    minWidth: 120,
    paddingRight: theme.spacing(2),
    '& div.MuiTypography-body1': {
      paddingLeft: theme.spacing(2)
    },
    '& .MuiFormControlLabel-label.Mui-disabled': {
      color: theme.palette.text.primary
    }
  }
}));

export interface LiveStreamSettingsMenuProps {
  className?: string;
  blurEnabled?: boolean;
  handleBlur?: (event: any) => void;
  actionBlurDisabled?: boolean;
  onlyContentMenu?: boolean;
  hideRecordAction?: boolean;
}

export default function LiveStreamSettingsMenu(inProps: LiveStreamSettingsMenuProps): JSX.Element {
  // PROPS
  const props: LiveStreamSettingsMenuProps = useThemeProps({
    props: inProps,
    name: PREFIX
  });
  const {className, actionBlurDisabled = false, blurEnabled = false, handleBlur, hideRecordAction = true, onlyContentMenu = false, ...rest} = props;

  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  /*
  // Recording: https://github.com/livekit-examples/meet/blob/main/lib/SettingsMenu.tsx
  const room = useRoomContext();
  const isRecording = useIsRecording();
  const [initialRecStatus, setInitialRecStatus] = useState(isRecording);
  const [processingRecRequest, setProcessingRecRequest] = useState(false);
  const recordingEndpoint = process.env.NEXT_PUBLIC_LK_RECORD_ENDPOINT;
   */

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  /* useEffect(() => {
		if (initialRecStatus !== isRecording) {
			setProcessingRecRequest(false);
		}
	}, [isRecording, initialRecStatus]);

  const toggleRoomRecording = async () => {
    /* if (!recordingEndpoint) {
			throw TypeError('No recording endpoint specified');
		}
		if (room.isE2EEEnabled) {
			throw Error('Recording of encrypted meetings is currently not supported');
		}
		setProcessingRecRequest(true);
		setInitialRecStatus(isRecording);
		let response: Response;
		if (isRecording) {
			response = await fetch(recordingEndpoint + `/stop?roomName=${room.name}`);
		} else {
			response = await fetch(recordingEndpoint + `/start?roomName=${room.name}`);
		}
		if (response.ok) {
		} else {
			console.error('Error handling recording request, check server logs:', response.status, response.statusText);
			setProcessingRecRequest(false);
		}
  };
	*/

  const MenuContent = useMemo(
    () => (
      <Box>
        <Typography variant="body1" component="div">
          <b>
            <FormattedMessage id="ui.liveStreamRoom.settingsMenu.visualEffect" defaultMessage="ui.liveStreamRoom.settingsMenu.visualEffect" />
          </b>
        </Typography>
        <FormControlLabel
          labelPlacement="start"
          control={<Switch checked={blurEnabled} disabled={actionBlurDisabled} onChange={handleBlur} inputProps={{'aria-label': 'controlled'}} />}
          label={
            <FormattedMessage
              id="ui.liveStreamRoom.settingsMenu.visualEffect.blurEffect"
              defaultMessage="ui.liveStreamRoom.settingsMenu.visualEffect.blurEffect"
            />
          }
        />
        {/* !hideRecordAction && (
          <>
          	<Divider />
            <Typography variant="body1" component="div">
              <b>
                <FormattedMessage id="ui.liveStreamRoom.settingsMenu.recordMeeting" defaultMessage="ui.liveStreamRoom.settingsMenu.recordMeeting" />
              </b>
            </Typography>
            <section>
              <p>{isRecording ? <FormattedMessage id="ui.liveStreamRoom.settingsMenu.currentlyBeingRecorded" defaultMessage="ui.liveStreamRoom.settingsMenu.currentlyBeingRecorded" /> : <FormattedMessage id="ui.liveStreamRoom.settingsMenu.noActiveRecording" defaultMessage="ui.liveStreamRoom.settingsMenu.noActiveRecording" />}</p>
              <button disabled={processingRecRequest} onClick={() => toggleRoomRecording()}>
                {isRecording ? <FormattedMessage id="ui.liveStreamRoom.settingsMenu.stopRecording" defaultMessage="ui.liveStreamRoom.settingsMenu.stopRecording" /> : <FormattedMessage id="ui.liveStreamRoom.settingsMenu.startRecording" defaultMessage="ui.liveStreamRoom.settingsMenu.startRecording" />}
              </button>
            </section>
          </>
        ) */}
      </Box>
    ),
    [blurEnabled, actionBlurDisabled, handleBlur]
  );

  if (onlyContentMenu) {
    return MenuContent;
  }

  return (
    <Fragment>
      <Root
        className={classNames(className, classes.root, 'lk-button')}
        aria-controls={open ? 'live-stream-settings-menu' : undefined}
        aria-haspopup="true"
        aria-expanded={open ? 'true' : undefined}
        onClick={handleClick}
        {...rest}>
        <Icon>more_vert</Icon>
      </Root>
      <MenuRoot
        id="live-stream-settings-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        MenuListProps={{
          'aria-labelledby': 'basic-button'
        }}>
        {MenuContent}
      </MenuRoot>
    </Fragment>
  );
}
