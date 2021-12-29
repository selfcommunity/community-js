import React, {useEffect, useState} from 'react';
import {styled} from '@mui/material/styles';
import Card from '@mui/material/Card';
import {Endpoints, http} from '@selfcommunity/core';
import {AppBar, Box, Button, CardActions, CardContent, CardMedia, Dialog, Grid, Typography} from '@mui/material';
import {defineMessages, FormattedMessage, useIntl} from 'react-intl';
import {SCPrizeType} from '@selfcommunity/core/src/types';
import Chip from '@mui/material/Chip';
import CardGiftcardOutlinedIcon from '@mui/icons-material/CardGiftcardOutlined';

const messages = defineMessages({
  points: {
    id: 'ui.LoyaltyProgramDetail.points',
    defaultMessage: 'ui.LoyaltyProgramDetail.points'
  },
  yourPoints: {
    id: 'ui.LoyaltyProgramDetail.ypoints',
    defaultMessage: 'ui.LoyaltyProgramDetail.ypoints'
  }
});

const PREFIX = 'SCLoyaltyProgramDetail';

const classes = {
  header: `${PREFIX}-header`,
  intro: `${PREFIX}-intro`,
  icon: `${PREFIX}-icon`,
  card: `${PREFIX}-card`,
  title: `${PREFIX}-title`,
  points: `${PREFIX}-points`,
  description: `${PREFIX}-description`,
  action: `${PREFIX}-action`,
  chip: `${PREFIX}-chip`
};

const Root = styled(Card, {
  name: PREFIX,
  slot: 'Root',
  overridesResolver: (props, styles) => styles.root
})(({theme}) => ({
  minWidth: 500,
  margin: 2,
  [`& .${classes.header}`]: {
    backgroundColor: theme.palette.grey['A200'],
    marginBottom: '20px'
  },
  [`& .${classes.intro}`]: {
    display: 'flex',
    alignItems: 'center',
    marginBottom: '20px'
  },
  [`& .${classes.points}`]: {
    marginLeft: '16px'
  },
  [`& .${classes.title}`]: {
    fontWeight: 'bold'
  },
  [`& .${classes.icon}`]: {
    backgroundColor: theme.palette.grey['A200'],
    padding: 5,
    borderRadius: '5px',
    '& .MuiSvgIcon-root ': {
      fontSize: '2rem'
    }
  },
  [`& .${classes.card}`]: {
    height: '100%',
    flexDirection: 'column',
    justifyContent: 'space-between'
  },
  [`& .${classes.action}`]: {
    pointerEvents: 'all',
    cursor: 'not-allowed'
  },
  [`& .${classes.chip}`]: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  }
}));

export default function LoyaltyProgramDetail({
  autoHide = null,
  cardType = true,
  points = null,
  requestable = true,
  ...rest
}: {
  autoHide?: boolean;
  cardType?: boolean;
  points?: number;
  requestable?: boolean;
  [p: string]: any;
}): JSX.Element {
  const [prizes, setPrizes] = useState([]);
  const intl = useIntl();

  /**
   * Fetch the list of available prizes
   */
  function fetchPrizes() {
    http
      .request({
        url: Endpoints.GetPrizes.url(null),
        method: Endpoints.GetPrizes.method
      })
      .then((res: any) => {
        setPrizes(res.data.results);
      })
      .catch((error) => {
        console.log(error);
      });
  }

  useEffect(() => {
    fetchPrizes();
  }, []);

  const d = (
    <React.Fragment>
      {cardType && (
        <Typography component="h3" align="left" className={classes.header}>
          <FormattedMessage id="ui.loyaltyProgram.lp" defaultMessage="ui.loyaltyProgram.lp" />
        </Typography>
      )}
      <Box className={classes.intro}>
        <Box className={classes.icon}>
          <CardGiftcardOutlinedIcon />
        </Box>
        <Box className={classes.points}>
          <Chip label={`${intl.formatMessage(messages.yourPoints, {total: points})}`} />
        </Box>
      </Box>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <Typography variant="h6">
            <FormattedMessage id="ui.LoyaltyProgramDetail.community" defaultMessage="ui.LoyaltyProgramDetail.community" />
          </Typography>
          <Typography component="div">
            <FormattedMessage id="ui.LoyaltyProgramDetail.description" defaultMessage="ui.LoyaltyProgramDetail.description" />
          </Typography>
        </Grid>
        <Grid item xs={12}>
          <Typography>
            <FormattedMessage id="ui.LoyaltyProgramDetail.listTitle" defaultMessage="ui.LoyaltyProgramDetail.listTitle" />
          </Typography>
          <ul style={{columnCount: 2}}>
            <li>
              <FormattedMessage
                id="ui.LoyaltyProgramDetail.list"
                defaultMessage="ui.LoyaltyProgramDetail.list"
                values={{
                  b: (chunks) => <strong>{chunks}</strong>,
                  li: (chunks) => <li>{chunks}</li>
                }}
              />
            </li>
          </ul>
        </Grid>
        <Grid item xs={12} sx={{mb: 2}}>
          <Typography variant="h6">
            <FormattedMessage id="ui.LoyaltyProgramDetail.prizes" defaultMessage="ui.LoyaltyProgramDetail.prizes" />
          </Typography>
          <Typography component="div">
            <FormattedMessage id="ui.LoyaltyProgramDetail.prizesIntro" defaultMessage="ui.LoyaltyProgramDetail.prizesIntro" />
          </Typography>
          <Typography component="div">
            <FormattedMessage id="ui.LoyaltyProgramDetail.prizesContent" defaultMessage="ui.LoyaltyProgramDetail.prizesContent" />
          </Typography>
        </Grid>
      </Grid>
      <Grid container spacing={2} direction="row">
        {prizes.map((prize: SCPrizeType, index) => (
          <Grid item xs={12} sm={6} md={4} key={index}>
            <Card className={classes.card}>
              <CardMedia component="img" height="140" image={prize.image} />
              <Box className={classes.chip}>
                <Chip label={`${intl.formatMessage(messages.points, {total: prize.points})}`} />
              </Box>
              <CardContent>
                <Typography gutterBottom variant="body1" component="div" className={classes.title}>
                  {prize.title}
                </Typography>
                <Typography variant="body2" className={classes.description}>
                  {prize.description}
                </Typography>
              </CardContent>
              <CardActions sx={{justifyContent: 'center'}}>
                <Button size="small" variant="outlined" disabled={requestable} className={classes.action}>
                  {points >= prize.points ? (
                    <FormattedMessage id="ui.LoyaltyProgramDetail.button.request" defaultMessage="ui.LoyaltyProgramDetail.button.request" />
                  ) : (
                    <FormattedMessage id="ui.loyaltyProgram.discover" defaultMessage="ui.loyaltyProgram.discover" />
                  )}
                </Button>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>
    </React.Fragment>
  );

  if (!autoHide) {
    return <Root {...rest}>{d}</Root>;
  }
  return null;
}
