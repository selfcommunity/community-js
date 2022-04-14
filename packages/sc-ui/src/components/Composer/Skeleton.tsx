import React from 'react';
import {styled} from '@mui/material/styles';
import Skeleton from '@mui/material/Skeleton';
import {Box, DialogActions, DialogContent, DialogTitle} from '@mui/material';

const PREFIX = 'SCComposerSkeleton';

const classes = {
  root: `${PREFIX}-root`,
  title: `${PREFIX}-title`,
  avatar: `${PREFIX}-avatar`,
  content: `${PREFIX}-content`,
  actions: `${PREFIX}-actions`
};

const Root = styled(Box, {
  name: PREFIX,
  slot: 'Root',
  overridesResolver: (props, styles) => styles.root
})(({theme}) => ({
  [`& .${classes.title}`]: {
    borderBottom: '1px solid #D1D1D1',
    padding: theme.spacing(),
    paddingLeft: theme.spacing(2),
    paddingRight: theme.spacing(2),
    display: 'flex',
    flexDirection: 'row',
    flexWrap: 'nowrap',
    justifyContent: 'space-between',
    alignItems: 'center',
    '& > div': {
      flex: 1,
      textAlign: 'center'
    },
    '& > div:first-of-type': {
      textAlign: 'left'
    },
    '& > div:last-of-type': {
      textAlign: 'right',
      display: 'block'
    }
  },
  [`& .${classes.avatar}`]: {
    width: theme.spacing(4),
    height: theme.spacing(4),
    display: 'inline-block'
  },
  [`& .${classes.content}`]: {
    paddingLeft: 0,
    paddingRight: 0,
    paddingBottom: 0,
    position: 'relative',
    overflowY: 'visible'
  },
  [`& .${classes.actions}`]: {
    margin: 0,
    borderTop: '1px solid #D1D1D1',
    padding: theme.spacing(1),
    display: 'flex',
    flexDirection: 'row',
    flexWrap: 'nowrap',
    justifyContent: 'space-between',
    alignItems: 'center'
  }
}));

/**
 * > API documentation for the Community-UI Composer Skeleton component. Learn about the available props and the CSS API.

 #### Import

 ```jsx
 import {ComposerSkeleton} from '@selfcommunity/ui';
 ```

 #### Component Name

 The name `SCComposerSkeleton` can be used when providing style overrides in the theme.

 #### CSS

 |Rule Name|Global class|Description|
 |---|---|---|
 |root|.SCComposerSkeleton-root|Styles applied to the root element.|
 |title|.SCComposerSkeleton-title|Styles applied to the title element.|
 |avatar|.SCComposerSkeleton-avatar|Styles applied to the avatar element.|
 |content|.SCComposerSkeleton-content|Styles applied to the content element.|
 |actions|.SCComposerSkeleton-actions|Styles applied to the actions section.|
 *
 */
export default function ComposerSkeleton(): JSX.Element {
  return (
    <Root className={classes.root}>
      <DialogTitle className={classes.title}>
        <Box>
          <Skeleton animation="wave" height={10} width="100%" />
        </Box>
        <Box>
          <Skeleton className={classes.avatar} animation="wave" variant="circular" width={40} height={40} />
        </Box>
        <Box>
          <Skeleton animation="wave" height={10} width="100%" />
        </Box>
      </DialogTitle>
      <DialogContent className={classes.content}>
        <Skeleton sx={{height: 190}} animation="wave" variant="rectangular" />
      </DialogContent>
      <DialogActions className={classes.actions}>
        <Skeleton animation="wave" height={10} width="40%" />
        <Skeleton animation="wave" height={10} width="40%" />
      </DialogActions>
    </Root>
  );
}
