import React, {useContext, useEffect, useMemo, useReducer} from 'react';
import {styled} from '@mui/material/styles';
import Card from '@mui/material/Card';
import {http, Endpoints, HttpResponse} from '@selfcommunity/api-services';
import {SCCache, SCThemeType, SCUserContext, SCUserContextType, useIsComponentMountedRef} from '@selfcommunity/react-core';
import {SCPrizeType} from '@selfcommunity/types';
import {Box, Button, CardActions, CardContent, CardMedia, Grid, Typography, useMediaQuery, useTheme} from '@mui/material';
import {FormattedMessage} from 'react-intl';
import Chip from '@mui/material/Chip';
import classNames from 'classnames';
import {useThemeProps} from '@mui/system';
import Skeleton from './Skeleton';
import PointsList from './PointsList';
import {SCOPE_SC_UI} from '../../constants/Errors';
import {CacheStrategies, Logger} from '@selfcommunity/utils';
import HiddenPlaceholder from '../../shared/HiddenPlaceholder';
import {actionToolsTypes, dataToolsReducer, stateToolsInitializer} from '../../utils/tools';
import Widget from '../Widget';

const PREFIX = 'SCLoyaltyProgramDetail';

const classes = {
  root: `${PREFIX}-root`,
  userPoints: `${PREFIX}-user-points`,
  title: `${PREFIX}-title`,
  sectionTitle: `${PREFIX}-section-title`,
  sectionInfo: `${PREFIX}-section-info`,
  pointsSection: `${PREFIX}-points-section`,
  prizeSection: `${PREFIX}-prize-section`,
  card: `${PREFIX}-card`,
  cardContent: `${PREFIX}-card-content`,
  prizePoints: `${PREFIX}-prize-points`,
  actionButton: `${PREFIX}-card-action-button`,
  notRequestable: `${PREFIX}-not-requestable`,
  endSection: `${PREFIX}-end-section`
};

const Root = styled(Box, {
  name: PREFIX,
  slot: 'Root',
  overridesResolver: (props, styles) => styles.root
})(({theme}) => ({}));

export interface LoyaltyProgramDetailProps {
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
   * Caching strategies
   * @default CacheStrategies.CACHE_FIRST
   */
  cacheStrategy?: CacheStrategies;
  /**
   * user loyalty points
   * @default null
   */
  points?: number;
  /**
   * Sets the type card for the component
   * @default true
   */
  requestable?: boolean;
  /**
   * Other props
   */
  [p: string]: any;
}

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
  const {className, autoHide, points, requestable, cacheStrategy = CacheStrategies.NETWORK_ONLY, onHeightChange, onStateChange, ...rest} = props;

  // STATE
  const theme = useTheme<SCThemeType>();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  // REFS
  const isMountedRef = useIsComponentMountedRef();
  // STATE
  const [state, dispatch] = useReducer(
    dataToolsReducer,
    {
      isLoadingNext: true,
      next: `${Endpoints.GetPrizes.url()}?limit=10`,
      cacheKey: SCCache.getToolsStateCacheKey(SCCache.LOYALTY_PROGRAM_DETAIL_PRIZES_TOOLS_STATE_CACHE_PREFIX_KEY),
      cacheStrategy
    },
    stateToolsInitializer
  );
  // CONTEXT
  const scUserContext: SCUserContextType = useContext(SCUserContext);
  // CONST
  const authUserId = scUserContext.user ? scUserContext.user.id : null;
  // HANDLERS
  const handleScrollUp = () => {
    window.scrollTo({left: 0, top: 0, behavior: 'smooth'});
  };
  /**
   * Fetches the list of available prizes
   */
  const fetchPrizes = useMemo(
    () => () => {
      return http.request({
        url: state.next,
        method: Endpoints.GetPrizes.method
      });
    },
    [dispatch, state.next, state.isLoadingNext]
  );
  useEffect(() => {
    if (cacheStrategy === CacheStrategies.NETWORK_ONLY) {
      onStateChange && onStateChange({cacheStrategy: CacheStrategies.CACHE_FIRST});
    }
  }, []);
  /**
   * On mount, fetches prizes
   */
  useEffect(() => {
    let ignore = false;
    if (state.next) {
      fetchPrizes()
        .then((res: HttpResponse<any>) => {
          if (res.status < 300 && isMountedRef.current && !ignore) {
            const data = res.data;
            console.log(data);
            dispatch({
              type: actionToolsTypes.LOAD_NEXT_SUCCESS,
              payload: {
                results: data.results,
                count: data.count,
                next: data.next
              }
            });
          }
        })
        .catch((error) => {
          dispatch({type: actionToolsTypes.LOAD_NEXT_FAILURE, payload: {errorLoadNext: error}});
          Logger.error(SCOPE_SC_UI, error);
        });
      return () => {
        ignore = true;
      };
    }
  }, [authUserId, state.next]);

  /**
   * Renders loyalty program detail skeleton
   */

  if (state.isLoadingNext) {
    return <Skeleton />;
  }

  /**
   * Renders the component (if not hidden by autoHide prop)
   */
  if (!autoHide && authUserId) {
    return (
      <Root className={classNames(classes.root, className)} {...rest}>
        {points && (
          <Typography className={classes.title} variant="h5">
            {!isMobile && <FormattedMessage id="ui.loyaltyProgram.title" defaultMessage="ui.loyaltyProgram.title" />}
            <Chip
              className={classes.userPoints}
              component="span"
              label={
                <FormattedMessage
                  id="ui.loyaltyProgramDetail.userPoints"
                  defaultMessage="ui.loyaltyProgramDetail.userPoints"
                  values={{total: points}}
                />
              }
            />
          </Typography>
        )}
        <Typography className={classes.sectionTitle}>
          <FormattedMessage id="ui.loyaltyProgramDetail.community" defaultMessage="ui.loyaltyProgramDetail.community" />
        </Typography>
        <Typography className={classes.sectionInfo}>
          <FormattedMessage id="ui.loyaltyProgramDetail.description" defaultMessage="ui.loyaltyProgramDetail.description" />
        </Typography>
        <Typography className={classes.sectionTitle}>
          <FormattedMessage id="ui.loyaltyProgramDetail.listTitle" defaultMessage="ui.loyaltyProgramDetail.listTitle" />
        </Typography>
        <PointsList className={classes.pointsSection} />
        <Typography className={classes.sectionTitle}>
          <FormattedMessage id="ui.loyaltyProgramDetail.prizes" defaultMessage="ui.loyaltyProgramDetail.prizes" />
        </Typography>
        <Grid container spacing={!isMobile ? 6 : 0} direction={isMobile ? 'column' : 'row'} className={classes.prizeSection}>
          {state.results.map((prize: SCPrizeType, index) => (
            <>
              <Grid item xs={12} sm={12} md={3} key={index}>
                <Widget className={classes.card}>
                  <CardMedia component="img" image={prize.image} />
                  <Box className={classes.prizePoints}>
                    <Chip
                      className={points <= prize.points ? classes.notRequestable : null}
                      label={
                        <FormattedMessage
                          id="ui.loyaltyProgramDetail.prize.points"
                          defaultMessage="ui.loyaltyProgramDetail.prize.points"
                          values={{total: prize.points}}
                        />
                      }
                    />
                  </Box>
                  <CardContent>
                    <Typography variant="body1" className={classes.sectionTitle}>
                      {prize.title}
                    </Typography>
                    <Typography variant="body2" className={classes.cardContent}>
                      {prize.description}
                    </Typography>
                  </CardContent>
                  <CardActions>
                    {prize.link && (
                      <Button size="medium" color="secondary" href={prize.link} target="_blank" className={classes.actionButton}>
                        <FormattedMessage id="ui.loyaltyProgramDetail.button.more" defaultMessage="ui.loyaltyProgramDetail.button.more" />
                      </Button>
                    )}
                    {((!prize.link && prize.active && points >= prize.points) || (prize.active && points >= prize.points)) && (
                      <Button size="small" variant="outlined" className={classes.actionButton} disabled={!requestable}>
                        <FormattedMessage id="ui.loyaltyProgramDetail.button.request" defaultMessage="ui.loyaltyProgramDetail.button.request" />
                      </Button>
                    )}
                  </CardActions>
                </Widget>
              </Grid>
              {isMobile && state.count <= index + 1 && (
                <Widget className={classes.endSection}>
                  <CardContent>
                    <Typography textAlign={'center'}>
                      <FormattedMessage
                        id="ui.loyaltyProgramDetail.content.end.message"
                        defaultMessage="ui.loyaltyProgramDetail.content.end.message"
                      />
                      <Button color={'secondary'} onClick={handleScrollUp}>
                        <FormattedMessage
                          id="ui.loyaltyProgramDetail.content.end.button"
                          defaultMessage="ui.loyaltyProgramDetail.content.end.button"
                        />
                      </Button>
                    </Typography>
                  </CardContent>
                </Widget>
              )}
            </>
          ))}
        </Grid>
      </Root>
    );
  }
  return <HiddenPlaceholder />;
}
