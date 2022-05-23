import React, {useEffect, useState} from 'react';
import useThemeProps from '@mui/material/styles/useThemeProps';
import {styled} from '@mui/material/styles';
import {Box, Grid, Typography} from '@mui/material';
import classNames from 'classnames';
import {http, Endpoints, HttpResponse} from '@selfcommunity/api-services';
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
import DetailDialog from './DetailDialog';

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
  const activePages = '2099-01-01';

  // CONTEXT
  const scRoutingContext: SCRoutingContextType = useSCRouting();

  // PREFERENCES
  const scPreferences: SCPreferencesContextType = useSCPreferences();
  const copyRight = scPreferences.preferences[SCPreferences.TEXT_APPLICATION_COPYRIGHT].value;

  //STATE
  const [pages, setPages] = useState<any[]>([]);
  const [legalPages, setLegalPages] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [openLegalPageDialog, setOpenLegalPageDialog] = useState<boolean>(false);
  const ids = [7, 5, 4];
  const filteredLegalPages = legalPages.filter((i) => ids.includes(i.id));
  const [detailObj, setDetailObj] = useState(null);

  // HANDLERS

  function handleOpenLegalPageDialog(item) {
    setOpenLegalPageDialog(true);
    setDetailObj(item);
  }

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
        //console.log(res.data.results, 'custom');
        setLoading(false);
      })
      .catch((error) => {
        setLoading(false);
        Logger.error(SCOPE_SC_UI, error);
      });
  }

  function fetchLegalPages() {
    setLoading(true);
    http
      .request({
        url: Endpoints.GetLegalPages.url(),
        method: Endpoints.GetLegalPages.method,
        params: {
          valid_to: activePages
        }
      })
      .then((res: HttpResponse<any>) => {
        setLegalPages(res.data.results);
        //console.log(res.data.results, 'legal');
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
    fetchLegalPages();
  }, []);

  /**
   * Renders root object
   */
  return (
    <>
      {loading ? (
        <FooterSkeleton />
      ) : (
        <Root {...rest} className={classNames(classes.root, className)}>
          <Grid container spacing={1} justifyContent="center">
            {pages.map((page, index) => (
              <Grid item key={index}>
                <Link className={classes.linkItem} to={scRoutingContext.url(SCRoutes.CUSTOM_PAGES_ROUTE_NAME, page)}>
                  {page.label}
                </Link>
              </Grid>
            ))}
            {filteredLegalPages.map((item, index) => (
              <Grid item key={index}>
                <Link className={classes.linkItem} onClick={() => handleOpenLegalPageDialog(item)}>
                  {item.label}
                </Link>
              </Grid>
            ))}
          </Grid>
          <Typography textAlign="center" className={classes.copyright} variant="subtitle2">
            {copyRight}
          </Typography>
          {openLegalPageDialog && <DetailDialog pageObj={detailObj} open={openLegalPageDialog} onClose={() => setOpenLegalPageDialog(false)} />}
        </Root>
      )}
    </>
  );
}
