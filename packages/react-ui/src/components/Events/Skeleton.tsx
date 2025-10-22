import {PREFIX} from './constants';
import {Box, Grid, GridProps, styled} from '@mui/material';
import classNames from 'classnames';
import {EventSkeleton} from '../Event';

const classes = {
  root: `${PREFIX}-skeleton-root`,
  events: `${PREFIX}-skeleton-events`,
  item: `${PREFIX}-skeleton-item`
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
      <Grid container width="100%" spacing={{xs: 3}} className={classes.events} {...GridContainerComponentProps}>
        {[...Array(eventsNumber)].map((_event, index) => (
          <Grid size={{xs: 12, md: 6}} key={index} {...GridItemComponentProps} className={classes.item}>
            <EventSkeleton {...EventSkeletonProps} />
          </Grid>
        ))}
      </Grid>
    </Root>
  );
}
