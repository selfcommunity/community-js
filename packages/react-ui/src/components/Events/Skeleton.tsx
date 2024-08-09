import React from 'react';
import {styled} from '@mui/material/styles';
import {PREFIX} from './constants';
import {Box, Grid} from '@mui/material';
import classNames from 'classnames';
import {EventSkeleton} from '../Event';

const classes = {
  root: `${PREFIX}-skeleton-root`,
  events: `${PREFIX}-events`
};

const Root = styled(Box, {
  name: PREFIX,
  slot: 'SkeletonRoot'
})(() => ({}));

export interface EventsSkeletonProps {
  /**
   * Overrides or extends the styles applied to the component.
   * @default null
   */
  className?: string;

  /**
   * Overrides or extends the styles applied to the component.
   * @default null
   */
  EventSkeletonProps?: any;

  /**
   * @default 20
   */
  eventsNumber?: number;
}

/**
 * > API documentation for the Community-JS Groups Skeleton component. Learn about the available props and the CSS API.

 #### Import

 ```jsx
 import {EventsSkeleton} from '@selfcommunity/react-ui';
 ```

 #### Component Name

 The name `SCEvents-skeleton-root` can be used when providing style overrides in the theme.

 #### CSS

 |Rule Name|Global class|Description|
 |---|---|---|
 |root|.SCEvents-skeleton-root|Styles applied to the root element.|
 |events|.SCEvents-skeleton-events|Styles applied to the group elements.|
 *
 */
export default function EventsSkeleton(inProps: EventsSkeletonProps): JSX.Element {
  const {className, EventSkeletonProps = {}, eventsNumber = 8, ...rest} = inProps;

  return (
    <Root className={classNames(classes.root, className)} {...rest}>
      <Grid container spacing={{xs: 3}} className={classes.events}>
        {[...Array(eventsNumber)].map((event, index) => (
          <Grid item xs={12} sm={8} md={6} key={index}>
            <EventSkeleton {...EventSkeletonProps} />
          </Grid>
        ))}
      </Grid>
    </Root>
  );
}
