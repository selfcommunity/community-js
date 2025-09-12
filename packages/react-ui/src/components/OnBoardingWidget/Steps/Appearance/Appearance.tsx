import React, {useCallback, useEffect, useRef, useState} from 'react';
import {useThemeProps} from '@mui/system';
import classNames from 'classnames';
import {Preferences} from '@selfcommunity/react-core';
import {PREFIX} from '../../constants';
import {Button, Drawer, IconButton, Tab, Tabs, TextField, Typography, Box, styled, Icon} from '@mui/material';
import {MuiColorInput} from 'mui-color-input';
import {PreferenceService, SCPaginatedResponse} from '@selfcommunity/api-services';
import {SCPreferenceSection, SCPreferenceType} from '@selfcommunity/types';
import {formatColorLabel, formatLogoLabel} from '../../../../utils/onBoarding';
import {defineMessages, FormattedMessage, useIntl} from 'react-intl';
import {SCOPE_SC_UI} from '../../../../constants/Errors';
import {Logger} from '@selfcommunity/utils';
import {LoadingButton} from '@mui/lab';
import ScrollContainer from '../../../../shared/ScrollContainer';

const messages = defineMessages({
  titleField: {
    id: 'ui.onBoardingWidget.step.appearance.titleSlogan.field.title',
    defaultMessage: 'ui.onBoardingWidget.step.appearance.titleSlogan.field.title'
  },
  sloganField: {
    id: 'ui.onBoardingWidget.step.appearance.titleSlogan.field.slogan',
    defaultMessage: 'ui.onBoardingWidget.step.appearance.titleSlogan.field.slogan'
  }
});

const classes = {
  root: `${PREFIX}-appearance-root`,
  title: `${PREFIX}-appearance-title`,
  summary: `${PREFIX}-appearance-summary`,
  colorContainer: `${PREFIX}-appearance-color-container`,
  color: `${PREFIX}-appearance-color`,
  colorProgress: `${PREFIX}-appearance-color-progress`,
  logoContainer: `${PREFIX}-appearance-logo-container`,
  logo: `${PREFIX}-appearance-logo`,
  uploadButton: `${PREFIX}-appearance-upload-button`,
  drawerRoot: `${PREFIX}-appearance-drawer-root`,
  drawerHeader: `${PREFIX}-appearance-drawer-header`,
  drawerHeaderAction: `${PREFIX}-appearance-drawer-header-action`,
  drawerContent: `${PREFIX}-appearance-drawer-content`
};
enum AppearanceTabType {
  COLOR = 'color',
  LOGO = 'logo',
  SLOGAN = 'slogan'
}

export interface AppearanceProps {
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
  slot: 'AppearanceRoot'
})(() => ({}));

const DrawerRoot = styled(Drawer, {
  name: PREFIX,
  slot: 'AppearanceDrawerRoot',
  overridesResolver: (props, styles) => styles.appearanceDrawerRoot
})(({theme}) => ({}));

export default function Appearance(inProps: AppearanceProps) {
  // PROPS
  const props: AppearanceProps = useThemeProps({
    props: inProps,
    name: PREFIX
  });
  const {className, onCompleteAction} = props;

  // STATE
  const [preferences, setPreferences] = useState<SCPreferenceType[]>([]);
  const [data, setData] = useState<any>({});
  const [loading, setLoading] = useState<boolean>(true);
  const [loadingLogo, setLoadingLogo] = useState<string>('');
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [tab, setTab] = useState(AppearanceTabType.COLOR);
  const [updating, setUpdating] = useState<boolean>(false);
  const colorRef = useRef(null);

  // INTL
  const intl = useIntl();

  // HANDLERS
  const handleTabChange = (event, newValue) => {
    setTab(newValue);
    setData({});
  };
  const handleOpen = useCallback((event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  }, []);
  const handleClose = useCallback(() => {
    setAnchorEl(null);
  }, []);

  const handleClosePopover = () => {
    if (colorRef.current) {
      colorRef.current.blur();
    }
  };

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const {name, value} = event.target;
    setPreferences((prev) => {
      return prev.map((p) => Object.assign({}, p, {value: p.name === name ? value : p.value}));
    });
    handleDataUpdate(name, value);
  };

  const handleColorChange = (newColor, name) => {
    setPreferences((prev) => {
      return prev.map((p) => Object.assign({}, p, {value: p.name === name ? newColor : p.value}));
    });
    handleDataUpdate(name, newColor);
  };

  const handleDataUpdate = (key: string, value: any) => {
    const elementInDict = preferences.filter((p: SCPreferenceType) => p.name === key && p.value === value);
    if (elementInDict.length) {
      const newData = {...data};
      delete newData[key];
      setData(newData);
    } else {
      setData((prevData: any) => ({
        ...prevData,
        [key]: value
      }));
    }
  };

  const fetchPreferences = () => {
    PreferenceService.searchPreferences(
      '',
      '',
      `${Preferences.COLORS_COLORBACK},${Preferences.COLORS_COLORPRIMARY},${Preferences.COLORS_COLORSECONDARY},${Preferences.COLORS_NAVBARBACK},${Preferences.COLORS_COLORFONT},${Preferences.COLORS_COLORFONTSECONDARY}, ${Preferences.LOGO_NAVBAR_LOGO},${Preferences.LOGO_NAVBAR_LOGO_MOBILE}, ${Preferences.TEXT_APPLICATION_SLOGAN1},${Preferences.TEXT_APPLICATION_SLOGAN2}`
    )
      .then((res: SCPaginatedResponse<SCPreferenceType>) => {
        setPreferences(res.results);
        setLoading(false);
      })
      .catch((e) => {
        Logger.error(SCOPE_SC_UI, e);
        setLoading(false);
      });
  };

  const updatePreference = async () => {
    setUpdating(true);
    try {
      await PreferenceService.updatePreferences(data);
    } catch (e) {
      Logger.error(SCOPE_SC_UI, e);
    } finally {
      setUpdating(false);
      setData({});
      onCompleteAction();
    }
  };

  const updateLogoPreference = async (name: any, file: File) => {
    setLoadingLogo(name);
    const formData = new FormData();
    formData.append(name, file);
    await PreferenceService.updatePreferences(formData)
      .then((preference: SCPreferenceType | SCPreferenceType[]) => {
        setLoadingLogo('');
        setData({});
        setPreferences((prev) => {
          // Handle both single preference and array of preferences
          if (Array.isArray(preference)) {
            // If it's an array, find the preference with the matching name
            const matchingPref = preference.find((p) => p.name === name);
            if (matchingPref) {
              return prev.map((p) => Object.assign({}, p, {value: p.name === name ? matchingPref.value : p.value}));
            }
            return prev;
          } else {
            // Original behavior for single preference
            return prev.map((p) => Object.assign({}, p, {value: p.name === name ? preference[name].value : p.value}));
          }
        });
        onCompleteAction();
      })
      .catch((e) => {
        setLoadingLogo('');
        setData({});
        Logger.error(SCOPE_SC_UI, e);
      });
  };

  /**
   * Handles logo upload
   * @param event
   * @param name
   */
  const handleUpload = (event, name) => {
    const file = event.target.files[0];
    if (file) {
      updateLogoPreference(name, file);
    }
  };

  useEffect(() => {
    fetchPreferences();
  }, []);

  return (
    <Root className={classNames(classes.root, className)}>
      <Typography variant="h4" className={classes.title} alignSelf="self-start">
        <FormattedMessage id="ui.onBoardingWidget.appearance" defaultMessage="ui.onBoardingWidget.appearance" />
      </Typography>
      <Typography className={classes.summary}>
        <FormattedMessage id="ui.onBoardingWidget.step.appearance.summary" defaultMessage="ui.onBoardingWidget.step.appearance.summary" />
      </Typography>
      <Button variant="outlined" size="small" color="primary" onClick={handleOpen}>
        <FormattedMessage id="ui.onBoardingWidget.step.appearance.button" defaultMessage="ui.onBoardingWidget.step.appearance.button" />
      </Button>
      <DrawerRoot className={classes.drawerRoot} anchor="right" open={Boolean(anchorEl)} onClose={handleClose}>
        <Box className={classes.drawerHeader}>
          <Typography variant="h4" color="primary">
            <FormattedMessage
              id="ui.onBoardingWidget.step.appearance.header.title"
              defaultMessage="ui.onBoardingWidget.step.appearance.header.title"
            />
          </Typography>
          <IconButton className={classes.drawerHeaderAction} onClick={handleClose}>
            <Icon>close</Icon>
          </IconButton>
        </Box>
        {/*<Divider />*/}
        <Tabs value={tab} onChange={handleTabChange} variant="scrollable" scrollButtons="auto" aria-label="scrollable-tabs">
          <Tab
            value={AppearanceTabType.COLOR}
            label={
              <FormattedMessage
                id="ui.onBoardingWidget.step.appearance.colors.title"
                defaultMessage="ui.onBoardingWidget.step.appearance.colors.title"
              />
            }
          />
          <Tab
            value={AppearanceTabType.LOGO}
            label={
              <FormattedMessage id="ui.onBoardingWidget.step.appearance.logo.title" defaultMessage="ui.onBoardingWidget.step.appearance.logo.title" />
            }
          />
          <Tab
            value={AppearanceTabType.SLOGAN}
            label={
              <FormattedMessage
                id="ui.onBoardingWidget.step.appearance.titleSlogan.title"
                defaultMessage="ui.onBoardingWidget.step.appearance.titleSlogan.title"
              />
            }
          />
        </Tabs>

        <ScrollContainer>
          <Box className={classes.drawerContent}>
            {tab === AppearanceTabType.COLOR && (
              <Box className={classes.colorContainer}>
                {preferences
                  .filter((item) => item.section === SCPreferenceSection.COLORS)
                  .map((color) => (
                    <React.Fragment key={color.id}>
                      <Typography variant="h6">{formatColorLabel(color)}</Typography>
                      <Box>
                        <MuiColorInput
                          inputRef={colorRef}
                          className={classes.color}
                          format="hex"
                          value={color.value}
                          onChange={(value) => handleColorChange(value, color.name)}
                          isAlphaHidden
                          PopoverProps={{onClose: handleClosePopover}}
                        />
                      </Box>
                    </React.Fragment>
                  ))}
                <LoadingButton
                  loading={loading || updating}
                  disabled={loading || updating || Object.keys(data).length === 0}
                  variant="outlined"
                  size="small"
                  color="primary"
                  onClick={updatePreference}>
                  <FormattedMessage
                    id="ui.onBoardingWidget.step.appearance.titleSlogan.button"
                    defaultMessage="ui.onBoardingWidget.step.appearance.titleSlogan.button"
                  />
                </LoadingButton>
              </Box>
            )}

            {tab === AppearanceTabType.LOGO && (
              <>
                {preferences
                  .filter((item) => item.section === SCPreferenceSection.LOGO)
                  .map((logo) => (
                    <React.Fragment key={logo.id}>
                      <Typography variant="h6">{formatLogoLabel(logo.name)}</Typography>
                      <Box className={classes.logoContainer}>
                        <img src={logo.value} className={classes.logo} />
                        <input type="file" onChange={(event) => handleUpload(event, logo.name)} hidden accept=".gif,.png,.jpg,.jpeg" id={logo.name} />
                        <LoadingButton
                          className={classes.uploadButton}
                          onClick={() => document.getElementById(`${logo.name}`).click()}
                          loading={Boolean(loadingLogo) && Boolean(logo.name === loadingLogo)}
                          disabled={Boolean(loadingLogo) && Boolean(logo.name !== loadingLogo)}>
                          <Icon>upload</Icon>
                        </LoadingButton>
                      </Box>
                    </React.Fragment>
                  ))}
              </>
            )}
            {tab === AppearanceTabType.SLOGAN && (
              <Box>
                <TextField
                  multiline
                  fullWidth
                  label={`${intl.formatMessage(messages.titleField)}`}
                  margin="normal"
                  value={preferences?.find((item) => item.section === 'text' && item.name === 'application_slogan1')?.value || ''}
                  name="application_slogan1"
                  onChange={handleChange}
                  InputProps={{
                    endAdornment: (
                      <Typography variant="body2">
                        {preferences?.find((item) => item.section === 'text' && item.name === 'application_slogan1')?.value?.length
                          ? 50 - preferences?.find((item) => item.section === 'text' && item.name === 'application_slogan1')?.value.length
                          : 50}
                      </Typography>
                    )
                  }}
                  error={Boolean(preferences?.find((item) => item.section === 'text' && item.name === 'application_slogan1')?.value?.length > 50)}
                />
                <TextField
                  multiline
                  fullWidth
                  label={`${intl.formatMessage(messages.sloganField)}`}
                  margin="normal"
                  value={preferences?.find((item) => item.section === 'text' && item.name === 'application_slogan2')?.value || ''}
                  name="application_slogan2"
                  onChange={handleChange}
                  InputProps={{
                    endAdornment: (
                      <Typography variant="body2">
                        {preferences?.find((item) => item.section === 'text' && item.name === 'application_slogan2')?.value?.length
                          ? 150 - preferences?.find((item) => item.section === 'text' && item.name === 'application_slogan2')?.value.length
                          : 150}
                      </Typography>
                    )
                  }}
                  error={Boolean(preferences?.find((item) => item.section === 'text' && item.name === 'application_slogan2')?.value?.length > 150)}
                />
                <LoadingButton
                  loading={updating}
                  disabled={updating || Object.keys(data).length === 0}
                  variant="outlined"
                  size="small"
                  color="primary"
                  onClick={updatePreference}>
                  <FormattedMessage
                    id="ui.onBoardingWidget.step.appearance.titleSlogan.button"
                    defaultMessage="ui.onBoardingWidget.step.appearance.titleSlogan.button"
                  />
                </LoadingButton>
              </Box>
            )}
          </Box>
        </ScrollContainer>
      </DrawerRoot>
    </Root>
  );
}
