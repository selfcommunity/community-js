import React from 'react';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import {styled} from '@mui/material/styles';
import Skeleton from '@mui/material/Skeleton';
import {useMediaQuery, useTheme} from '@mui/material';
import {SCThemeType} from '@selfcommunity/react-core';

const PREFIX = 'SCPrivateMessageThreadItemSkeleton';

const classes = {
  root: `${PREFIX}-root`,
  list: `${PREFIX}-list`
};

const Root = styled(ListItem)(({theme}) => ({}));
/**
 * > API documentation for the Community-JS PrivateMessageThreadItem Skeleton component. Learn about the available props and the CSS API.

 #### Import

 ```jsx
 import {PrivateMessageThreadItemSkeleton} from '@selfcommunity/react-ui';
 ```

 #### Component Name

 The name `SCPrivateMessageThreadItemSkeleton` can be used when providing style overrides in the theme.

 #### CSS

 |Rule Name|Global class|Description|
 |---|---|---|
 |root|.SCPrivateMessageThreadItemSkeleton-root|Styles applied to the root element.|
 |list|.SCPrivateMessageThreadItemSkeleton-list|Styles applied to the list element.|
 *
 */
export default function PrivateMessageThreadItemSkeleton(props): JSX.Element {
  const theme = useTheme<SCThemeType>();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  return (
    <Root className={classes.root} {...props}>
      <ListItemText
        sx={{display: 'flex', justifyContent: props.index % 2 === 0 ? 'flex-start' : 'flex-end'}}
        primary={<Skeleton animation="wave" height={100} width={isMobile ? 200 : 300} style={{borderRadius: theme.shape.borderRadius}} />}
      />
    </Root>
  );
}
