import React, {useContext, useEffect, useMemo, useState} from 'react';
import {styled} from '@mui/material/styles';
import CardContent from '@mui/material/CardContent';
import {Button, CardActions, Chip, Typography} from '@mui/material';
import {http, Endpoints, HttpResponse} from '@selfcommunity/api-services';
import {SCPreferences, SCPreferencesContextType, SCUserContext, SCUserContextType, useSCPreferences} from '@selfcommunity/react-core';
import {FormattedMessage} from 'react-intl';
import {SCRoutingContextType, useSCRouting, Link, SCRoutes} from '@selfcommunity/react-core';
import classNames from 'classnames';
import Widget, { WidgetProps } from '../Widget';
import {useThemeProps} from '@mui/system';
import HiddenPlaceholder from '../../shared/HiddenPlaceholder';
import Skeleton from './Skeleton';
import {SCOPE_SC_UI} from '../../constants/Errors';
import {Logger} from '@selfcommunity/utils';
import {PREFIX} from './constants';

const classes = {
  root: `${PREFIX}-root`,
  title: `${PREFIX}-title`,
  actions: `${PREFIX}-actions`,
  points: `${PREFIX}-points`,
  discoverMore: `${PREFIX}-discover-more`
};

const Root = styled(Widget, {
  name: PREFIX,
  slot: 'Root'
})(() => ({}));

export interface LoyaltyProgramWidgetProps extends WidgetProps {
  /**
   * The user id
   * @default null
   */
  userId?: number;
}
/**
 * > API documentation for the Community-JS Loyalty Program Widget component. Learn about the available props and the CSS API.
 *
 *
 * This component renders a widget containing the points earn by the user with the loyalty program.
 * Take a look at our <strong>demo</strong> component [here](/docs/sdk/community-js/react-ui/Components/LoyaltyProgram)

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
  const {className, userId = null, ...rest} = props;

  // CONTEXT
  const scUserContext: SCUserContextType = useContext(SCUserContext);
  const scPreferencesContext: SCPreferencesContextType = useSCPreferences();
  const scRoutingContext: SCRoutingContextType = useSCRouting();

  // STATE
  const [points, setPoints] = useState<number>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const authUserId = scUserContext.user ? scUserContext.user.id : null;

  //MEMO
  const loyaltyEnabled = useMemo(
    () =>
      SCPreferences.ADDONS_LOYALTY_POINTS_COLLECTION in scPreferencesContext.preferences &&
      scPreferencesContext.preferences[SCPreferences.ADDONS_LOYALTY_POINTS_COLLECTION].value,
    [scPreferencesContext.preferences]
  );

  /**
   * Fetches user loyalty points
   */
  const fetchLP = () => {
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
        Logger.error(SCOPE_SC_UI, error);
        console.log(error);
      });
  };

  /**
   * On mount, fetches user loyalty points
   */
  useEffect(() => {
    if (loyaltyEnabled && authUserId) {
      fetchLP();
    }
  }, [authUserId, loyaltyEnabled]);

  /**
   * Rendering
   */
  if (!loyaltyEnabled || !scUserContext.user || (userId  && userId !== scUserContext.user.id)) {
    return <HiddenPlaceholder />;
  }
  if (loading) {
    return <Skeleton />;
  }
  return (
    <Root className={classNames(classes.root, className)} {...rest}>
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
