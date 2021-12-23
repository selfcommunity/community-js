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
    id: 'ui.loyaltyProgramDialog.points',
    defaultMessage: 'ui.loyaltyProgramDialog.points'
  },
  yourPoints: {
    id: 'ui.loyaltyProgramDialog.ypoints',
    defaultMessage: 'ui.loyaltyProgramDialog.ypoints'
  }
});

const PREFIX = 'SCLoyaltyProgramCard';

const classes = {
  header: `${PREFIX}-header`,
  icon: `${PREFIX}-icon`,
  card: `${PREFIX}-card`,
  title: `${PREFIX}-title`,
  points: `${PREFIX}-points`,
  description: `${PREFIX}-description`,
  action: `${PREFIX}-action`
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
    '& .MuiButton-root': {
      '& .MuiButtonBase-root.Mui-disabled': {
        pointerEvents: 'all',
        cursor: 'not-allowed'
      }
    }
  }
}));

export default function LoyaltyProgramCard({
  points = null,
  requestable = true,
  ...rest
}: {
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

  return (
    <Root {...rest}>
      <Typography component="h3" align="left" className={classes.header}>
        <FormattedMessage id="ui.loyaltyProgram.lp" defaultMessage="ui.loyaltyProgram.lp" />
      </Typography>
      <Box sx={{display: 'flex', alignItems: 'center', marginBottom: '20px'}}>
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
            <FormattedMessage id="ui.loyaltyProgramDialog.community" defaultMessage="ui.loyaltyProgramDialog.community" />
          </Typography>
          <Typography component="div">
            <FormattedMessage id="ui.loyaltyProgramDialog.description" defaultMessage="ui.loyaltyProgramDialog.description" />
          </Typography>
        </Grid>
        <Grid item xs={12}>
          <Typography>
            <FormattedMessage id="ui.loyaltyProgramDialog.listTitle" defaultMessage="ui.loyaltyProgramDialog.listTitle" />
          </Typography>
          <ul style={{columnCount: 2}}>
            <li>
              <FormattedMessage
                id="ui.loyaltyProgramDialog.list.1"
                defaultMessage="ui.loyaltyProgramDialog.list.1"
                values={{
                  b: (chunks) => <strong>{chunks}</strong>
                }}
              />
            </li>
            <li>
              <FormattedMessage
                id="ui.loyaltyProgramDialog.list.2"
                defaultMessage="ui.loyaltyProgramDialog.list.2"
                values={{
                  b: (chunks) => <strong>{chunks}</strong>
                }}
              />
            </li>
            <li>
              <FormattedMessage
                id="ui.loyaltyProgramDialog.list.3"
                defaultMessage="ui.loyaltyProgramDialog.list.3"
                values={{
                  b: (chunks) => <strong>{chunks}</strong>
                }}
              />
            </li>
            <li>
              <FormattedMessage
                id="ui.loyaltyProgramDialog.list.4"
                defaultMessage="ui.loyaltyProgramDialog.list.4"
                values={{
                  b: (chunks) => <strong>{chunks}</strong>
                }}
              />
            </li>
            <li>
              <FormattedMessage
                id="ui.loyaltyProgramDialog.list.5"
                defaultMessage="ui.loyaltyProgramDialog.list.5"
                values={{
                  b: (chunks) => <strong>{chunks}</strong>
                }}
              />
            </li>
            <li>
              <FormattedMessage
                id="ui.loyaltyProgramDialog.list.6"
                defaultMessage="ui.loyaltyProgramDialog.list.6"
                values={{
                  b: (chunks) => <strong>{chunks}</strong>
                }}
              />
            </li>
            <li>
              <FormattedMessage
                id="ui.loyaltyProgramDialog.list.7"
                defaultMessage="ui.loyaltyProgramDialog.list.7"
                values={{
                  b: (chunks) => <strong>{chunks}</strong>
                }}
              />
            </li>
            <li>
              <FormattedMessage
                id="ui.loyaltyProgramDialog.list.8"
                defaultMessage="ui.loyaltyProgramDialog.list.8"
                values={{
                  b: (chunks) => <strong>{chunks}</strong>
                }}
              />
            </li>
          </ul>
        </Grid>
        <Grid item xs={12} sx={{mb: 2}}>
          <Typography variant="h6">
            <FormattedMessage id="ui.loyaltyProgramDialog.prizes" defaultMessage="ui.loyaltyProgramDialog.prizes" />
          </Typography>
          <Typography component="div">
            <FormattedMessage id="ui.loyaltyProgramDialog.prizesIntro" defaultMessage="ui.loyaltyProgramDialog.prizesIntro" />
          </Typography>
          <Typography component="div">
            <FormattedMessage id="ui.loyaltyProgramDialog.prizesContent" defaultMessage="ui.loyaltyProgramDialog.prizesContent" />
          </Typography>
        </Grid>
      </Grid>
      <Grid container spacing={2} direction="row">
        {prizes.map((prize: SCPrizeType, index) => (
          <Grid item xs={12} sm={6} md={4} key={index}>
            <Card className={classes.card}>
              <CardMedia component="img" height="140" image={prize.image} />
              <Box sx={{display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
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
              <CardActions sx={{justifyContent: 'center'}} className={classes.action}>
                <Button size="small" variant="outlined" disabled={requestable}>
                  {points >= prize.points ? (
                    <FormattedMessage id="ui.loyaltyProgramDialog.button.request" defaultMessage="ui.loyaltyProgramDialog.button.request" />
                  ) : (
                    <FormattedMessage id="ui.loyaltyProgram.discover" defaultMessage="ui.loyaltyProgram.discover" />
                  )}
                </Button>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Root>
  );
}
