import React, {useContext, useEffect, useState} from 'react';
import {styled} from '@mui/material/styles';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import {Button, CardActions, Box, Typography, Grid} from '@mui/material';
import {Endpoints, http, SCUserContext, SCUserContextType} from '@selfcommunity/core';
import Icon from '@mui/material/Icon';
import {AxiosResponse} from 'axios';
import {defineMessages, FormattedMessage, useIntl} from 'react-intl';
import LoyaltyProgramDialog from './LoyaltyProgramDialog';
import {SCRoutingContextType, useSCRouting, Link, SCRoutes} from '@selfcommunity/core';
import LoyaltyProgramDetail from './LoyaltyProgramDetail';
import classNames from 'classnames';

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
  pointsBox: `${PREFIX}-points-box`
};

const Root = styled(Card, {
  name: PREFIX,
  slot: 'Root',
  overridesResolver: (props, styles) => styles.root
})(({theme}) => ({
  marginBottom: theme.spacing(2),
  [`& .${classes.cardHeader}`]: {
    display: 'flex',
    alignItems: 'start',
    flexWrap: 'wrap'
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
    padding: 10,
    marginLeft: '-24px'
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
 * > API documentation for the Community-UI Loyalty Program component. Learn about the available props and the CSS API.

 #### Import

 ```jsx
 import {LoyaltyProgram} from '@selfcommunity/ui';
 ```

 #### Component Name

 The name `SCLoyaltyProgram` can be used when providing style overrides in the theme.


 #### CSS

 |Rule Name|Global class|Description|
 |---|---|---|
 |root|.SCLoyaltyProgram-root|Styles applied to the root element.|
 |cardHeader|.SCLoyaltyProgram-card-header|Styles applied to the card header element.|
 |pointsIcon|.SCLoyaltyProgram-pointsIcon|Styles applied to the points icon element.|
 |actions|.SCLoyaltyProgram-actions|Styles applied to the actions section.|
 |points|.SCLoyaltyProgram-points|Styles applied to the points section.|
 |pointsBox|.SCLoyaltyProgram-points-box|Styles applied to the points box element.|
 *
 * @param props
 */
export default function LoyaltyProgram(props: LoyaltyProgramProps): JSX.Element {
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
      .then((res: AxiosResponse<any>) => {
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
  }, []);

  /**
   * Renders loyalty card
   */
  const l = (
    <React.Fragment>
      <Typography className={classes.title} component="h3" align="left">
        <FormattedMessage id="ui.loyaltyProgram.title" defaultMessage="ui.loyaltyProgram.title" />
      </Typography>
      <CardContent>
        <Grid container spacing={2} className={classes.cardHeader}>
          <Grid item>
            <Box className={classes.pointsIcon}>
              <Icon>card_membership</Icon>
            </Box>
          </Grid>
          <Grid item xs={12} sm container>
            <Typography gutterBottom variant="h5" component="div">
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
          <Button variant="outlined" size="small" component={Link} to={scRoutingContext.url(SCRoutes.LOYALTY_ROUTE_NAME, {LoyaltyProgramDetail})}>
            <FormattedMessage id="ui.loyaltyProgram.discover" defaultMessage="ui.loyaltyProgram.discover" />
          </Button>
        ) : (
          <Button variant="outlined" size="small" onClick={() => setOpenLoyaltyProgramDialog(true)}>
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
        <CardContent>{l}</CardContent>
      </Root>
    );
  }
  return null;
}
