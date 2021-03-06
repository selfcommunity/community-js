import React, {useContext, useEffect, useState} from 'react';
import {styled} from '@mui/material/styles';
import CardContent from '@mui/material/CardContent';
import {Button, CardActions, Box, Typography, Grid} from '@mui/material';
import {http, Endpoints, HttpResponse} from '@selfcommunity/api-services';
import {SCUserContext, SCUserContextType} from '@selfcommunity/react-core';
import Icon from '@mui/material/Icon';
import {defineMessages, FormattedMessage, useIntl} from 'react-intl';
import LoyaltyProgramDialog from './LoyaltyProgramDialog';
import {SCRoutingContextType, useSCRouting, Link, SCRoutes} from '@selfcommunity/react-core';
import LoyaltyProgramDetail from '../LoyaltyProgramDetail';
import classNames from 'classnames';
import Widget from '../Widget';
import {useThemeProps} from '@mui/system';

const messages = defineMessages({
  points: {
    id: 'ui.loyaltyProgram.points',
    defaultMessage: 'ui.loyaltyProgram.points'
  }
});

const PREFIX = 'SCLoyaltyProgram';

const classes = {
  root: `${PREFIX}-root`,
  title: `${PREFIX}-title`,
  cardHeader: `${PREFIX}-card-header`,
  pointsIcon: `${PREFIX}-pointsIcon`,
  actions: `${PREFIX}-actions`,
  points: `${PREFIX}-points`,
  pointsBox: `${PREFIX}-points-box`,
  discoverMore: `${PREFIX}-discover-more`
};

const Root = styled(Widget, {
  name: PREFIX,
  slot: 'Root',
  overridesResolver: (props, styles) => styles.root
})(({theme}) => ({
  marginBottom: theme.spacing(2),
  [`& .${classes.cardHeader}`]: {
    display: 'flex',
    alignItems: 'start',
    flexWrap: 'wrap',
    marginTop: theme.spacing(2)
  },
  [`& .${classes.pointsIcon}`]: {
    backgroundColor: theme.palette.grey['A200'],
    padding: 10,
    '& .MuiSvgIcon-root ': {
      fontSize: '3rem',
      color: theme.palette.primary.main
    }
  },
  [`& .${classes.actions}`]: {
    display: 'flex',
    justifyContent: 'space-between'
  },
  [`& .${classes.pointsBox}`]: {
    backgroundColor: theme.palette.primary.main,
    padding: 10
  },
  [`& .${classes.points}`]: {
    color: theme.palette.common.white,
    fontSize: '1rem'
  }
}));

export interface LoyaltyProgramProps {
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
   * Sets the type card for the component
   * @default null
   */
  cardType?: boolean;
}
/**
 * > API documentation for the Community-JS Loyalty Program component. Learn about the available props and the CSS API.

 #### Import

 ```jsx
 import {LoyaltyProgram} from '@selfcommunity/react-ui';
 ```

 #### Component Name

 The name `SCLoyaltyProgram` can be used when providing style overrides in the theme.


 #### CSS

 |Rule Name|Global class|Description|
 |---|---|---|
 |root|.SCLoyaltyProgram-root|Styles applied to the root element.|
 |title.SCLoyaltyProgram-title|Styles applied to the title element.|
 |cardHeader|.SCLoyaltyProgram-card-header|Styles applied to the card header element.|
 |pointsIcon|.SCLoyaltyProgram-pointsIcon|Styles applied to the points icon element.|
 |actions|.SCLoyaltyProgram-actions|Styles applied to the actions section.|
 |points|.SCLoyaltyProgram-points|Styles applied to the points section.|
 |pointsBox|.SCLoyaltyProgram-points-box|Styles applied to the points box element.|
 |discoverMore|.SCLoyaltyProgram-discover-more|Styles applied to discover more button element.|
 *
 * @param inProps
 */
export default function LoyaltyProgram(inProps: LoyaltyProgramProps): JSX.Element {
  const props: LoyaltyProgramProps = useThemeProps({
    props: inProps,
    name: PREFIX
  });
  // PROPS
  const {autoHide, className, cardType} = props;

  // CONTEXT
  const scUserContext: SCUserContextType = useContext(SCUserContext);
  const scRoutingContext: SCRoutingContextType = useSCRouting();

  // STATE
  const [points, setPoints] = useState<number>(null);
  const [openLoyaltyProgramDialog, setOpenLoyaltyProgramDialog] = useState<boolean>(false);

  // INTL
  const intl = useIntl();

  /**
   * Handles dialog close
   */
  const handleClose = () => {
    setOpenLoyaltyProgramDialog(false);
  };

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
      })
      .catch((error) => {
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

  /**
   * Renders loyalty card
   */
  const l = (
    <React.Fragment>
      <CardContent>
        <Typography className={classes.title} variant="h5">
          <FormattedMessage id="ui.loyaltyProgram.title" defaultMessage="ui.loyaltyProgram.title" />
        </Typography>
        <Grid container spacing={2} className={classes.cardHeader}>
          <Grid item>
            <Box className={classes.pointsIcon}>
              <Icon>card_membership</Icon>
            </Box>
          </Grid>
          <Grid item xs={12} sm container>
            <Typography gutterBottom variant="h6">
              <FormattedMessage id="ui.loyaltyProgram.lp" defaultMessage="ui.loyaltyProgram.lp" />
            </Typography>
            <Typography variant="body2" color="text.secondary">
              <FormattedMessage id="ui.loyaltyProgram.description" defaultMessage="ui.loyaltyProgram.description" />
            </Typography>
          </Grid>
        </Grid>
      </CardContent>
      <CardActions className={classes.actions}>
        <Box component="span" className={classes.pointsBox}>
          <Typography variant="body2" className={classes.points}>
            {`${intl.formatMessage(messages.points, {total: points})}`}
          </Typography>
        </Box>
        {cardType ? (
          <Button
            variant="outlined"
            size="small"
            className={classes.discoverMore}
            component={Link}
            to={scRoutingContext.url(SCRoutes.LOYALTY_ROUTE_NAME, {LoyaltyProgramDetail})}>
            <FormattedMessage id="ui.loyaltyProgram.discover" defaultMessage="ui.loyaltyProgram.discover" />
          </Button>
        ) : (
          <Button variant="outlined" size="small" className={classes.discoverMore} onClick={() => setOpenLoyaltyProgramDialog(true)}>
            <FormattedMessage id="ui.loyaltyProgram.discover" defaultMessage="ui.loyaltyProgram.discover" />
          </Button>
        )}
      </CardActions>
      {openLoyaltyProgramDialog && <LoyaltyProgramDialog open={openLoyaltyProgramDialog} onClose={handleClose} points={points} />}
    </React.Fragment>
  );

  /**
   * Renders root object (if not hidden by autoHide prop)
   */
  if (!autoHide && scUserContext.user) {
    return (
      <Root {...props} className={classNames(classes.root, className)}>
        {l}
      </Root>
    );
  }
  return null;
}
