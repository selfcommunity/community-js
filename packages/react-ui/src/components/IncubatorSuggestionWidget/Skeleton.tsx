import React from 'react';
import CardContent from '@mui/material/CardContent';
import List from '@mui/material/List';
import {styled} from '@mui/material/styles';
import {IncubatorSkeleton} from '../Incubator';
import Widget from '../Widget';
import {PREFIX} from './constants';

const classes = {
  root: `${PREFIX}-skeleton-root`,
  list: `${PREFIX}-list`
};

const Root = styled(Widget, {
  name: PREFIX,
  slot: 'SkeletonRoot'
})(() => ({}));

/**
 * > API documentation for the Community-JS Incubator Suggestion Widget Skeleton component. Learn about the available props and the CSS API.

 #### Import

 ```jsx
 import {IncubatorSuggestionWidgetSkeleton} from '@selfcommunity/react-ui';
 ```

 #### Component Name

 The name `SCIncubatorSuggestionWidget-skeleton-root` can be used when providing style overrides in the theme.

 #### CSS

 |Rule Name|Global class|Description|
 |---|---|---|
 |root|.SCIncubatorSuggestionWidget-skeleton-root-root|Styles applied to the root element.|
 |list|.SCIncubatorSuggestionWidget-list|Styles applied to the list element.|
 *
 */
export default function IncubatorSuggestionWidgetSkeleton(props): JSX.Element {
  return (
    <Root className={classes.root} {...props}>
      <CardContent>
        <List className={classes.list}>
          {[...Array(4)].map((category, index) => (
            <IncubatorSkeleton key={index} elevation={0} />
          ))}
        </List>
      </CardContent>
    </Root>
  );
}
