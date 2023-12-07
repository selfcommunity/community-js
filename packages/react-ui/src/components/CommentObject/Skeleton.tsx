import React from 'react';
import Widget from '../Widget';
import {styled} from '@mui/material/styles';
import Skeleton from '@mui/material/Skeleton';
import {CardContent, useTheme} from '@mui/material';
import BaseItem from '../../shared/BaseItem';
import {SCThemeType} from '@selfcommunity/react-core';
import {PREFIX} from './constants';

const classes = {
  root: `${PREFIX}-skeleton-root`,
  avatar: `${PREFIX}-avatar`,
  primaryContent: `${PREFIX}-primary-content`
};

const Root = styled(BaseItem, {
  name: PREFIX,
  slot: 'SkeletonRoot'
})(() => ({}));

/**
 * > API documentation for the Community-JS Comment Object Skeleton component. Learn about the available props and the CSS API.

 #### Import

 ```jsx
 import {CommentObjectSkeleton} from '@selfcommunity/react-ui';
 ```

 #### Component Name

 The name `SCCommentObject-skeleton-root` can be used when providing style overrides in the theme.

 #### CSS

 |Rule Name|Global class|Description|
 |---|---|---|
 |root|.SCCommentObject-skeleton-root|Styles applied to the root element.|
 *
 */
export default function CommentObjectSkeleton(props): JSX.Element {
  const {WidgetProps, ...rest} = props;
  const theme = useTheme<SCThemeType>();

  return (
    <Root
      className={classes.root}
      disableTypography
      {...rest}
      image={
        <Skeleton
          animation="wave"
          variant="circular"
          width={theme.selfcommunity.user.avatar.sizeMedium}
          height={theme.selfcommunity.user.avatar.sizeMedium}
          className={classes.avatar}
        />
      }
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
