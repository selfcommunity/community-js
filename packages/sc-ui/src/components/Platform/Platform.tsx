import React, {useContext} from 'react';
import {styled} from '@mui/material/styles';
import Card from '@mui/material/Card';
import {Button, Grid, Typography} from '@mui/material';
import {Endpoints, http, SCLocaleContextType, SCUserContext, SCUserContextType, useSCLocale} from '@selfcommunity/core';
import Icon from '@mui/material/Icon';
import {AxiosResponse} from 'axios';
import {FormattedMessage} from 'react-intl';
import classNames from 'classnames';

const PREFIX = 'SCPlatform';

const classes = {
  root: `${PREFIX}-root`
};

const Root = styled(Card, {
  name: PREFIX,
  slot: 'Root',
  overridesResolver: (props, styles) => styles.root
})(({theme}) => ({
  maxWidth: 700,
  marginBottom: theme.spacing(2),
  padding: 20
}));

export interface PlatformProps {
  /**
   * Hides this component
   * @default false
   */
  autoHide?: boolean;
  /**
   * Overrides or extends the styles applied to the component.
   * @default null
   */
  className?: string;

  /**
   * Other props
   */
  [p: string]: any;
}

/**
 * > API documentation for the Community-UI Platform component. Learn about the available props and the CSS API.

 #### Import

 ```jsx
 import {Platform} from '@selfcommunity/ui';
 ```

 #### Component Name

 The name `SCPlatform` can be used when providing style overrides in the theme.


 #### CSS

 |Rule Name|Global class|Description|
 |---|---|---|
 |root|.SCPlatform-root|Styles applied to the root element.|
 *
 * @param props
 */
export default function Platform(props: PlatformProps): JSX.Element {
  // PROPS
  const {autoHide, className, ...rest} = props;

  // CONTEXT
  const scUserContext: SCUserContextType = useContext(SCUserContext);
  const scLocaleContext: SCLocaleContextType = useSCLocale();

  // CONST
  const language = scLocaleContext.locale;
  const roles = scUserContext.user && scUserContext.user.role;
  const isAdmin = roles && roles.includes('admin');
  const isModerator = roles && roles.includes('moderator');

  /**
   * Fetches platform url
   */
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
   * Renders platform card
   */
  const c = (
    <React.Fragment>
      <Grid container spacing={isAdmin ? 1 : 3} justifyContent="center">
        <Grid item xs={12}>
          <Typography component="h3" align="center">
            <FormattedMessage id="ui.platformAccess.title" defaultMessage="ui.platformAccess.title" />
            <Icon fontSize="small">lock</Icon>
          </Typography>
        </Grid>
        {isAdmin && (
          <Grid item xs="auto" style={{textAlign: 'center'}}>
            <Button variant="outlined" size="small" onClick={() => fetchPlatform('')}>
              <FormattedMessage id="ui.platformAccess.adm" defaultMessage="ui.platformAccess.adm" />
            </Button>
          </Grid>
        )}
        <Grid item xs="auto" style={{textAlign: 'center'}}>
          <Button variant="outlined" size="small" onClick={() => fetchPlatform('')}>
            {isAdmin || isModerator ? (
              <FormattedMessage id="ui.platformAccess.mod" defaultMessage="ui.platformAccess.mod" />
            ) : (
              <FormattedMessage id="ui.platformAccess.edt" defaultMessage="ui.platformAccess.edt" />
            )}
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

  /**
   * Renders root object (if not hidden by autoHide prop)
   */
  if (!autoHide && roles !== null) {
    return (
      <Root className={classNames(classes.root, className)} {...rest}>
        {c}
      </Root>
    );
  }
  return null;
}
