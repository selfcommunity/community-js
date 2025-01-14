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
import {SCRoutes, SCRoutingContextType, SCThemeType, useSCRouting} from '@selfcommunity/react-core';
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

const TAB_DATA = [
  {
    label: 'ui.editCourse.tab.lessons',
    value: TabContentEnum.LESSONS
  },
  {
    label: 'ui.editCourse.tab.customize',
    value: TabContentEnum.CUSTOMIZE
  },
  {
    label: 'ui.editCourse.tab.users',
    value: TabContentEnum.USERS
  },
  {
    label: 'ui.editCourse.tab.options',
    value: TabContentEnum.OPTIONS
  }
];

function getPanelData(course: SCCourseType) {
  return [
    {
      value: TabContentEnum.LESSONS,
      children: <Lessons course={course} />
    },
    {
      value: TabContentEnum.CUSTOMIZE,
      children: <Customize />
    },
    {
      value: TabContentEnum.USERS,
      children: <Users />
    },
    {
      value: TabContentEnum.OPTIONS,
      children: <Options />
    }
  ];
}

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

  // CONTEXTS
  const scRoutingContext: SCRoutingContextType = useSCRouting();

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
        <IconButton href={scRoutingContext.url(SCRoutes.COURSE_ROUTE_NAME, course)} size="small">
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

        {getPanelData(course).map((data, i) => (
          <TabPanel key={i} className={classes.tabPanel} value={data.value}>
            {data.children}
          </TabPanel>
        ))}
      </TabContext>
    </Root>
  );
}
