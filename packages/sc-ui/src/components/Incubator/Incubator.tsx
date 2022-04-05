import React, {useState} from 'react';
import {styled} from '@mui/material/styles';
import List from '@mui/material/List';
import Card from '@mui/material/Card';
import {CardProps, Typography, Grid, Box} from '@mui/material';
import {Link, SCContextType, SCIncubatorType, SCRoutes, SCRoutingContextType, useSCContext, useSCRouting} from '@selfcommunity/core';
import {FormattedMessage} from 'react-intl';
import classNames from 'classnames';
import CardContent from '@mui/material/CardContent';
import IncubatorSkeleton from './Skeleton';
import LinearProgress from '@mui/material/LinearProgress';
import SubscribeButton, {SubscribeButtonProps} from './SubscribeButton';
import useThemeProps from '@mui/material/styles/useThemeProps';
import Widget from '../Widget';

const PREFIX = 'SCIncubator';

const classes = {
  root: `${PREFIX}-root`,
  name: `${PREFIX}-name`,
  info: `${PREFIX}-info`,
  slogan: `${PREFIX}-slogan`,
  author: `${PREFIX}-author`,
  progressBox: `${PREFIX}-progress-box`,
  progressBar: `${PREFIX}-progress-bar`
};

const Root = styled(Widget, {
  name: PREFIX,
  slot: 'Root',
  overridesResolver: (props, styles) => styles.root
})(({theme}) => ({
  maxWidth: 700,
  [`& .${classes.name}`]: {
    marginBottom: 8
  },
  [`& .${classes.progressBar}`]: {
    marginTop: 8,
    height: '25px'
  },
  [`& .${classes.slogan}`]: {
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis'
  },
  [`& .${classes.author}`]: {
    display: 'flex'
  }
}));

function LinearProgressWithLabel(props) {
  return (
    <Box sx={{position: 'relative'}}>
      <Box sx={{width: '100%', mr: 1}}>
        <LinearProgress variant="determinate" {...props} />
      </Box>
      <Box sx={{position: 'absolute', top: '3px', left: props.value + 2 + '%', transform: 'translateX(-50%)'}}>
        <Typography variant="body2" color="text.secondary">
          {props.subscribed}
        </Typography>
      </Box>
    </Box>
  );
}

export interface IncubatorProps extends Pick<CardProps, Exclude<keyof CardProps, 'id'>> {
  /**
   * Id of Incubator object
   * @default null
   */
  id?: number;
  /**
   * Incubator object
   * @default null
   */
  incubator?: SCIncubatorType;
  /**
   * Overrides or extends the styles applied to the component.
   * @default null
   */
  className?: string;
  /**
   * Hides this component
   * @default false
   */
  autoHide?: boolean;
  /**
   * Props to spread to subscribe/unsubscribe button
   * @default {}
   */
  subscribeButtonProps?: SubscribeButtonProps;
  /**
   * Any other properties
   */
  [p: string]: any;
}

/**
 * > API documentation for the Community-UI Incubator component. Learn about the available props and the CSS API.
 *
 * #### Import
 ```jsx
 import {Incubator} from '@selfcommunity/ui';
 ```
 #### Component Name
 The name `SCIncubator` can be used when providing style overrides in the theme.

 #### CSS

 |Rule Name|Global class|Description|
 |---|---|---|
 |root|.SCIncubator-root|Styles applied to the root element.|
 |title|.SCIncubator-title|Styles applied to the title element.|
 |actions|.SCIncubator-actions|Styles applied to action section.|

 * @param inProps
 */
export default function Incubator(inProps: IncubatorProps): JSX.Element {
  // PROPS
  const props: IncubatorProps = useThemeProps({
    props: inProps,
    name: PREFIX
  });
  const {id = null, incubator = null, className = null, autoHide = false, subscribeButtonProps = {}, ...rest} = props;

  // STATE
  const [count, setCount] = useState<number>(incubator ? incubator.subscribers_count : null);

  // CONTEXT
  const scContext: SCContextType = useSCContext();
  const scRoutingContext: SCRoutingContextType = useSCRouting();

  /**
   * Renders total votes in percentage
   */
  function renderVotes(voteCount, totalVotes) {
    if (totalVotes === 0) {
      return 0;
    }
    return (100 * voteCount) / totalVotes;
  }

  /**
   * Renders Incubator object
   */
  const i = (
    <React.Fragment>
      {incubator ? (
        <>
          <CardContent>
            <Typography className={classes.name} variant={'h5'} align="left">
              {incubator.name}
            </Typography>
            <Grid container className={classes.info}>
              <Grid item xs="auto" className={classes.author}>
                <Typography sx={{mr: 1}}>
                  <FormattedMessage defaultMessage="ui.incubator.proposedBy" id="ui.incubator.proposedBy" />
                </Typography>
                <Typography component={Link} to={scRoutingContext.url(SCRoutes.USER_PROFILE_ROUTE_NAME, incubator.user)}>
                  {incubator.user.username} -
                </Typography>
              </Grid>
              <Grid item xs="auto">
                <Typography className={classes.slogan} component={Link} to={scRoutingContext.url(SCRoutes.INCUBATOR_ROUTE_NAME, incubator)}>
                  {incubator.slogan}
                </Typography>
              </Grid>
            </Grid>
            <Box className={classes.progressBox}>
              <LinearProgressWithLabel
                className={classes.progressBar}
                value={renderVotes(incubator.subscribers_count, incubator.subscribers_threshold)}
                subscribed={count}
              />
              <Grid container spacing={3}>
                <Grid item xs>
                  <Typography>
                    <FormattedMessage defaultMessage="ui.incubator.progressBar.proposal" id="ui.incubator.progressBar.proposal" />
                  </Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography>
                    <FormattedMessage
                      defaultMessage="ui.incubator.progressBar.collectingSubscribers"
                      id="ui.incubator.progressBar.collectingSubscribers"
                    />
                  </Typography>
                </Grid>
                <Grid item xs>
                  <Typography align="right">
                    <FormattedMessage defaultMessage="ui.incubator.progressBar.approved" id="ui.incubator.progressBar.approved" />
                  </Typography>
                </Grid>
              </Grid>
            </Box>
            <SubscribeButton incubator={incubator} {...subscribeButtonProps} />
          </CardContent>
        </>
      ) : (
        <IncubatorSkeleton elevation={0} />
      )}
    </React.Fragment>
  );

  /**
   * Renders root object (if not hidden by autoHide prop)
   */
  if (!autoHide) {
    return (
      <Root className={classNames(classes.root, className)} {...rest}>
        {i}
      </Root>
    );
  }
  return null;
}
