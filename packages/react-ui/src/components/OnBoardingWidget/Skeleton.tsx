import React from 'react';
import {Box, Chip, List, ListItem, ListItemButton, ListItemIcon, ListItemText, Tab, Tabs, useMediaQuery, useTheme} from '@mui/material';
import {styled} from '@mui/material/styles';
import Skeleton from '@mui/material/Skeleton';
import {PREFIX} from './constants';
import {SCThemeType} from '@selfcommunity/react-core';

const classes = {
  root: `${PREFIX}-skeleton-root`,
  menu: `${PREFIX}-skeleton-menu`,
  content: `${PREFIX}-skeleton-content`
};

const Root = styled(Box, {
  name: PREFIX,
  slot: 'SkeletonRoot'
})(() => ({}));

export default function OnBoardingWidgetSkeleton(): JSX.Element {
  const theme = useTheme<SCThemeType>();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const steps = Array(isMobile ? 3 : 5).fill(null);
  return (
    <Root className={classes.root}>
      <Box className={classes.menu}>
        {isMobile ? (
          <Box sx={{display: 'flex', justifyContent: 'space-evenly'}}>
            {steps.map((_, index) => (
              <Chip key={index} label={<Skeleton variant="text" width={80} />} variant="outlined" />
            ))}
          </Box>
        ) : (
          <List>
            {steps.map((_, index) => (
              <ListItem key={index}>
                <ListItemButton>
                  <ListItemIcon>
                    <Skeleton variant="rectangular" width={20} height={20} />
                  </ListItemIcon>
                  <ListItemText primary={<Skeleton variant="text" width={100} />} />
                </ListItemButton>
              </ListItem>
            ))}
          </List>
        )}
      </Box>
      <Box className={classes.content}>
        <Skeleton variant="text" width={'20%'} height={40} />
        <Skeleton variant="text" width={'80%'} height={20} />
        <Skeleton variant="text" width={'70%'} height={20} />
        <Skeleton variant="text" width={'60%'} height={20} />
        <Skeleton variant="rectangular" width={100} height={36} style={{borderRadius: '20px', alignSelf: 'center', marginTop: 24}} />
      </Box>
    </Root>
  );
}
