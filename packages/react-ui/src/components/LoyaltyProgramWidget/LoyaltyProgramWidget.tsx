import React, {useContext, useEffect, useState} from 'react';
import {styled} from '@mui/material/styles';
import CardContent from '@mui/material/CardContent';
import {Button, CardActions, Chip, Typography} from '@mui/material';
import {http, Endpoints, HttpResponse} from '@selfcommunity/api-services';
import {SCUserContext, SCUserContextType} from '@selfcommunity/react-core';
import {FormattedMessage} from 'react-intl';
import {SCRoutingContextType, useSCRouting, Link, SCRoutes} from '@selfcommunity/react-core';
import classNames from 'classnames';
import Widget from '../Widget';
import {useThemeProps} from '@mui/system';
import HiddenPlaceholder from '../../shared/HiddenPlaceholder';
import Skeleton from './Skeleton';

const PREFIX = 'SCLoyaltyProgramWidget';

const classes = {
  root: `${PREFIX}-root`,
  title: `${PREFIX}-title`,
  actions: `${PREFIX}-actions`,
  points: `${PREFIX}-points`,
  discoverMore: `${PREFIX}-discover-more`
};

const Root = styled(Widget, {
  name: PREFIX,
  slot: 'Root',
  overridesResolver: (props, styles) => styles.root
})(({theme}) => ({}));

export interface LoyaltyProgramWidgetProps {
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
}
/**
 * > API documentation for the Community-JS Loyalty Program Widget component. Learn about the available props and the CSS API.

 #### Import

 ```jsx
 import {LoyaltyProgramWidget} from '@selfcommunity/react-ui';
 ```

 #### Component Name

 The name `SCLoyaltyProgramWidget` can be used when providing style overrides in the theme.


 #### CSS

 |Rule Name|Global class|Description|
 |---|---|---|
 |root|.SCLoyaltyProgramWidget-root|Styles applied to the root element.|
 |title.SCLoyaltyProgramWidget-title|Styles applied to the title element.|
 |actions|.SCLoyaltyProgramWidget-actions|Styles applied to the actions section.|
 |points|.SCLoyaltyProgramWidget-points|Styles applied to the points section.|
 |discoverMore|.SCLoyaltyProgramWidget-discover-more|Styles applied to discover more button element.|
 *
 * @param inProps
 */
export default function LoyaltyProgramWidget(inProps: LoyaltyProgramWidgetProps): JSX.Element {
  const props: LoyaltyProgramWidgetProps = useThemeProps({
    props: inProps,
    name: PREFIX
  });
  // PROPS
  const {autoHide, className} = props;

  // CONTEXT
  const scUserContext: SCUserContextType = useContext(SCUserContext);
  const scRoutingContext: SCRoutingContextType = useSCRouting();

  // STATE
  const [points, setPoints] = useState<number>(null);
  const [loading, setLoading] = useState<boolean>(true);

  /**
   * Fetches user loyalty points
   */
  function fetchLP() {
    http
      .request({
        url: Endpoints.GetUserLoyaltyPoints.url({id: scUserContext.user['id']}),
        method: Endpoints.GetUserLoyaltyPoints.method
      })
      .then((res: HttpResponse<any>) => {
        setPoints(res.data.points);
        setLoading(false);
      })
      .catch((error) => {
        setLoading(false);
        console.log(error);
      });
  }

  /**
   * On mount, fetches user loyalty points
   */
  useEffect(() => {
    if (scUserContext.user) {
      fetchLP();
    }
  }, [scUserContext.user]);

  if (loading) {
    return <Skeleton />;
  }
  /**
   * Rendering
   */
  if (!autoHide && scUserContext.user) {
    return (
      <Root {...props} className={classNames(classes.root, className)}>
        <CardContent>
          <Typography className={classes.title}>
            <FormattedMessage id="ui.loyaltyProgramWidget.title" defaultMessage="ui.loyaltyProgramWidget.title" />
          </Typography>
        </CardContent>
        <CardActions className={classes.actions}>
          <Typography className={classes.points}>
            <Chip size={'medium'} component="span" label={points} />
            <FormattedMessage id="ui.loyaltyProgramWidget.points" defaultMessage="ui.loyaltyProgramWidget.points" />
          </Typography>
          <Button
            size="small"
            variant="outlined"
            className={classes.discoverMore}
            component={Link}
            to={scRoutingContext.url(SCRoutes.LOYALTY_ROUTE_NAME, {})}>
            <FormattedMessage id="ui.loyaltyProgramWidget.discover" defaultMessage="ui.loyaltyProgramWidget.discover" />
          </Button>
        </CardActions>
      </Root>
    );
  }
  return <HiddenPlaceholder />;
}
