import React from 'react';
import {styled} from '@mui/material/styles';
import {Grid, Hidden} from '@mui/material';
import {GenericSkeleton} from '../Skeleton';
import classNames from 'classnames';

const PREFIX = 'SCFeedSkeleton';

const classes = {
  root: `${PREFIX}-root`,
  left: `${PREFIX}-left`,
  right: `${PREFIX}-right`
};

const Root = styled(Grid, {
  name: PREFIX,
  slot: 'Root',
  overridesResolver: (props, styles) => styles.root
})(({theme}) => ({}));

interface FeedSkeletonMap {
  /**
   * Skeletons to render into sidebar
   * @default <GenericSkeleton />
   */
  sidebar?: React.ReactElement;
  /**
   * Overrides or extends the styles applied to the component.
   * @default null
   */
  className?: string;
}

export type FeedSkeletonProps = React.PropsWithChildren<FeedSkeletonMap>;

/**
 * > API documentation for the Community-JS Feed Skeleton component. Learn about the available props and the CSS API.

 #### Import

 ```jsx
 import {FeedSkeleton} from '@selfcommunity/react-ui';
 ```

 #### Component Name

 The name `SCFeedSkeleton` can be used when providing style overrides in the theme.

 #### CSS

 |Rule Name|Global class|Description|
 |---|---|---|
 |root|.SCFeedSkeleton-root|Styles applied to the root element.|
 |left|.SCFeedSkeleton-left|Styles applied to the left section.|
 |right|.SCFeedSkeleton-right|Styles applied to the right section.|
 *
 */
export default function FeedSkeleton(props: FeedSkeletonProps): JSX.Element {
  // PROPS
  const {
    children = (
      <React.Fragment>
        <GenericSkeleton sx={{mb: 2}} />
        <GenericSkeleton sx={{mb: 2}} />
        <GenericSkeleton sx={{mb: 2}} />
      </React.Fragment>
    ),
    sidebar = (
      <React.Fragment>
        <GenericSkeleton sx={{mb: 2}} />
        <GenericSkeleton sx={{mb: 2}} />
      </React.Fragment>
    ),
    className
  } = props;
  return (
    <Root container spacing={2} className={classNames(classes.root, className)}>
      <Grid item xs={12} md={7}>
        <div className={classes.left}>{children}</div>
      </Grid>
      <Hidden smDown>
        <Grid item xs={12} md={5}>
          <div className={classes.right}>{sidebar}</div>
        </Grid>
      </Hidden>
    </Root>
  );
}
