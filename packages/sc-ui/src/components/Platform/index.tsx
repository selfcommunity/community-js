import React, {useContext} from 'react';
import {styled} from '@mui/material/styles';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import {Button, Grid, ListItem, Typography} from '@mui/material';
import {Endpoints, http, SCLocaleContextType, SCUserContext, SCUserContextType, useSCLocale} from '@selfcommunity/core';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import {AxiosResponse} from 'axios';
import {FormattedMessage} from 'react-intl';

const PREFIX = 'SCPlatform';

const Root = styled(Card, {
  name: PREFIX,
  slot: 'Root',
  overridesResolver: (props, styles) => styles.root
})(({theme}) => ({
  maxWidth: 700,
  marginBottom: theme.spacing(2),
  padding: 20
}));

function Platform({contained = true}: {contained: boolean}): JSX.Element {
  const scUserContext: SCUserContextType = useContext(SCUserContext);
  const scLocaleContext: SCLocaleContextType = useSCLocale();
  const language = scLocaleContext.locale;
  const roleText =
    scUserContext.user['role'] === 'moderator' ? (
      <FormattedMessage id="ui.platformAccess.mod" defaultMessage="ui.platformAccess.mod" />
    ) : (
      <FormattedMessage id="ui.platformAccess.edt" defaultMessage="ui.platformAccess.edt" />
    );

  function fetchPlatform(query) {
    http
      .request({
        url: Endpoints.Platform.url(),
        method: Endpoints.Platform.method,
        params: {
          next: query
        }
      })
      .then((res: AxiosResponse<any>) => {
        const platformUrl = res.data.platform_url;
        window.open(platformUrl, '_blank').focus();
      })
      .catch((error) => {
        console.log(error);
      });
  }
  /**
   * Renders admin panel
   * @return {JSX.Element}
   */
  function renderAdminPanel() {
    return (
      <React.Fragment>
        <Grid container spacing={1} justifyContent="center">
          <Grid item xs={12}>
            <Typography component="h3" align="center">
              <FormattedMessage id="ui.platformAccess.title" defaultMessage="ui.platformAccess.title" />
              <LockOutlinedIcon fontSize="small" />
            </Typography>
          </Grid>
          <Grid item xs="auto" style={{textAlign: 'center'}}>
            <Button variant="outlined" size="small" onClick={() => fetchPlatform('')}>
              <FormattedMessage id="ui.platformAccess.adm" defaultMessage="ui.platformAccess.adm" />
            </Button>
          </Grid>
          <Grid item xs="auto" style={{textAlign: 'center'}}>
            <Button variant="outlined" size="small" onClick={() => fetchPlatform('/moderation/flags')}>
              <FormattedMessage id="ui.platformAccess.mod" defaultMessage="ui.platformAccess.mod" />
            </Button>
          </Grid>
          <Grid item xs="auto" style={{textAlign: 'center'}}>
            <Button variant="outlined" size="small" href={`https://support.selfcommunity.com/hc/${language}`} target="_blank">
              <FormattedMessage id="ui.platformAccess.hc" defaultMessage="ui.platformAccess.hc" />
            </Button>
          </Grid>
        </Grid>
      </React.Fragment>
    );
  }

  /**
   * Renders moderator or editor panel
   * @return {JSX.Element}
   */
  function renderRolePanel() {
    return (
      <React.Fragment>
        <Grid container spacing={2} justifyContent="center">
          <Grid item xs={12}>
            <Typography component="h3" align="center">
              <FormattedMessage id="ui.platformAccess.title" defaultMessage="ui.platformAccess.title" />
              <LockOutlinedIcon fontSize="small" />
            </Typography>
          </Grid>
          <Grid item xs={6} style={{textAlign: 'center'}}>
            <Button variant="outlined" size="small" onClick={() => fetchPlatform('')}>
              {roleText}
            </Button>
          </Grid>
          <Grid item xs={6} style={{textAlign: 'center'}}>
            <Button variant="outlined" size="small" href={`https://support.selfcommunity.com/hc/it`} target="_blank">
              <FormattedMessage id="ui.platformAccess.hc" defaultMessage="ui.platformAccess.hc" />
            </Button>
          </Grid>
        </Grid>
      </React.Fragment>
    );
  }

  function renderPanel() {
    return <React.Fragment>{scUserContext.user['role'] === 'admin' ? renderAdminPanel() : renderRolePanel()}</React.Fragment>;
  }

  const p = (
    <React.Fragment>
      {scUserContext.user['role'] === null ? (
        <Typography>
          <FormattedMessage id="ui.platform.warning" defaultMessage="ui.platform.warning" />
        </Typography>
      ) : (
        renderPanel()
      )}
    </React.Fragment>
  );
  if (contained) {
    return (
      <Root variant="outlined">
        <CardContent>{p}</CardContent>
      </Root>
    );
  }
  return p;
}

export default Platform;
