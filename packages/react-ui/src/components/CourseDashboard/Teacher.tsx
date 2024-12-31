import {Box, styled, useThemeProps} from '@mui/material';
import {PREFIX} from './constants';
import HeaderCourseDashboard from './Header';
import {HTMLAttributes, useEffect, useState} from 'react';
import {CourseDashboardPage, TabContentEnum, TabContentType} from './types';
import classNames from 'classnames';
import {SCCourseType} from '@selfcommunity/types';
import {useSnackbar} from 'notistack';
import {Logger} from '@selfcommunity/utils';
import {FormattedMessage} from 'react-intl';
import {getCourseData} from './../EditCourse/data';
import {SCOPE_SC_UI} from './../../constants/Errors';

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

export interface TeacherCourseDashboardProps {
  page: CourseDashboardPage;
  onTabChange: (page: CourseDashboardPage) => void;
  className?: HTMLAttributes<HTMLDivElement>['className'];
  [p: string]: any;
}

export default function TeacherCourseDashboard(inProps: TeacherCourseDashboardProps) {
  // PROPS
  const props: TeacherCourseDashboardProps = useThemeProps({
    props: inProps,
    name: PREFIX
  });

  const {page, onTabChange, className, ...rest} = props;

  // STATES
  const [course, setCourse] = useState<SCCourseType | null>(null);
  const [tabValue, setTabValue] = useState<TabContentType>(TabContentEnum[`${page.toUpperCase()}`]);

  // HOOKS
  // const theme = useTheme<SCThemeType>();
  // const isMobile = useMediaQuery(theme.breakpoints.down('md'));
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
  /* const handleTabChange = useCallback(
    (_evt: SyntheticEvent, newTabValue: TabContentType) => {
      setTabValue(newTabValue);
      onTabChange(TabContentEnum[newTabValue]);
    },
    [setTabValue]
  ); */

  if (!course) {
    return null;
  }

  return (
    <Root className={classNames(classes.root, className)} {...rest}>
      <HeaderCourseDashboard course={course} handleAction={() => console.log()} />
    </Root>
  );
}
