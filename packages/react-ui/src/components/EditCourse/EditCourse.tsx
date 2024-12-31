import {Box, Icon, IconButton, Stack, styled, Tab, Typography, useMediaQuery, useTheme, useThemeProps} from '@mui/material';
import {PREFIX} from './constants';
import {HTMLAttributes, SyntheticEvent, useCallback, useEffect, useState} from 'react';
import classNames from 'classnames';
import {TabContext, TabList, TabPanel} from '@mui/lab';
import {FormattedMessage} from 'react-intl';
import {CoursePage, TabContentEnum, TabContentType} from './types';
import Lessons from './Lessons';
import Customize from './Customize';
import Users from './Users';
import Options from './Options';
import {SCThemeType} from '@selfcommunity/react-core';
import {getCourseData} from './data';
import {SCCourseType} from '@selfcommunity/types';
import {useSnackbar} from 'notistack';
import {Logger} from '@selfcommunity/utils';
import {SCOPE_SC_UI} from '../../constants/Errors';

const classes = {
  root: `${PREFIX}-root`,
  header: `${PREFIX}-header`,
  tabList: `${PREFIX}-tab-list`,
  tab: `${PREFIX}-tab`,
  tabPanel: `${PREFIX}-tab-panel`
};

const Root = styled(Box, {
  name: PREFIX,
  slot: 'Root',
  overridesResolver: (_props, styles) => styles.root
})(() => ({}));

export interface EditCourseProps {
  page: CoursePage;
  onTabChange: (page: CoursePage) => void;
  className?: HTMLAttributes<HTMLDivElement>['className'];
  [p: string]: any;
}

export default function EditCourse(inProps: EditCourseProps) {
  // PROPS
  const props: EditCourseProps = useThemeProps({
    props: inProps,
    name: PREFIX
  });

  const {page, onTabChange, className, ...rest} = props;

  // STATES
  const [course, setCourse] = useState<SCCourseType | null>(null);
  const [tabValue, setTabValue] = useState<TabContentType>(TabContentEnum[`${page.toUpperCase()}`]);

  // HOOKS
  const theme = useTheme<SCThemeType>();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const {enqueueSnackbar} = useSnackbar();

  // EFFECTS
  useEffect(() => {
    getCourseData(1)
      .then((course) => {
        if (course) {
          setCourse(course);
        }
      })
      .catch((error) => {
        Logger.error(SCOPE_SC_UI, error);

        enqueueSnackbar(<FormattedMessage id="ui.common.error.action" defaultMessage="ui.common.error.action" />, {
          variant: 'error',
          autoHideDuration: 3000
        });
      });
  }, []);

  // HANDLERS
  const handleTabChange = useCallback(
    (_evt: SyntheticEvent, newTabValue: TabContentType) => {
      setTabValue(newTabValue);
      onTabChange(TabContentEnum[newTabValue]);
    },
    [setTabValue]
  );

  if (!course) {
    return null;
  }

  return (
    <Root className={classNames(classes.root, className)} {...rest}>
      <Stack className={classes.header}>
        <IconButton size="small" aria-label="back" onClick={() => console.log('*** back ***')}>
          <Icon>arrow_back</Icon>
        </IconButton>
        <Typography variant="h5">{course.name}</Typography>
      </Stack>

      <TabContext value={tabValue}>
        <TabList
          className={classes.tabList}
          onChange={handleTabChange}
          textColor="primary"
          indicatorColor="primary"
          variant={isMobile ? 'scrollable' : 'standard'}
          scrollButtons={isMobile}
          centered={!isMobile}>
          <Tab
            label={
              <Typography variant="h6">
                <FormattedMessage id="ui.editCourse.tab.lessons" defaultMessage="ui.editCourse.tab.lessons" />
              </Typography>
            }
            value={TabContentEnum.LESSONS}
            className={classes.tab}
          />
          <Tab
            label={
              <Typography variant="h6">
                <FormattedMessage id="ui.editCourse.tab.customize" defaultMessage="ui.editCourse.tab.customize" />
              </Typography>
            }
            value={TabContentEnum.CUSTOMIZE}
            className={classes.tab}
          />
          <Tab
            label={
              <Typography variant="h6">
                <FormattedMessage id="ui.editCourse.tab.users" defaultMessage="ui.editCourse.tab.users" />
              </Typography>
            }
            value={TabContentEnum.USERS}
            className={classes.tab}
          />
          <Tab
            label={
              <Typography variant="h6">
                <FormattedMessage id="ui.editCourse.tab.options" defaultMessage="ui.editCourse.tab.options" />
              </Typography>
            }
            value={TabContentEnum.OPTIONS}
            className={classes.tab}
          />
        </TabList>

        <TabPanel className={classes.tabPanel} value={TabContentEnum.LESSONS}>
          <Lessons course={course} />
        </TabPanel>

        <TabPanel className={classes.tabPanel} value={TabContentEnum.CUSTOMIZE}>
          <Customize />
        </TabPanel>

        <TabPanel className={classes.tabPanel} value={TabContentEnum.USERS}>
          <Users />
        </TabPanel>

        <TabPanel className={classes.tabPanel} value={TabContentEnum.OPTIONS}>
          <Options />
        </TabPanel>
      </TabContext>
    </Root>
  );
}
