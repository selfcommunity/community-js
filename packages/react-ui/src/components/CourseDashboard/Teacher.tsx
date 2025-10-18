import {Box, Stack, styled, Tab, Typography, useThemeProps} from '@mui/material';
import {PREFIX} from './constants';
import HeaderCourseDashboard from './Header';
import {HTMLAttributes, memo, SyntheticEvent, useCallback, useState} from 'react';
import {InfoPositionType, TabContentType} from './types';
import classNames from 'classnames';
import {SCCourseType} from '@selfcommunity/types';
import {FormattedMessage} from 'react-intl';
import InfoCourseDashboard from './Teacher/Info';
import {TabContext, TabList, TabPanel} from '@mui/lab';
import Students from './Teacher/Students';
import Comments from './Teacher/Comments';
import {useSCFetchCourse} from '@selfcommunity/react-core';
import {CourseInfoViewType} from '@selfcommunity/api-services';
import TeacherSkeleton from './Teacher/Skeleton';

const classes = {
  root: `${PREFIX}-root`,
  infoWrapper: `${PREFIX}-info-wrapper`,
  tabList: `${PREFIX}-tab-list`,
  tab: `${PREFIX}-tab`,
  tabPanel: `${PREFIX}-tab-panel`,
  contrastColor: `${PREFIX}-contrast-color`
};

const TAB_DATA = [
  {
    label: 'ui.course.dashboard.teacher.tab.students',
    value: TabContentType.STUDENTS
  },
  {
    label: 'ui.course.dashboard.teacher.tab.comments',
    value: TabContentType.COMMENTS
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
  className?: HTMLAttributes<HTMLDivElement>['className'];
  [p: string]: any;
}

function Teacher(inProps: TeacherCourseDashboardProps) {
  // PROPS
  const props: TeacherCourseDashboardProps = useThemeProps({
    props: inProps,
    name: PREFIX
  });

  const {courseId, course, className, ...rest} = props;

  // STATES
  const [tabValue, setTabValue] = useState<TabContentType>(TabContentType.STUDENTS);

  // HOOKS
  const {scCourse} = useSCFetchCourse({id: courseId, course, params: {view: CourseInfoViewType.DASHBOARD}});

  // HANDLERS
  const handleTabChange = useCallback(
    (_evt: SyntheticEvent, newTabValue: TabContentType) => {
      setTabValue(newTabValue);
    },
    [setTabValue]
  );

  if (!scCourse) {
    return <TeacherSkeleton />;
  }

  return (
    <Root className={classNames(classes.root, className)} {...rest}>
      <HeaderCourseDashboard course={scCourse} hasAction />

      <Stack className={classes.infoWrapper}>
        <InfoCourseDashboard title="ui.course.dashboard.teacher.info.students" course={scCourse} position={InfoPositionType.FIRST} />
        <InfoCourseDashboard title="ui.course.dashboard.teacher.info.completion" course={scCourse} position={InfoPositionType.SECOND} />
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
              className={classNames(classes.tab, classes.contrastColor)}
            />
          ))}
        </TabList>

        <TabPanel sx={{className: classes.tabPanel}} value={TabContentType.STUDENTS}>
          <Students course={scCourse} />
        </TabPanel>

        <TabPanel sx={{className: classes.tabPanel}} value={TabContentType.COMMENTS}>
          <Comments course={scCourse} />
        </TabPanel>
      </TabContext>
    </Root>
  );
}

export default memo(Teacher);
