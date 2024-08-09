import React from 'react';
import {Box, Button, Icon} from '@mui/material';
import {styled} from '@mui/material/styles';
import Skeleton from '@mui/material/Skeleton';
import {PREFIX} from './constants';
import classNames from 'classnames';
import BaseItem, {BaseItemProps} from '../../shared/BaseItem';

const classes = {
  root: `${PREFIX}-skeleton-root`,
  image: `${PREFIX}-skeleton-image`,
  action: `${PREFIX}-skeleton-action`
};

const Root = styled(BaseItem, {
  name: PREFIX,
  slot: 'SkeletonRoot'
})(() => ({}));

export interface EventSkeletonProps extends BaseItemProps {
  /**
   * Overrides or extends the styles applied to the component.
   * @default null
   */
  className?: string;
  /**
   * Prop to pass an action to be rendered next to the skeleton
   */
  action?: React.ReactNode;
}

/**
 * > API documentation for the Community-JS Event Skeleton component. Learn about the available props and the CSS API.

 #### Import

 ```jsx
 import {EventSkeleton} from '@selfcommunity/react-ui';
 ```

 #### Component Name

 The name `SCEvent-skeleton-root` can be used when providing style overrides in the theme.

 #### CSS

 |Rule Name|Global class|Description|
 |---|---|---|
 |root|.SCEvent-skeleton-root|Styles applied to the root element.|
 |image|.SCEvent-skeleton-image|Styles applied to the image element.|
 |action|.SCEvent-skeleton-action|Styles applied to action section.|
 *
 */
export default function EventSkeleton(inProps: EventSkeletonProps): JSX.Element {
  const {className, action} = inProps;

  return (
    <Root
      elevation={0}
      className={classNames(classes.root, className)}
      image={
        <Box className={classes.image}>
          <Skeleton animation="wave" variant="rectangular" width={100} height={60} /> <Icon fontSize="large">CalendarIcon</Icon>
        </Box>
      }
      primary={<Skeleton animation="wave" variant="rectangular" height={10} width={100} style={{marginBottom: 12}} />}
      secondary={
        <>
          <Skeleton animation="wave" variant="rectangular" height={10} width={160} style={{marginBottom: 10}} />
          <Skeleton animation="wave" variant="rectangular" height={10} width={90} />
        </>
      }
      actions={
        <>
          {action ?? (
            <Button size="small" variant="outlined" disabled>
              <Skeleton animation="wave" height={10} width={30} style={{marginTop: 5, marginBottom: 5}} />
            </Button>
          )}
        </>
      }
    />
  );
}
