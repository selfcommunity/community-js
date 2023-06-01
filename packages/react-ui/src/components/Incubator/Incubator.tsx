import React from 'react';
import {styled} from '@mui/material/styles';
import {Typography, Grid, Box, Button, ButtonProps, CardActions} from '@mui/material';
import {SCIncubatorType} from '@selfcommunity/types';
import {Link, SCRoutes, SCRoutingContextType, useSCFetchIncubator, useSCRouting} from '@selfcommunity/react-core';
import {FormattedMessage} from 'react-intl';
import classNames from 'classnames';
import CardContent from '@mui/material/CardContent';
import Skeleton from './Skeleton';
import LinearProgress, {LinearProgressProps} from '@mui/material/LinearProgress';
import {useThemeProps} from '@mui/system';
import Widget from '../Widget';
import HiddenPlaceholder from '../../shared/HiddenPlaceholder';
import IncubatorSubscribeButton, {IncubatorSubscribeButtonProps} from '../IncubatorSubscribeButton';

const PREFIX = 'SCIncubator';

const classes = {
  root: `${PREFIX}-root`,
  name: `${PREFIX}-name`,
  slogan: `${PREFIX}-slogan`,
  progressBar: `${PREFIX}-progress-bar`
};

const Root = styled(Widget, {
  name: PREFIX,
  slot: 'Root',
  overridesResolver: (props, styles) => styles.root
})(({theme}) => ({}));

function LinearProgressWithLabel({className, ...props}: LinearProgressProps & {value: number; subscribers: number}) {
  return (
    <Box className={className}>
      <LinearProgress variant="determinate" {...props} />
      <Box sx={{position: 'absolute', top: '3px', left: props.value + 2 + '%', transform: 'translateX(-50%)'}}>
        {props.subscribers !== 0 && (
          <Typography variant="body2" color="text.secondary">
            {props.subscribers}
          </Typography>
        )}
      </Box>
      <Grid container spacing={2} className={className}>
        <Grid item xs>
          <Typography>
            <FormattedMessage defaultMessage="ui.incubator.progressBar.proposal" id="ui.incubator.progressBar.proposal" />
          </Typography>
        </Grid>
        <Grid item xs>
          <FormattedMessage defaultMessage="ui.incubator.progressBar.collectingSubscribers" id="ui.incubator.progressBar.collectingSubscribers" />
        </Grid>
        <Grid item xs>
          <Typography align="right">
            <FormattedMessage defaultMessage="ui.incubator.progressBar.approved" id="ui.incubator.progressBar.approved" />
          </Typography>
        </Grid>
      </Grid>
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
  subscribeButtonProps?: IncubatorSubscribeButtonProps;
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
 * <br/>This component renders an incubator item.
 * <br/>Take a look at our <strong>demo</strong> component [here](/docs/sdk/community-js/react-ui/Components/Incubator)
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
  if (!scIncubator) {
    return <Skeleton elevation={0} />;
  }

  /**
   * Renders root object (if not hidden by autoHide prop)
   */
  if (autoHide) {
    return <HiddenPlaceholder />;
  }
  return (
    <Root className={classNames(classes.root, className)} {...rest}>
      <CardContent>
        <Button variant="text" className={classes.name} {...ButtonProps}>
          {scIncubator.name}
        </Button>
        {/*<Link className={classes.name} to={scRoutingContext.url(SCRoutes.INCUBATOR_ROUTE_NAME, incubator)}>*/}
        {/*  {incubator.name}*/}
        {/*</Link>*/}
        <Typography component={'span'}>
          <FormattedMessage
            defaultMessage="ui.incubator.proposedBy"
            id="ui.incubator.proposedBy"
            values={{
              username: <Link to={scRoutingContext.url(SCRoutes.USER_PROFILE_ROUTE_NAME, scIncubator.user)}>{scIncubator.user.username}</Link>
            }}
          />
        </Typography>
        <Typography component={'p'} className={!detailView ? classes.slogan : null}>
          {scIncubator.slogan}
        </Typography>
        <LinearProgressWithLabel
          className={classes.progressBar}
          value={renderVotes(scIncubator.subscribers_count, scIncubator.subscribers_threshold)}
          subscribers={scIncubator.subscribers_count}
        />
      </CardContent>
      <CardActions>
        <IncubatorSubscribeButton incubator={scIncubator} {...subscribeButtonProps} />
      </CardActions>
    </Root>
  );
}
