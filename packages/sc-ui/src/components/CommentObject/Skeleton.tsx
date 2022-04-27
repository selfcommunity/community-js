import React from 'react';
import Widget from '../Widget';
import {styled} from '@mui/material/styles';
import Skeleton from '@mui/material/Skeleton';
import {CardContent} from '@mui/material';
import BaseItem from '../../shared/BaseItem';

const PREFIX = 'SCCommentObjectSkeleton';

const classes = {
  root: `${PREFIX}-root`,
  avatar: `${PREFIX}-avatar`,
  primaryContent: `${PREFIX}-primary-content`
};

const Root = styled(BaseItem)(({theme}) => ({
  [`&.${classes.root}`]: {
    paddingBottom: theme.spacing(),
    '& > div': {
      alignItems: 'flex-start'
    }
  },
  [`& .${classes.avatar}`]: {
    top: theme.spacing()
  },
  [`& .${classes.primaryContent}`]: {
    marginBottom: theme.spacing()
  }
}));

/**
 * > API documentation for the Community-UI Comment Object Skeleton component. Learn about the available props and the CSS API.

 #### Import

 ```jsx
 import {CommentObjectSkeleton} from '@selfcommunity/ui';
 ```

 #### Component Name

 The name `SCCommentObjectSkeleton` can be used when providing style overrides in the theme.

 #### CSS

 |Rule Name|Global class|Description|
 |---|---|---|
 |root|.SCCommentObjectSkeleton-root|Styles applied to the root element.|
 *
 */
export default function CommentObjectSkeleton(props): JSX.Element {
  const {WidgetProps, ...rest} = props;
  return (
    <Root
      className={classes.root}
      disableTypography
      {...rest}
      image={<Skeleton animation="wave" variant="circular" width={40} height={40} className={classes.avatar} />}
      secondary={
        <>
          <Widget {...WidgetProps}>
            <CardContent>
              <Skeleton animation="wave" height={10} width="80%" className={classes.primaryContent} />
              <Skeleton animation="wave" height={10} width="40%" />
            </CardContent>
          </Widget>
        </>
      }
    />
  );
}
