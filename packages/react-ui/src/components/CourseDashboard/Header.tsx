import {Box, Button, Icon, Stack, Typography} from '@mui/material';
import {SCContentType, SCCourseJoinStatusType, SCCoursePrivacyType, SCCourseType} from '@selfcommunity/types';
import {FormattedMessage, useIntl} from 'react-intl';
import {PREFIX} from './constants';
import React, {memo} from 'react';
import {Link, SCRoutes, SCRoutingContextType, useSCPaymentsEnabled, useSCRouting} from '@selfcommunity/react-core';
import {SCCourseEditTabType} from '../../types';
import classNames from 'classnames';
import CourseTypePopover from '../../shared/CourseTypePopover';
import BuyButton from '../BuyButton';

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

  // CONTEXTS
  const scRoutingContext: SCRoutingContextType = useSCRouting();

  // INTL
  const intl = useIntl();

  // PAYMENTS
  const {isPaymentsEnabled} = useSCPaymentsEnabled();

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

          <CourseTypePopover course={course} />
          {isPaymentsEnabled &&
            course.paywalls?.length > 0 &&
            (course.privacy === SCCoursePrivacyType.OPEN ||
              (course.privacy === SCCoursePrivacyType.PRIVATE && course.join_status && course.join_status !== SCCourseJoinStatusType.REQUESTED)) && (
              <BuyButton
                size="md"
                variant="text"
                startIcon={<Icon>dredit-card</Icon>}
                contentType={SCContentType.COURSE}
                content={course}
                label={<FormattedMessage id="ui.course.paid" defaultMessage="ui.course.paid" />}
              />
            )}
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
