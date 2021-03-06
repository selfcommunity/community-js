import React from 'react';
import {styled} from '@mui/material/styles';
import {Typography, Grid, Box, Button, ButtonProps} from '@mui/material';
import {SCIncubatorType} from '@selfcommunity/types';
import {Link, SCContextType, SCRoutes, SCRoutingContextType, useSCContext, useSCFetchIncubator, useSCRouting} from '@selfcommunity/react-core';
import {FormattedMessage} from 'react-intl';
import classNames from 'classnames';
import CardContent from '@mui/material/CardContent';
import IncubatorSkeleton from './Skeleton';
import LinearProgress from '@mui/material/LinearProgress';
import SubscribeButton, {SubscribeButtonProps} from './SubscribeButton';
import {useThemeProps} from '@mui/system';
import Widget from '../Widget';

const PREFIX = 'SCIncubator';

const classes = {
  root: `${PREFIX}-root`,
  name: `${PREFIX}-name`,
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
  [`& .${classes.name}`]: {
    display: 'flex',
    padding: 0
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
    marginLeft: 2,
    marginRight: 2
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
          {!props.subscribed ? null : props.subscribed}
        </Typography>
      </Box>
    </Box>
  );
}

export interface IncubatorProps {
  /**
   * Incubator object id
   * @default null
   */
  incubatorId?: number;
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
   * Props to spread to subscribe button
   * @default {}
   */
  subscribeButtonProps?: SubscribeButtonProps;
  /**
   * Any other properties
   */
  [p: string]: any;
  /**
   * Default props to submit button Input
   * @default {}
   */
  ButtonProps?: ButtonProps;
  /**
   * If true shows extended incubator' slogan in detail view
   * @default false
   */
  detailView?: boolean;
}

/**
 * > API documentation for the Community-JS Incubator component. Learn about the available props and the CSS API.
 *
 * #### Import
 ```jsx
 import {Incubator} from '@selfcommunity/react-ui';
 ```
 #### Component Name
 The name `SCIncubator` can be used when providing style overrides in the theme.

 #### CSS

 |Rule Name|Global class|Description|
 |---|---|---|
 |root|.SCIncubator-root|Styles applied to the root element.|
 |name|.SCIncubator-name|Styles applied to the name section.|
 |slogan|.SCIncubator-slogan|Styles applied to the slogan section.|
 |author|.SCIncubator-author|Styles applied to the author element.|
 |progressBox|.SCIncubator-progress-box|Styles applied to the progress box element.|
 |progressBar|.SCIncubator-progress-bar|Styles applied to the progress bar element.|

 * @param inProps
 */
export default function Incubator(inProps: IncubatorProps): JSX.Element {
  // PROPS
  const props: IncubatorProps = useThemeProps({
    props: inProps,
    name: PREFIX
  });
  const {
    incubatorId = null,
    incubator = null,
    className = null,
    autoHide = false,
    subscribeButtonProps = {},
    ButtonProps = {},
    detailView = false,
    ...rest
  } = props;

  // STATE
  const {scIncubator, setSCIncubator} = useSCFetchIncubator({id: incubatorId, incubator});

  // CONTEXT
  const scContext: SCContextType = useSCContext();
  const scRoutingContext: SCRoutingContextType = useSCRouting();

  /**
   * Renders total votes
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
      {scIncubator ? (
        <>
          <CardContent>
            <Button variant="text" className={classes.name} {...ButtonProps}>
              {scIncubator.name}
            </Button>
            {/*<Link className={classes.name} to={scRoutingContext.url(SCRoutes.INCUBATOR_ROUTE_NAME, incubator)}>*/}
            {/*  {incubator.name}*/}
            {/*</Link>*/}
            <Typography component={'span'}>
              <FormattedMessage defaultMessage="ui.incubator.proposedBy" id="ui.incubator.proposedBy" />
              <Link className={classes.author} to={scRoutingContext.url(SCRoutes.USER_PROFILE_ROUTE_NAME, scIncubator.user)}>
                {scIncubator.user.username}
              </Link>
            </Typography>
            <Typography component={'p'} className={!detailView ? classes.slogan : null}>
              {scIncubator.slogan}
            </Typography>
            <Box className={classes.progressBox}>
              <LinearProgressWithLabel
                className={classes.progressBar}
                value={renderVotes(scIncubator.subscribers_count, scIncubator.subscribers_threshold)}
                subscribed={scIncubator.subscribers_count}
              />
              <Grid container spacing={3}>
                <Grid item xs>
                  <Typography>
                    <FormattedMessage defaultMessage="ui.incubator.progressBar.proposal" id="ui.incubator.progressBar.proposal" />
                  </Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography sx={{display: 'flex', justifyContent: 'center'}}>
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
            <SubscribeButton incubator={scIncubator} {...subscribeButtonProps} />
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
