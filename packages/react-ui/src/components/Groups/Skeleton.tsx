import React from 'react';
import {styled} from '@mui/material/styles';
import {PREFIX} from './constants';
import {Box, Grid} from '@mui/material';
import classNames from 'classnames';
import {GroupSkeleton} from '../Group';

const classes = {
  root: `${PREFIX}-skeleton-root`,
  groups: `${PREFIX}-groups`
};

const Root = styled(Box, {
  name: PREFIX,
  slot: 'SkeletonRoot'
})(() => ({}));

export interface GroupsSkeletonProps {
  /**
   * Overrides or extends the styles applied to the component.
   * @default null
   */
  className?: string;

  /**
   * Overrides or extends the styles applied to the component.
   * @default null
   */
  GroupSkeletonProps?: any;
}

/**
 * > API documentation for the Community-JS Groups Skeleton component. Learn about the available props and the CSS API.

 #### Import

 ```jsx
 import {GroupsSkeleton} from '@selfcommunity/react-ui';
 ```

 #### Component Name

 The name `SCGroups-skeleton-root` can be used when providing style overrides in the theme.

 #### CSS

 |Rule Name|Global class|Description|
 |---|---|---|
 |root|.SCGroups-skeleton-root|Styles applied to the root element.|
 |groups|.SCGroups-skeleton-groups|Styles applied to the group elements.|
 *
 */
export default function GroupsSkeleton(inProps: GroupsSkeletonProps): JSX.Element {
  const {className, GroupSkeletonProps = {}, ...rest} = inProps;

  return (
    <Root className={classNames(classes.root, className)} {...rest}>
      <Grid container spacing={{xs: 3}} className={classes.groups}>
        {[...Array(15)].map((category, index) => (
          <Grid item xs={12} sm={8} md={6} key={index}>
            <GroupSkeleton elevation={0} variant={'outlined'} {...GroupSkeletonProps} />
          </Grid>
        ))}
      </Grid>
    </Root>
  );
}
