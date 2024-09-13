import React from 'react';
import {styled} from '@mui/material/styles';
import {PREFIX} from './constants';
import {Box, Grid, GridProps} from '@mui/material';
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
   * Props spread to grid container
   * @default {}
   */
  GridContainerComponentProps?: Pick<GridProps, Exclude<keyof GridProps, 'container' | 'component' | 'children' | 'item' | 'classes'>>;
  /**
   * Props spread to single grid item
   * @default {}
   */
  GridItemComponentProps?: Pick<GridProps, Exclude<keyof GridProps, 'container' | 'component' | 'children' | 'item' | 'classes'>>;

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
  const {className, EventSkeletonProps = {}, eventsNumber = 8, GridContainerComponentProps = {}, GridItemComponentProps = {}, ...rest} = inProps;
  return (
    <Root className={classNames(classes.root, className)} {...rest}>
      <Grid container spacing={{xs: 3}} className={classes.events} {...GridContainerComponentProps}>
        {[...Array(eventsNumber)].map((event, index) => (
          <Grid item xs={12} sm={12} md={6} key={index} {...GridItemComponentProps}>
            <EventSkeleton {...EventSkeletonProps} />
          </Grid>
        ))}
      </Grid>
    </Root>
  );
}
