import React from 'react';
import Widget from '../Widget';
import {CardContent, useTheme, Skeleton, styled} from '@mui/material';
import BaseItem from '../../shared/BaseItem';
import {SCThemeType} from '@selfcommunity/react-core';
import {PREFIX} from './constants';

const classes = {
  root: `${PREFIX}-skeleton-root`,
  avatar: `${PREFIX}-avatar`,
  primaryContent: `${PREFIX}-primary-content`,
  secondaryContent: `${PREFIX}-secondary-content`
};

const Root = styled(BaseItem, {
  name: PREFIX,
  slot: 'SkeletonRoot'
})(() => ({}));

/**
 * > API documentation for the Community-JS Lesson Comment Object Skeleton component. Learn about the available props and the CSS API.

 #### Import

 ```jsx
 import {LessonCommentObjectSkeleton} from '@selfcommunity/react-ui';
 ```

 #### Component Name

 The name `SCLessonCommentObject-skeleton-root` can be used when providing style overrides in the theme.

 #### CSS

 |Rule Name|Global class|Description|
 |---|---|---|
 |root|.SCLessonCommentObject-skeleton-root|Styles applied to the root element.|
 *
 */
export default function LessonCommentObjectSkeleton(props): JSX.Element {
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
      primary={<Skeleton animation="wave" height={10} width="25%" className={classes.primaryContent} />}
      secondary={
        <>
          <Widget {...WidgetProps}>
            <CardContent className={classes.secondaryContent}>
              <Skeleton animation="wave" height={10} width="80%" />
              <Skeleton animation="wave" height={10} width="70%" />
              <Skeleton animation="wave" height={10} width="60%" />
            </CardContent>
          </Widget>
        </>
      }
    />
  );
}
