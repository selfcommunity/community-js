import React, {useContext, useEffect, useMemo, useState} from 'react';
import {styled} from '@mui/material/styles';
import {http, Endpoints, HttpResponse, UserService, LoyaltyService, SCPaginatedResponse} from '@selfcommunity/api-services';
import {SCThemeType, SCUserContext, SCUserContextType} from '@selfcommunity/react-core';
import {SCPrizeType} from '@selfcommunity/types';
import {Box, Button, Card, CardActions, CardContent, CardMedia, Grid, Typography, useMediaQuery, useTheme} from '@mui/material';
import {FormattedMessage} from 'react-intl';
import Chip from '@mui/material/Chip';
import classNames from 'classnames';
import {useThemeProps} from '@mui/system';
import Skeleton from './Skeleton';
import PrizeItemSkeleton from './PrizeItemSkeleton';
import PointsList from './PointsList';
import {useSnackbar} from 'notistack';
import {InfiniteScroll, ConfirmDialog} from '@selfcommunity/react-ui';
import {PREFIX} from './constants';

const classes = {
  root: `${PREFIX}-root`,
  userPoints: `${PREFIX}-user-points`,
  title: `${PREFIX}-title`,
  sectionTitle: `${PREFIX}-section-title`,
  sectionInfo: `${PREFIX}-section-info`,
  pointsSection: `${PREFIX}-points-section`,
  prizeSection: `${PREFIX}-prize-section`,
  card: `${PREFIX}-card`,
  cardTitle: `${PREFIX}-card-title`,
  cardContent: `${PREFIX}-card-content`,
  prizePoints: `${PREFIX}-prize-points`,
  actionButton: `${PREFIX}-card-action-button`,
  notRequestable: `${PREFIX}-not-requestable`,
  endMessage: `${PREFIX}-end-message`
};

const Root = styled(Box, {
  name: PREFIX,
  slot: 'Root'
})(() => ({}));

export interface LoyaltyProgramDetailProps {
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
 * > API documentation for the Community-JS Loyalty Program Detail Template. Learn about the available props and the CSS API.
 *
 *
 * This component renders the loyalty program detail template.
 * Take a look at our <strong>demo</strong> component [here](/docs/sdk/community-js/react-templates/Components/LoyaltyProgramDetail)

 #### Import

 ```jsx
 import {LoyaltyProgramDetail} from '@selfcommunity/react-templates';
 ```

 #### Component Name

 The name `SCLoyaltyProgramDetailTemplate` can be used when providing style overrides in the theme.


 #### CSS

 |Rule Name|Global class|Description|
 |---|---|---|
 |root|.SCLoyaltyProgramDetailTemplate-root|Styles applied to the root element.|
 |userPoints|.SCLoyaltyProgramDetailTemplate-user-points|Styles applied to the chip element.|
 |title|.SCLoyaltyProgramDetailTemplate-title|Styles applied to the title element.|
 |sectionTitle|.SCLoyaltyProgramDetailTemplate-section-title|Styles applied to the section title element.|
 |sectionInfo|.SCLoyaltyProgramDetailTemplate-section-info|Styles applied to the section info element.|
 |pointsSection|.SCLoyaltyProgramDetailTemplate-points-section|Styles applied to the points section.|
 |prizeSection|.SCLoyaltyProgramDetailTemplate-prize-section|Styles applied to the prize section.|
 |card|.SCLoyaltyProgramDetailTemplate-card|Styles applied to the card elements.|
 |cardTitle|.SCLoyaltyProgramDetailTemplate-card-title|Styles applied to the card title element.|
 |cardContent|.SCLoyaltyProgramDetailTemplate-card-content|Styles applied to the card content section.|
 |prizePoints|.SCLoyaltyProgramDetailTemplate-prize-points|Styles applied to the prize points element.|
 |actionButton|.SCLoyaltyProgramDetailTemplate-action-button|Styles applied to the action button element.|
 |notRequestable|.SCLoyaltyProgramDetailTemplate-not-requestable|Styles applied to elements that are not requestable.|
 |endMessage|.SCLoyaltyProgramDetailTemplate-end-message|Styles applied to the infinity scroll final section.|
/**
 *
 * @param inProps
 * @constructor
 */
export default function LoyaltyProgramDetail(inProps: LoyaltyProgramDetailProps): JSX.Element {
  // PROPS
  const props: LoyaltyProgramDetailProps = useThemeProps({
    props: inProps,
    name: PREFIX
  });
  const {className, ...rest} = props;

  // STATE
  const theme = useTheme<SCThemeType>();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  // STATE
  const [loading, setLoading] = useState<boolean>(true);
  const [next, setNext] = useState<string>(null);
  const [prizes, setPrizes] = useState<SCPrizeType[]>([]);
  const [points, setPoints] = useState<number>(0);
  const [open, setOpen] = useState<boolean>(false);
  const [prizeRequested, setPrizeRequested] = useState<number>(null);
  const {enqueueSnackbar, closeSnackbar} = useSnackbar();
  // CONTEXT
  const scUserContext: SCUserContextType = useContext(SCUserContext);
  // CONST
  const authUserId = scUserContext.user ? scUserContext.user.id : null;
  // HANDLERS
  const handleScrollUp = () => {
    window.scrollTo({left: 0, top: 0, behavior: 'smooth'});
  };

  const requestPrize = (id: number) => {
    return LoyaltyService.createPrizeRequest(id)
      .then((data) => {
        setPoints((prev) => prev - data.prize_points);
        setOpen(false);
        let _snackBar = enqueueSnackbar(
          <FormattedMessage
            id="templates.loyaltyProgramDetail.prize.request.success"
            defaultMessage="templates.loyaltyProgramDetail.prize.request.success"
          />,
          {
            variant: 'success',
            autoHideDuration: 3000,
            SnackbarProps: {
              onClick: () => {
                closeSnackbar(_snackBar);
              }
            }
          }
        );
      })
      .catch((error) => {
        setOpen(false);
        let _snackBar = enqueueSnackbar(
          <FormattedMessage
            id="templates.loyaltyProgramDetail.prize.request.error"
            defaultMessage="templates.loyaltyProgramDetail.prize.request.error"
          />,
          {
            variant: 'error',
            autoHideDuration: 3000,
            SnackbarProps: {
              onClick: () => {
                closeSnackbar(_snackBar);
              }
            }
          }
        );
      });
  };

  const handleOpenAlert = (id) => {
    setPrizeRequested(id);
    setOpen(true);
  };

  const handleNext = useMemo(
    () => () => {
      if (!next) {
        return;
      }
      return http
        .request({
          url: next,
          method: Endpoints.GetPrizes.method
        })
        .then((res: HttpResponse<any>) => {
          setPrizes([...prizes, ...res.data.results]);
          setNext(res.data.next);
        })
        .catch((error) => console.log(error))
        .then(() => setLoading(false));
    },
    [next]
  );

  const fetchUserPoints = () => {
    UserService.getUserLoyaltyPoints(authUserId)
      .then((data) => {
        setPoints(data.points);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const fetchPrizes = () => {
    LoyaltyService.getPrizes({limit: 8}).then((res: SCPaginatedResponse<SCPrizeType>) => {
      setPrizes(res.results);
      setNext(res.next);
      setLoading(false);
    });
  };

  /**
   * On mount, fetches loyalty prizes and user points
   */
  useEffect(() => {
    if (authUserId) {
      fetchUserPoints();
      fetchPrizes();
    }
  }, [authUserId]);

  /**
   * Renders the component (if not hidden by autoHide prop)
   */
  if (!authUserId) {
    return null;
  }
  if (loading) {
    return <Skeleton />;
  }
  return (
    <Root className={classNames(classes.root, className)} {...rest}>
      {points !== 0 && (
        <Typography className={classes.title} variant="h5">
          {!isMobile && <FormattedMessage id="ui.loyaltyProgramWidget.title" defaultMessage="ui.loyaltyProgramWidget.title" />}
          <Chip
            className={classes.userPoints}
            component="span"
            label={
              <FormattedMessage
                id="templates.loyaltyProgramDetail.userPoints"
                defaultMessage="templates.loyaltyProgramDetail.userPoints"
                values={{total: points}}
              />
            }
          />
        </Typography>
      )}
      <Typography className={classes.sectionTitle}>
        <FormattedMessage id="templates.loyaltyProgramDetail.community" defaultMessage="templates.loyaltyProgramDetail.community" />
      </Typography>
      <Typography className={classes.sectionInfo}>
        <FormattedMessage id="templates.loyaltyProgramDetail.description" defaultMessage="templates.loyaltyProgramDetail.description" />
      </Typography>
      <Typography className={classes.sectionTitle}>
        <FormattedMessage id="templates.loyaltyProgramDetail.listTitle" defaultMessage="templates.loyaltyProgramDetail.listTitle" />
      </Typography>
      <PointsList className={classes.pointsSection} />
      {prizes.length !== 0 && (
        <Typography className={classes.sectionTitle}>
          <FormattedMessage id="templates.loyaltyProgramDetail.prizes" defaultMessage="templates.loyaltyProgramDetail.prizes" />
        </Typography>
      )}
      <InfiniteScroll
        dataLength={prizes.length}
        next={handleNext}
        hasMoreNext={Boolean(next)}
        loaderNext={<PrizeItemSkeleton />}
        endMessage={
          <>
            {prizes.length !== 0 ? (
              <Typography className={classes.endMessage}>
                <FormattedMessage
                  id="templates.loyaltyProgramDetail.content.end.message"
                  defaultMessage="templates.loyaltyProgramDetail.content.end.message"
                />
                <Button color={'secondary'} onClick={handleScrollUp}>
                  <FormattedMessage
                    id="templates.loyaltyProgramDetail.content.end.button"
                    defaultMessage="templates.loyaltyProgramDetail.content.end.button"
                  />
                </Button>
              </Typography>
            ) : null}
          </>
        }>
        <Grid container spacing={!isMobile ? 3 : 0} direction={isMobile ? 'column' : 'row'} className={classes.prizeSection}>
          {prizes.map((prize: SCPrizeType) => (
            <Grid item xs={12} sm={12} md={6} lg={4} xl={3} key={prize.id}>
              <Card className={classes.card}>
                <CardMedia component="img" image={prize.image} />
                <Box className={classes.prizePoints}>
                  <Chip
                    className={points <= prize.points ? classes.notRequestable : null}
                    label={
                      <FormattedMessage
                        id="templates.loyaltyProgramDetail.prize.points"
                        defaultMessage="templates.loyaltyProgramDetail.prize.points"
                        values={{total: prize.points}}
                      />
                    }
                  />
                </Box>
                <CardContent>
                  <Typography variant="body1" className={classes.cardTitle}>
                    {prize.title}
                  </Typography>
                  <Typography variant="body2" className={classes.cardContent}>
                    {prize.description}
                  </Typography>
                </CardContent>
                <CardActions>
                  {prize.link && (
                    <Button size="medium" color="secondary" href={prize.link} target="_blank" className={classes.actionButton}>
                      <FormattedMessage id="templates.loyaltyProgramDetail.button.more" defaultMessage="templates.loyaltyProgramDetail.button.more" />
                    </Button>
                  )}
                  {((!prize.link && prize.active && points >= prize.points) || (prize.active && points >= prize.points)) && (
                    <Button
                      size="small"
                      variant="outlined"
                      className={classes.actionButton}
                      disabled={points < prize.points}
                      onClick={() => handleOpenAlert(prize.id)}>
                      <FormattedMessage
                        id="templates.loyaltyProgramDetail.button.request"
                        defaultMessage="templates.loyaltyProgramDetail.button.request"
                      />
                    </Button>
                  )}
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>
      </InfiniteScroll>
      {open && (
        <ConfirmDialog
          open={open}
          title={<FormattedMessage id="templates.loyaltyProgramDetail.dialog.msg" defaultMessage="templates.loyaltyProgramDetail.dialog.msg" />}
          btnConfirm={
            <FormattedMessage id="templates.loyaltyProgramDetail.dialog.confirm" defaultMessage="templates.loyaltyProgramDetail.dialog.confirm" />
          }
          onConfirm={() => requestPrize(prizeRequested)}
          onClose={() => setOpen(false)}
        />
      )}
    </Root>
  );
}
