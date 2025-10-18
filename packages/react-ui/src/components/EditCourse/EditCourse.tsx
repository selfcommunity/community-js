import {Box, Icon, IconButton, Stack, styled, Tab, Typography, useMediaQuery, useTheme, useThemeProps} from '@mui/material';
import {PREFIX} from './constants';
import {HTMLAttributes, SyntheticEvent, useCallback, useMemo, useState} from 'react';
import classNames from 'classnames';
import {TabContext, TabList, TabPanel} from '@mui/lab';
import {FormattedMessage} from 'react-intl';
import Lessons from './Lessons';
import Customize from './Customize';
import Users from './Users';
import Options from './Options';
import {SCRoutes, SCRoutingContextType, SCThemeType, useSCFetchCourse, useSCRouting} from '@selfcommunity/react-core';
import {SCCourseType} from '@selfcommunity/types';
import {CourseInfoViewType} from '@selfcommunity/api-services';
import Requests from './Requests';
import {SCCourseEditTabType} from '../../types/course';
import EditCourseSkeleton from './Skeleton';

const classes = {
  root: `${PREFIX}-root`,
  header: `${PREFIX}-header`,
  tabList: `${PREFIX}-tab-list`,
  tab: `${PREFIX}-tab`,
  tabPanel: `${PREFIX}-tab-panel`,
  contrastColor: `${PREFIX}-contrast-color`
};

const TAB_DATA = [
  {
    label: 'ui.editCourse.tab.lessons',
    value: SCCourseEditTabType.LESSONS
  },
  {
    label: 'ui.editCourse.tab.customize',
    value: SCCourseEditTabType.CUSTOMIZE
  },
  {
    label: 'ui.editCourse.tab.users',
    value: SCCourseEditTabType.USERS
  },
  {
    label: 'ui.editCourse.tab.requests',
    value: SCCourseEditTabType.REQUESTS
  },
  {
    label: 'ui.editCourse.tab.options',
    value: SCCourseEditTabType.OPTIONS
  }
];

const Root = styled(Box, {
  name: PREFIX,
  slot: 'Root',
  overridesResolver: (_props, styles) => styles.root
})(() => ({}));

export interface EditCourseProps {
  courseId?: number;
  course?: SCCourseType;
  tab?: SCCourseEditTabType;
  onTabChange?: (tab: SCCourseEditTabType) => void;
  onTabSelect?: (tab: SCCourseEditTabType) => void;
  className?: HTMLAttributes<HTMLDivElement>['className'];
  [p: string]: any;
}

export default function EditCourse(inProps: EditCourseProps) {
  // PROPS
  const props: EditCourseProps = useThemeProps({
    props: inProps,
    name: PREFIX
  });

  const {courseId, course, tab = SCCourseEditTabType.LESSONS, onTabChange, onTabSelect, className, ...rest} = props;

  // STATES
  const [tabValue, setTabValue] = useState<SCCourseEditTabType>(tab);

  // CONTEXTS
  const scRoutingContext: SCRoutingContextType = useSCRouting();

  // HOOKS
  const {scCourse, setSCCourse} = useSCFetchCourse({id: courseId, course, params: {view: CourseInfoViewType.EDIT}});
  const theme = useTheme<SCThemeType>();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  // HANDLERS
  const handleTabChange = useCallback(
    (_e: SyntheticEvent, newTabValue: SCCourseEditTabType) => {
      if (onTabSelect) {
        onTabSelect(newTabValue);
      } else {
        setTabValue(newTabValue);
        onTabChange?.(newTabValue);
      }
    },
    [setTabValue, onTabChange, onTabSelect]
  );

  // MEMOS
  const panelData = useMemo(() => {
    return [
      {
        value: SCCourseEditTabType.LESSONS,
        children: <Lessons course={scCourse} setCourse={setSCCourse} handleTabChange={handleTabChange} />
      },
      {
        value: SCCourseEditTabType.CUSTOMIZE,
        children: <Customize course={scCourse} setCourse={setSCCourse} />
      },
      {
        value: SCCourseEditTabType.USERS,
        children: <Users course={scCourse} handleTabChange={handleTabChange} />
      },
      {
        value: SCCourseEditTabType.REQUESTS,
        children: <Requests course={scCourse} handleTabChange={handleTabChange} />
      },
      {
        value: SCCourseEditTabType.OPTIONS,
        children: <Options course={scCourse} setCourse={setSCCourse} />
      }
    ];
  }, [scCourse, handleTabChange]);

  if (!scCourse) {
    return <EditCourseSkeleton tab={tab} />;
  }

  return (
    <Root className={classNames(classes.root, className)} {...rest}>
      <Stack className={classes.header}>
        <IconButton href={scRoutingContext.url(SCRoutes.COURSE_DASHBOARD_ROUTE_NAME, scCourse)} size="small">
          <Icon className={classes.contrastColor}>arrow_back</Icon>
        </IconButton>
        <Typography variant="h5" className={classes.contrastColor}>
          {scCourse.name}
        </Typography>
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

        {panelData.map((data, i) => (
          <TabPanel key={i} sx={{className: classes.tabPanel}} value={data.value}>
            {data.children}
          </TabPanel>
        ))}
      </TabContext>
    </Root>
  );
}
