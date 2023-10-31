import React from 'react';
import {styled} from '@mui/material/styles';
import {Box, Card, CardContent, ListSubheader, Skeleton, useMediaQuery, useTheme} from '@mui/material';
import List from '@mui/material/List';
import PrivateMessageThreadItemSkeleton from '../PrivateMessageThreadItem/Skeleton';
import {SCThemeType} from '@selfcommunity/react-core';
import {PREFIX} from './constants';

const classes = {
  root: `${PREFIX}-skeleton-root`,
  list: `${PREFIX}-list`,
  editor: `${PREFIX}-editor`
};

const Root = styled(Card, {
  name: PREFIX,
  slot: 'SkeletonRoot'
})(() => ({}));
/**
 * > API documentation for the Community-JS PrivateMessage Thread Skeleton component. Learn about the available props and the CSS API.

 #### Import

 ```jsx
 import {PrivateMessageThreadSkeleton} from '@selfcommunity/react-ui';
 ```

 #### Component Name

 The name `SCPrivateMessageThread-skeleton-root` can be used when providing style overrides in the theme.

 #### CSS

 |Rule Name|Global class|Description|
 |---|---|---|
 |root|.SCPrivateMessageThread-skeleton-root|Styles applied to the root element.|
 |list|.SCPrivateMessageThread-list|Styles applied to the list element.|
 *
 */
export default function PrivateMessageThreadSkeleton(props): JSX.Element {
  const theme = useTheme<SCThemeType>();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  return (
    <Root className={classes.root} {...props}>
      <CardContent>
        <List className={classes.list}>
          <ListSubheader sx={{display: 'flex', justifyContent: 'center'}}>
            <Skeleton animation="wave" height={30} width={120} style={{borderRadius: 20}} />
          </ListSubheader>
          {[...Array(isMobile ? 6 : 8)].map((item, index) => (
            <PrivateMessageThreadItemSkeleton index={index} key={index} />
          ))}
        </List>
        <Box className={classes.editor}>
          <Skeleton animation="wave" height={55} width={'100%'} variant={'rectangular'} />
        </Box>
      </CardContent>
    </Root>
  );
}
