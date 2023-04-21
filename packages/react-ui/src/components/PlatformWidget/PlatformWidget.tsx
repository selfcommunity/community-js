import React, {useContext} from 'react';
import {styled} from '@mui/material/styles';
import {Button, Grid, Typography} from '@mui/material';
import {http, Endpoints, HttpResponse} from '@selfcommunity/api-services';
import {SCLocaleContextType, SCUserContext, SCUserContextType, useSCLocale} from '@selfcommunity/react-core';
import Icon from '@mui/material/Icon';
import {FormattedMessage} from 'react-intl';
import classNames from 'classnames';
import Widget from '../Widget';
import {useThemeProps} from '@mui/system';
import HiddenPlaceholder from '../../shared/HiddenPlaceholder';
import {VirtualScrollerItemProps} from '../../types/virtualScroller';

const PREFIX = 'SCPlatformWidget';

const classes = {
  root: `${PREFIX}-root`,
  title: `${PREFIX}-title`
};

const Root = styled(Widget, {
  name: PREFIX,
  slot: 'Root',
  overridesResolver: (props, styles) => styles.root
})(({theme}) => ({}));

export interface PlatformWidgetProps extends VirtualScrollerItemProps {
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
 * > API documentation for the Community-JS PlatformWidget component. Learn about the available props and the CSS API.

 #### Import

 ```jsx
 import {PlatformWidget} from '@selfcommunity/react-ui';
 ```

 #### Component Name

 The name `SCPlatformWidget` can be used when providing style overrides in the theme.


 #### CSS

 |Rule Name|Global class|Description|
 |---|---|---|
 |root|.SCPlatformWidget-root|Styles applied to the root element.|
 |title|.SCPlatformWidget-title|Styles applied to the title element.|

 *
 * @param inProps
 */
export default function PlatformWidget(inProps: PlatformWidgetProps): JSX.Element {
  // PROPS
  const props: PlatformWidgetProps = useThemeProps({
    props: inProps,
    name: PREFIX
  });
  const {autoHide, className, onHeightChange, onStateChange, ...rest} = props;

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
      .then((res: HttpResponse<any>) => {
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
    <Grid container spacing={isAdmin ? 1 : 3} justifyContent="center">
      <Grid item xs={12}>
        <Typography className={classes.title} component="h3" align="center">
          <FormattedMessage id="ui.platformWidget.title" defaultMessage="ui.platformWidget.title" />
          <Icon fontSize="small">lock</Icon>
        </Typography>
      </Grid>
      {isAdmin && (
        <Grid item xs="auto">
          <Button variant="outlined" size="small" onClick={() => fetchPlatform('')}>
            <FormattedMessage id="ui.platformWidget.adm" defaultMessage="ui.platformWidget.adm" />
          </Button>
        </Grid>
      )}
      <Grid item xs="auto">
        <Button variant="outlined" size="small" onClick={() => fetchPlatform('')}>
          {isAdmin || isModerator ? (
            <FormattedMessage id="ui.platformWidget.mod" defaultMessage="ui.platformWidget.mod" />
          ) : (
            <FormattedMessage id="ui.platformWidget.edt" defaultMessage="ui.platformWidget.edt" />
          )}
        </Button>
      </Grid>
      <Grid item xs="auto">
        <Button variant="outlined" size="small" href={`https://support.selfcommunity.com/hc/${language}`} target="_blank">
          <FormattedMessage id="ui.platformWidget.hc" defaultMessage="ui.platformWidget.hc" />
        </Button>
      </Grid>
    </Grid>
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
  return <HiddenPlaceholder />;
}
