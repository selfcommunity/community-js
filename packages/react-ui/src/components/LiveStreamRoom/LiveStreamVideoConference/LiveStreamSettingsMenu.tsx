import * as React from 'react';
import Button from '@mui/material/Button';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import {Box, FormControlLabel, Icon, ListItemIcon, ListItemText, MenuList, Switch, Typography} from '@mui/material';
import {styled} from '@mui/material/styles';
import {useThemeProps} from '@mui/system';
import classNames from 'classnames';
import {Fragment, useMemo} from 'react';
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
}

export default function LiveStreamSettingsMenu(inProps: LiveStreamSettingsMenuProps): JSX.Element {
  // PROPS
  const props: LiveStreamSettingsMenuProps = useThemeProps({
    props: inProps,
    name: PREFIX
  });
  const {className, actionBlurDisabled = false, blurEnabled = false, handleBlur, onlyContentMenu = false, ...rest} = props;

  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const MenuContent = useMemo(
    () => (
      <Box>
        <Typography variant="body1" component="div">
          <b><FormattedMessage id="ui.liveStreamRoom.settingsMenu.visualEffect" defaultMessage="ui.liveStreamRoom.settingsMenu.visualEffect" /></b>
        </Typography>
        <FormControlLabel
          labelPlacement="start"
          control={<Switch checked={blurEnabled} disabled={actionBlurDisabled} onChange={handleBlur} inputProps={{'aria-label': 'controlled'}} />}
          label={<FormattedMessage id="ui.liveStreamRoom.settingsMenu.visualEffect.blurEffect" defaultMessage="ui.liveStreamRoom.settingsMenu.visualEffect.blurEffect" />}
        />
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
