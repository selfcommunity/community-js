import {Box, Button, Icon, Popover, Stack, Typography} from '@mui/material';
import {SCCoursePrivacyType, SCCourseType} from '@selfcommunity/types';
import {FormattedMessage, useIntl} from 'react-intl';
import {PREFIX} from './constants';
import {memo, MouseEvent, useCallback, useState} from 'react';
import {Link, SCRoutes, SCRoutingContextType, useSCRouting} from '@selfcommunity/react-core';
import {SCCourseEditTabType} from '../../types';
import classNames from 'classnames';

const classes = {
  header: `${PREFIX}-header`,
  img: `${PREFIX}-header-img`,
  outerWrapper: `${PREFIX}-header-outer-wrapper`,
  innerWrapper: `${PREFIX}-header-inner-wrapper`,
  iconWrapper: `${PREFIX}-header-icon-wrapper`,
  buttonPopover: `${PREFIX}-header-button-popover`,
  contrastColor: `${PREFIX}-contrast-color`
};

type DataUrlEditDashboard = {
  id: number;
  slug: string;
  tab: SCCourseEditTabType;
};

function getUrlEditDashboard(course: SCCourseType): DataUrlEditDashboard {
  return {
    id: course.id,
    slug: course.slug,
    tab: SCCourseEditTabType.LESSONS
  };
}

interface HeaderCourseDashboardProps {
  course: SCCourseType;
  hasAction?: boolean;
}

function HeaderCourseDashboard(props: HeaderCourseDashboardProps) {
  // PROPS
  const {course, hasAction = false} = props;

  // STATES
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
  const open = Boolean(anchorEl);

  // CONTEXTS
  const scRoutingContext: SCRoutingContextType = useSCRouting();

  // INTL
  const intl = useIntl();

  // HANDLERS
  const handleOpenPopover = useCallback(
    (e: MouseEvent<HTMLElement>) => {
      setAnchorEl(e.currentTarget);
    },
    [setAnchorEl]
  );

  const handlePopoverClose = useCallback(() => {
    setAnchorEl(null);
  }, [setAnchorEl]);

  return (
    <Box className={classes.header}>
      <img src={course.image_bigger} alt={course.image_bigger} className={classes.img} />

      <Typography variant="h3" className={classes.contrastColor}>
        {course.name}
      </Typography>

      <Stack className={classes.outerWrapper}>
        <Stack className={classes.innerWrapper}>
          <Stack className={classNames(classes.iconWrapper, classes.contrastColor)}>
            <Icon fontSize="small">public</Icon>

            <Typography variant="body2">
              <FormattedMessage
                id="ui.course.label"
                defaultMessage="ui.course.label"
                values={{
                  privacy: intl.formatMessage({
                    id: `ui.course.privacy.${course.privacy === SCCoursePrivacyType.DRAFT ? 'draft' : course.privacy}`,
                    defaultMessage: `ui.course.privacy.${course.privacy === SCCoursePrivacyType.DRAFT ? 'draft' : course.privacy}`
                  })
                }}
              />
            </Typography>
          </Stack>

          <Stack className={classNames(classes.iconWrapper, classes.contrastColor)}>
            <Icon fontSize="small">courses</Icon>

            <Button variant="text" color="inherit" size="small" className={classes.buttonPopover} onClick={handleOpenPopover}>
              <Typography variant="body2">
                <FormattedMessage
                  id="ui.course.type"
                  defaultMessage="ui.course.type"
                  values={{
                    typeOfCourse: intl.formatMessage({
                      id: `ui.course.type.${course.type}`,
                      defaultMessage: `ui.course.type.${course.type}`
                    })
                  }}
                />
              </Typography>
            </Button>
            {open && (
              <Popover
                open
                anchorEl={anchorEl}
                anchorOrigin={{
                  vertical: 'bottom',
                  horizontal: 'left'
                }}
                transformOrigin={{
                  vertical: 'top',
                  horizontal: 'left'
                }}
                onClose={handlePopoverClose}>
                <Box sx={{padding: '10px'}}>
                  <Typography component="span" variant="body2" sx={{whiteSpace: 'pre-line'}}>
                    <FormattedMessage id={`ui.courseForm.${course.type}.info`} defaultMessage={`ui.courseForm.${course.type}.info`} />
                  </Typography>
                </Box>
              </Popover>
            )}
          </Stack>
        </Stack>

        {hasAction && (
          <Button
            component={Link}
            to={scRoutingContext.url(SCRoutes.COURSE_EDIT_ROUTE_NAME, getUrlEditDashboard(course))}
            size="small"
            color="primary"
            variant="contained">
            <Typography variant="body2">
              <FormattedMessage id="ui.course.dashboard.teacher.btn.label" defaultMessage="ui.course.dashboard.teacher.btn.label" />
            </Typography>
          </Button>
        )}
      </Stack>
    </Box>
  );
}

export default memo(HeaderCourseDashboard);
