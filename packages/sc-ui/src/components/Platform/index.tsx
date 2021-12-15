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
  const role = scUserContext.user['role'];
  const spacing = role === 'admin' ? 1 : 3;

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
   * Renders platform panel
   * @return {JSX.Element}
   */
  function renderPanel() {
    return (
      <React.Fragment>
        <Grid container spacing={spacing} justifyContent="center">
          <Grid item xs={12}>
            <Typography component="h3" align="center">
              <FormattedMessage id="ui.platformAccess.title" defaultMessage="ui.platformAccess.title" />
              <LockOutlinedIcon fontSize="small" />
            </Typography>
          </Grid>
          {role === 'admin' && (
            <Grid item xs="auto" style={{textAlign: 'center'}}>
              <Button variant="outlined" size="small" onClick={() => fetchPlatform('')}>
                <FormattedMessage id="ui.platformAccess.adm" defaultMessage="ui.platformAccess.adm" />
              </Button>
            </Grid>
          )}
          <Grid item xs="auto" style={{textAlign: 'center'}}>
            <Button variant="outlined" size="small" onClick={() => fetchPlatform('')}>
              {role === 'moderator' || role === 'admin' ? (
                <FormattedMessage id="ui.platformAccess.mod" defaultMessage="ui.platformAccess.mod" />
              ) : (
                <FormattedMessage id="ui.platformAccess.edt" defaultMessage="ui.platformAccess.edt" />
              )}
            </Button>
          </Grid>
          <Grid item xs="auto" style={{textAlign: 'center'}}>
            <Button variant="outlined" size="small" href={`https://support.selfcommunity.com/hc/it`} target="_blank">
              <FormattedMessage id="ui.platformAccess.hc" defaultMessage="ui.platformAccess.hc" />
            </Button>
          </Grid>
        </Grid>
      </React.Fragment>
    );
  }

  const p = <React.Fragment>{role === null ? null : renderPanel()}</React.Fragment>;
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
