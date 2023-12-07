import React from 'react';
import Widget from '../Widget';
import {styled} from '@mui/material/styles';
import Skeleton from '@mui/material/Skeleton';
import {SCFeedObjectTemplateType} from '../../types/feedObject';
import {CardContent, CardHeader, CardProps, useTheme} from '@mui/material';
import {SCThemeType} from '@selfcommunity/react-core';
import classNames from 'classnames';
import {PREFIX} from './constants';

const classes = {
  root: `${PREFIX}-skeleton-root`,
  media: `${PREFIX}-media`
};

const Root = styled(Widget, {
  name: PREFIX,
  slot: 'SkeletonRoot'
})(() => ({}));

export interface FeedObjectSkeletonProps extends CardProps {
  /**
   * Feed Object template type
   * @default 'preview'
   */
  template?: SCFeedObjectTemplateType;

  /**
   * Other props
   */
  [p: string]: any;
}
/**
 * > API documentation for the Community-JS Feed Object Skeleton component. Learn about the available props and the CSS API.

 #### Import

 ```jsx
 import {FeedObjectSkeleton} from '@selfcommunity/react-ui';
 ```

 #### Component Name

 The name `SCFeedObject-skeleton-root` can be used when providing style overrides in the theme.

 #### CSS

 |Rule Name|Global class|Description|
 |---|---|---|
 |root|.SCFeedObject-skeleton-root|Styles applied to the root element.|
 |media|.SCFeedObject-media|Styles applied to the media element.|
 *
 */
export default function FeedObjectSkeleton(props: {template?: SCFeedObjectTemplateType; [p: string]: any}): JSX.Element {
  const {template = SCFeedObjectTemplateType.SNIPPET, ...rest} = props;
  const theme = useTheme<SCThemeType>();
  let obj;
  if (template === SCFeedObjectTemplateType.PREVIEW || template === SCFeedObjectTemplateType.DETAIL || template === SCFeedObjectTemplateType.SEARCH) {
    obj = (
      <React.Fragment>
        <CardHeader
          avatar={
            <Skeleton
              animation="wave"
              variant="circular"
              width={theme.selfcommunity.user.avatar.sizeMedium}
              height={theme.selfcommunity.user.avatar.sizeMedium}
            />
          }
          title={<Skeleton animation="wave" height={10} width="80%" style={{marginBottom: 6}} />}
          subheader={<Skeleton animation="wave" height={10} width="40%" />}
        />
        <Skeleton animation="wave" variant="rectangular" className={classes.media} />
        <CardContent>
          <React.Fragment>
            <Skeleton animation="wave" height={10} style={{marginBottom: 6}} />
            <Skeleton animation="wave" height={10} width="80%" style={{marginBottom: 6}} />
            <Skeleton animation="wave" height={10} width="60%" />
          </React.Fragment>
        </CardContent>
      </React.Fragment>
    );
  } else {
    obj = (
      <React.Fragment>
        <CardHeader
          avatar={
            <Skeleton
              animation="wave"
              variant="circular"
              width={theme.selfcommunity.user.avatar.sizeMedium}
              height={theme.selfcommunity.user.avatar.sizeMedium}
            />
          }
          title={<Skeleton animation="wave" height={10} width="80%" style={{marginBottom: 6}} />}
          subheader={<Skeleton animation="wave" height={10} width="40%" />}
        />
        <CardContent>
          <React.Fragment>
            <Skeleton animation="wave" height={10} style={{marginBottom: 6}} />
            <Skeleton animation="wave" height={10} width="80%" style={{marginBottom: 6}} />
            <Skeleton animation="wave" height={10} width="60%" style={{marginBottom: 6}} />
          </React.Fragment>
        </CardContent>
      </React.Fragment>
    );
  }

  return (
    <Root className={classNames(classes.root, `${PREFIX}-${template}`)} {...rest}>
      {obj}
    </Root>
  );
}
