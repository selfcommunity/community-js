import { TabContext, TabList, TabPanel } from '@mui/lab';
import { CardActions, CardContent, List, ListItem, Skeleton, Stack, Tab } from '@mui/material';
import { Box, styled } from '@mui/system';
import 'swiper/css';
import { UserSkeleton } from '../User';
import Widget from '../Widget';
import { PREFIX } from './constants';

const classes = {
  root: `${PREFIX}-skeleton-root`,
  content: `${PREFIX}-content`,
  title: `${PREFIX}-title`,
  tabsWrapper: `${PREFIX}-tabs-wrapper`,
  tabLabelWrapper: `${PREFIX}-tab-label-wrapper`,
  tabPanel: `${PREFIX}-tab-panel`,
  actions: `${PREFIX}-actions`
};

const Root = styled(Widget, {
  name: PREFIX,
  slot: 'SkeletonRoot',
  overridesResolver: (_props, styles) => styles.skeletonRoot
})();

export default function EventMembersWidgetSkeleton() {
  return (
    <Root className={classes.root}>
      <CardContent className={classes.content}>
        <Skeleton animation="wave" width="53px" height="25px" className={classes.title} />

        <TabContext value="1">
          <Box className={classes.tabsWrapper}>
            <TabList variant="fullWidth">
              <Tab
                label={
                  <Stack className={classes.tabLabelWrapper}>
                    <Skeleton animation="wave" width="26px" height="24px" />
                    <Skeleton animation="wave" width="106px" height="19px" />
                  </Stack>
                }
                value="1"
              />
              <Tab
                label={
                  <Stack className={classes.tabLabelWrapper}>
                    <Skeleton animation="wave" width="26px" height="24px" />
                    <Skeleton animation="wave" width="106px" height="19px" />
                  </Stack>
                }
                value="2"
              />
            </TabList>
          </Box>
          <TabPanel value="1" className={classes.tabPanel}>
            <List>
              {[1, 2, 3, 4].map((_element, i) => (
                <ListItem key={i}>
                  <UserSkeleton />
                </ListItem>
              ))}
            </List>
          </TabPanel>
          <TabPanel value="2" className={classes.tabPanel}>
            <List>
              {[1, 2, 3, 4].map((_element, i) => (
                <ListItem key={i}>
                  <UserSkeleton />
                </ListItem>
              ))}
            </List>
          </TabPanel>
        </TabContext>
      </CardContent>

      <CardActions className={classes.actions}>
        <Skeleton animation="wave" width="52px" height="20px" />
      </CardActions>
    </Root>
  );
}
