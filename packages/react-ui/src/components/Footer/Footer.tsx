import React, {useEffect, useState} from 'react';
import {useThemeProps} from '@mui/system';
import {styled} from '@mui/material/styles';
import {Box, Grid, Typography} from '@mui/material';
import classNames from 'classnames';
import {http, Endpoints, HttpResponse} from '@selfcommunity/api-services';
import {SCLegalPagePoliciesType} from '@selfcommunity/types';
import {Logger} from '@selfcommunity/utils';
import {
  SCRoutes,
  SCRoutingContextType,
  Link,
  useSCRouting,
  SCPreferences,
  SCPreferencesContextType,
  useSCPreferences
} from '@selfcommunity/react-core';
import {SCOPE_SC_UI} from '../../constants/Errors';
import FooterSkeleton from './Skeleton';
import {FormattedMessage} from 'react-intl';

const PREFIX = 'SCFooter';

const classes = {
  root: `${PREFIX}-root`,
  linkItem: `${PREFIX}-link-item`,
  copyright: `${PREFIX}-copyright`
};

const Root = styled(Box, {
  name: PREFIX,
  slot: 'Root',
  overridesResolver: (props, styles) => styles.root
})(({theme}) => ({
  [`& .${classes.copyright}`]: {
    marginTop: theme.spacing(2)
  },
  [`& .${classes.linkItem}`]: {
    color: 'inherit',
    cursor: 'pointer',
    '&:any-link': {
      color: 'inherit',
      textDecoration: 'none'
    }
  }
}));

export interface FooterProps {
  /**
   * Overrides or extends the styles applied to the component.
   * @default null
   */
  className?: string;
  /**
   * Any other properties
   */
  [p: string]: any;
}

/**
 *> API documentation for the Community-JS Footer component. Learn about the available props and the CSS API.
 *
 #### Import
 ```jsx
 import {Footer} from '@selfcommunity/react-ui';
 ```

 #### Component Name
 The name `SCFooter` can be used when providing style overrides in the theme.

 #### CSS

 |Rule Name|Global class|Description|
 |---|---|---|
 |root|.SCFooter-root|Styles applied to the root element.|
 |link|.SCFooter-link-item|Styles applied to the link item element.|
 |copyright|.SCFooter-copyright|Styles applied to the copyright section.|

 * @param inProps
 */
export default function Footer(inProps: FooterProps): JSX.Element {
  //PROPS
  const props: FooterProps = useThemeProps({
    props: inProps,
    name: PREFIX
  });
  const {className, ...rest} = props;

  // CONTEXT
  const scRoutingContext: SCRoutingContextType = useSCRouting();

  // PREFERENCES
  const scPreferences: SCPreferencesContextType = useSCPreferences();
  const copyRight = scPreferences.preferences[SCPreferences.TEXT_APPLICATION_COPYRIGHT].value;

  //STATE
  const [pages, setPages] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  /**
   * Fetches custom pages
   */
  function fetchCustomPages() {
    setLoading(true);
    http
      .request({
        url: Endpoints.GetCustomPages.url(),
        method: Endpoints.GetCustomPages.method,
        params: {
          visible_in_menu: true
        }
      })
      .then((res: HttpResponse<any>) => {
        setPages(res.data.results);
        setLoading(false);
      })
      .catch((error) => {
        setLoading(false);
        Logger.error(SCOPE_SC_UI, error);
      });
  }

  /**
   * On mount, fetches legal and custom pages
   */
  useEffect(() => {
    fetchCustomPages();
  }, []);

  /**
   * Renders root object
   */
  if (loading) {
    return <FooterSkeleton />;
  }
  return (
    <Root {...rest} className={classNames(classes.root, className)}>
      <Grid container spacing={1} justifyContent="center">
        {pages.map((page, index) => (
          <Grid item key={index}>
            <Link
              className={classes.linkItem}
              to={page.alternative_url ? page.alternative_url : scRoutingContext.url(SCRoutes.CUSTOM_PAGES_ROUTE_NAME, page)}>
              <FormattedMessage id={`ui.footer.customPages.${page.slug}`} defaultMessage={`ui.footer.customPages.${page.slug}`} />
            </Link>
          </Grid>
        ))}
        {Object.values(SCLegalPagePoliciesType).map((policy: string, index) => (
          <Grid item key={index}>
            <Link className={classes.linkItem} to={scRoutingContext.url(SCRoutes.LEGAL_PAGES_ROUTE_NAME, {policy: policy})}>
              <FormattedMessage id={`ui.footer.legalPages.${policy}`} defaultMessage={`ui.footer.legalPages.${policy}`} />
            </Link>
          </Grid>
        ))}
      </Grid>
      <Typography textAlign="center" className={classes.copyright} variant="subtitle2">
        {copyRight}
      </Typography>
    </Root>
  );
}
