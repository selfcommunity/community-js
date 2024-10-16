import React, {useCallback, useEffect, useReducer, useRef, useState} from 'react';
import {styled} from '@mui/material/styles';
import Box from '@mui/material/Box';
import {useThemeProps} from '@mui/system';
import classNames from 'classnames';
import {Preferences} from '@selfcommunity/react-core';
import {PREFIX} from '../../constants';
import {Button, CircularProgress, Drawer, IconButton, Tab, Tabs, TextField, Typography} from '@mui/material';
import {MuiColorInput} from 'mui-color-input';
import {actionTypes} from './reducer';
import {getInitialState, reducer} from './reducer';
import {PreferenceService, SCPaginatedResponse} from '@selfcommunity/api-services';
import {SCPreferenceType} from '@selfcommunity/types';
import {formatColorLabel, formatLogoLabel} from '../../../../utils/onBoarding';
import {defineMessages, FormattedMessage, useIntl} from 'react-intl';
import Icon from '@mui/material/Icon';
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
  const [state, dispatch] = useReducer(reducer, getInitialState(null));
  const [loadingLogo, setLoadingLogo] = useState<string>('');
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [tab, setTab] = useState(0);
  const [updating, setUpdating] = useState<boolean>(false);
  const [updatingColor, setUpdatingColor] = useState<string>('');
  const colorRef = useRef(null);

  // INTL
  const intl = useIntl();

  // HANDLERS
  const handleTabChange = (event, newValue) => {
    setTab(newValue);
  };
  const handleOpen = useCallback((event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  }, []);
  const handleClose = useCallback(() => {
    setAnchorEl(null);
  }, []);

  const fetchColors = () => {
    dispatch({type: actionTypes.LOADING, payload: {loading: true}});
    PreferenceService.searchPreferences(
      '',
      '',
      `${Preferences.COLORS_COLORBACK},${Preferences.COLORS_COLORPRIMARY},${Preferences.COLORS_COLORSECONDARY},${Preferences.COLORS_NAVBARBACK},${Preferences.COLORS_COLORFONT},${Preferences.COLORS_COLORFONTSECONDARY}`
    )
      .then((res: SCPaginatedResponse<SCPreferenceType>) => {
        dispatch({
          type: actionTypes.SET_COLORS,
          payload: {
            loading: false,
            colors: res.results
          }
        });
      })
      .catch((e) => {
        Logger.error(SCOPE_SC_UI, e);
        dispatch({type: actionTypes.SET_COLORS, payload: {loading: false, colors: []}});
      });
  };

  const fetchLogos = () => {
    dispatch({type: actionTypes.LOADING, payload: {loading: true}});
    PreferenceService.searchPreferences('', '', `${Preferences.LOGO_NAVBAR_LOGO},${Preferences.LOGO_NAVBAR_LOGO_MOBILE}`)
      .then((res: SCPaginatedResponse<SCPreferenceType>) => {
        dispatch({
          type: actionTypes.SET_LOGOS,
          payload: {
            loading: false,
            logos: res.results
          }
        });
      })
      .catch((e) => {
        Logger.error(SCOPE_SC_UI, e);
        dispatch({type: actionTypes.SET_LOGOS, payload: {loading: false, logos: []}});
      });
  };

  const fetchSlogans = () => {
    dispatch({type: actionTypes.LOADING, payload: {loading: true}});
    PreferenceService.searchPreferences('', '', `${Preferences.TEXT_APPLICATION_SLOGAN1},${Preferences.TEXT_APPLICATION_SLOGAN2}`)
      .then((res: SCPaginatedResponse<SCPreferenceType>) => {
        dispatch({
          type: actionTypes.SET_SLOGANS,
          payload: {
            loading: false,
            slogans: res.results
          }
        });
      })
      .catch((e) => {
        Logger.error(SCOPE_SC_UI, e);
        dispatch({type: actionTypes.SET_SLOGANS, payload: {loading: false, slogans: []}});
      });
  };

  const updatePreference = async (preference: any) => {
    try {
      await PreferenceService.updatePreferences(preference);
    } catch (e) {
      Logger.error(SCOPE_SC_UI, e);
    } finally {
      setUpdating(false);
      setUpdatingColor('');
      onCompleteAction();
    }
  };

  const updateSlogans = async () => {
    setUpdating(true);
    try {
      await Promise.all(
        state.slogans.map(({name, value}) => {
          return updatePreference({[name]: value});
        })
      );
    } catch (e) {
      Logger.error(SCOPE_SC_UI, e);
    } finally {
      setUpdating(false);
    }
  };

  const updateLogoPreference = async (name: any, file: File) => {
    setLoadingLogo(name);
    const formData = new FormData();
    formData.append(name, file);
    await PreferenceService.updatePreferences(formData)
      .then((preference: SCPreferenceType) => {
        setLoadingLogo('');
        dispatch({
          type: actionTypes.SET_LOGOS,
          payload: {logos: state.logos.map((l) => (l.name === name ? {...l, value: preference[name].value} : l))}
        });
        onCompleteAction();
      })
      .catch((e) => {
        setLoadingLogo('');
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
    fetchColors();
    fetchLogos();
    fetchSlogans();
  }, []);

  // HANDLERS
  const handleColorChange = (color, name) => {
    setUpdatingColor(name);
    const currentColor = state.colors.find((col) => col.name === name);
    if (currentColor && currentColor.value !== color) {
      setUpdating(true);
      dispatch({
        type: actionTypes.SET_COLORS,
        payload: {colors: state.colors.map((col) => (col.name === name ? {...col, value: color} : col))}
      });
      updatePreference({[`${name}`]: color});
    }
  };

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const {name, value} = event.target;
    dispatch({
      type: actionTypes.SET_SLOGANS,
      payload: {slogans: state.slogans.map((s) => (s.name === name ? {...s, value: value} : s))}
    });
  };

  const handleClosePopover = () => {
    if (colorRef.current) {
      colorRef.current.blur();
    }
  };

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
            label={
              <FormattedMessage
                id="ui.onBoardingWidget.step.appearance.colors.title"
                defaultMessage="ui.onBoardingWidget.step.appearance.colors.title"
              />
            }
          />
          <Tab
            label={
              <FormattedMessage id="ui.onBoardingWidget.step.appearance.logo.title" defaultMessage="ui.onBoardingWidget.step.appearance.logo.title" />
            }
          />
          <Tab
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
            {tab === 0 && (
              <>
                {state.colors.map((color) => (
                  <React.Fragment key={color.id}>
                    <Typography variant="h6">{formatColorLabel(color)}</Typography>
                    <Box className={classes.colorContainer}>
                      <MuiColorInput
                        inputRef={colorRef}
                        className={classes.color}
                        format="hex"
                        value={color.value}
                        onChange={(newColor) => handleColorChange(newColor, color.name)}
                        isAlphaHidden
                        PopoverProps={{onClose: handleClosePopover}}
                      />
                      {updatingColor && updatingColor === color.name && (
                        <CircularProgress className={classes.colorProgress} color="secondary" size={24} />
                      )}
                    </Box>
                  </React.Fragment>
                ))}
              </>
            )}

            {tab === 1 && (
              <>
                {state.logos.map((logo) => (
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
            {tab === 2 && (
              <Box>
                <TextField
                  multiline
                  fullWidth
                  //className={classes.field}
                  label={`${intl.formatMessage(messages.titleField)}`}
                  margin="normal"
                  value={state?.slogans[0]?.value}
                  name="application_slogan1"
                  onChange={handleChange}
                  InputProps={{
                    endAdornment: <Typography variant="body2">{state.slogans[0].value?.length ? 50 - state.slogans[0].value?.length : 50}</Typography>
                  }}
                  error={Boolean(state?.slogans[0]?.value?.length > 50)}
                />
                <TextField
                  multiline
                  fullWidth
                  //className={classes.field}
                  label={`${intl.formatMessage(messages.sloganField)}`}
                  margin="normal"
                  value={state?.slogans[1]?.value}
                  name="application_slogan2"
                  onChange={handleChange}
                  InputProps={{
                    endAdornment: (
                      <Typography variant="body2">{state.slogans[1].value?.length ? 150 - state.slogans[1].value?.length : 150}</Typography>
                    )
                  }}
                  error={Boolean(state?.slogans[1]?.value?.length > 150)}
                />
                <LoadingButton loading={updating} disabled={updating} variant="outlined" size="small" color="primary" onClick={updateSlogans}>
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
