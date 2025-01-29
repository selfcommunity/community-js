import {Box, Stack, styled, Tab, Typography, useThemeProps} from '@mui/material';
import {PREFIX} from './constants';
import HeaderCourseDashboard from './Header';
import {HTMLAttributes, SyntheticEvent, useCallback, useState} from 'react';
import {CourseDashboardPage, TabContentEnum, TabContentType} from './types';
import classNames from 'classnames';
import {SCCourseType} from '@selfcommunity/types';
import {FormattedMessage} from 'react-intl';
import InfoCourseDashboard from './Teacher/Info';
import {TabContext, TabList, TabPanel} from '@mui/lab';
import Students from './Teacher/Students';
import Comments from './Teacher/Comments';
import {useSCFetchCourse} from '@selfcommunity/react-core';
import {CourseInfoViewType} from '@selfcommunity/api-services';

const classes = {
  root: `${PREFIX}-root`,
  infoWrapper: `${PREFIX}-info-wrapper`,
  tabList: `${PREFIX}-tab-list`,
  tab: `${PREFIX}-tab`,
  tabPanel: `${PREFIX}-tab-panel`
};

const TAB_DATA = [
  {
    label: 'ui.course.dashboard.teacher.tab.students',
    value: TabContentEnum.STUDENTS
  },
  {
    label: 'ui.course.dashboard.teacher.tab.comments',
    value: TabContentEnum.COMMENTS
  }
];

const Root = styled(Box, {
  name: PREFIX,
  slot: 'Root',
  overridesResolver: (_props, styles) => styles.root
})(() => ({}));

export interface TeacherCourseDashboardProps {
  courseId?: number;
  course?: SCCourseType;
  page: CourseDashboardPage;
  onTabChange: (page: CourseDashboardPage) => void;
  className?: HTMLAttributes<HTMLDivElement>['className'];
  [p: string]: any;
}

export default function Teacher(inProps: TeacherCourseDashboardProps) {
  // PROPS
  const props: TeacherCourseDashboardProps = useThemeProps({
    props: inProps,
    name: PREFIX
  });

  const {courseId, course, page, onTabChange, className, ...rest} = props;

  // STATES
  const [tabValue, setTabValue] = useState<TabContentType>(TabContentEnum[`${page.toUpperCase()}`]);

  // HOOKS
  const {scCourse} = useSCFetchCourse({id: courseId, course, params: {view: CourseInfoViewType.DASHBOARD}});

  // HANDLERS
  const handleTabChange = useCallback(
    (_evt: SyntheticEvent, newTabValue: TabContentType) => {
      setTabValue(newTabValue);
      onTabChange(TabContentEnum[newTabValue]);
    },
    [setTabValue]
  );

  return (
    <Root className={classNames(classes.root, className)} {...rest}>
      <HeaderCourseDashboard course={scCourse} hasAction />

      <Stack className={classes.infoWrapper}>
        <InfoCourseDashboard title="ui.course.dashboard.teacher.info.students" course={scCourse} position="first" />
        <InfoCourseDashboard title="ui.course.dashboard.teacher.info.completion" course={scCourse} position="second" />
      </Stack>

      <TabContext value={tabValue}>
        <TabList className={classes.tabList} onChange={handleTabChange} textColor="primary" indicatorColor="primary" variant="standard" centered>
          {TAB_DATA.map((data, i) => (
            <Tab
              key={i}
              label={
                <Typography variant="h6">
                  <FormattedMessage id={data.label} defaultMessage={data.label} />
                </Typography>
              }
              value={data.value}
              className={classes.tab}
            />
          ))}
        </TabList>

        <TabPanel className={classes.tabPanel} value={TabContentEnum.STUDENTS}>
          <Students course={scCourse} />
        </TabPanel>

        <TabPanel className={classes.tabPanel} value={TabContentEnum.COMMENTS}>
          <Comments course={scCourse} />
        </TabPanel>
      </TabContext>
    </Root>
  );
}
