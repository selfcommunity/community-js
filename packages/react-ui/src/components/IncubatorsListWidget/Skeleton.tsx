import React from 'react';
import CardContent from '@mui/material/CardContent';
import List from '@mui/material/List';
import {styled} from '@mui/material/styles';
import {IncubatorSkeleton} from '../Incubator';
import Widget from '../Widget';

const PREFIX = 'SCIncubatorsListWidgetSkeleton';

const classes = {
  root: `${PREFIX}-root`,
  list: `${PREFIX}-list`
};

const Root = styled(Widget)(({theme}) => ({}));

/**
 * > API documentation for the Community-JS Incubators List Skeleton component. Learn about the available props and the CSS API.

 #### Import

 ```jsx
 import {IncubatorsListWidgetSkeleton} from '@selfcommunity/react-ui';
 ```

 #### Component Name

 The name `SCIncubatorsListWidgetSkeleton` can be used when providing style overrides in the theme.

 #### CSS

 |Rule Name|Global class|Description|
 |---|---|---|
 |root|.SCIncubatorsListWidgetSkeleton-root|Styles applied to the root element.|
 |list|.SCIncubatorsListWidgetSkeleton-list|Styles applied to the list element.|
 *
 */
export default function IncubatorsListWidgetSkeleton(props): JSX.Element {
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
