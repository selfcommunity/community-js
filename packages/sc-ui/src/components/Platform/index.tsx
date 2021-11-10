import React, {useContext, useEffect, useState} from 'react';
import {styled} from '@mui/material/styles';
import List from '@mui/material/List';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import {Button, Grid, ListItem, Typography} from '@mui/material';
import {Endpoints, http, SCLocaleContextType, SCUserContext, SCUserContextType, useSCLocale} from '@selfcommunity/core';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import {AxiosResponse} from 'axios';

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
  const roleText = scUserContext.user['role'] === 'moderator' ? 'Moderation' : 'Editor';

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
        <Grid container spacing={1}>
          <Grid item xs={12}>
            <Typography component="h3" align="center">
              Platform Access
              <LockOutlinedIcon fontSize="small" />
            </Typography>
          </Grid>
          <Grid item xs="auto">
            <Button variant="outlined" size="small" onClick={() => fetchPlatform('')}>
              Administration
            </Button>
          </Grid>
          <Grid item xs>
            <Button variant="outlined" size="small" onClick={() => fetchPlatform('/moderation/flags')}>
              Moderation
            </Button>
          </Grid>
          <Grid item xs>
            <Button variant="outlined" size="small" href={`https://support.selfcommunity.com/hc/${language}`} target="_blank">
              Help Center
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
        <Grid container spacing={3} columns={12}>
          <Grid item xs={12}>
            <Typography component="h3" align="center">
              Platform Access
              <LockOutlinedIcon fontSize="small" />
            </Typography>
          </Grid>
          <Grid item xs={6}>
            <Button variant="outlined" size="small" onClick={() => fetchPlatform('')}>
              {roleText}
            </Button>
          </Grid>
          <Grid item xs={6}>
            <Button variant="outlined" size="small" href={`https://support.selfcommunity.com/hc/it`} target="_blank">
              Help Center
            </Button>
          </Grid>
        </Grid>
      </React.Fragment>
    );
  }

  const p = <React.Fragment>{scUserContext.user['role'] === 'admin' ? renderAdminPanel() : renderRolePanel()}</React.Fragment>;
  if (contained) {
    return (
      <Root variant="outlined">
        <CardContent>
          <List>{p}</List>
        </CardContent>
      </Root>
    );
  }
  return p;
}

export default Platform;
