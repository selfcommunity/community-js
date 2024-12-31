import {Button, Icon, Stack, Typography} from '@mui/material';
import {SCCourseType} from '@selfcommunity/types';
import {FormattedMessage, useIntl} from 'react-intl';
import {LESSONS_DATA} from '../EditCourse/data';

interface HeaderCourseDashboardProps {
  course: SCCourseType;
  handleAction?: () => void;
}

export default function HeaderCourseDashboard(props: HeaderCourseDashboardProps) {
  // PROPS
  const {course, handleAction} = props;

  // HOOKS
  const intl = useIntl();

  return (
    <>
      <img
        src={course.image_big}
        alt={course.image_big}
        width="100%"
        height="150px"
        style={{
          borderBottomLeftRadius: '10px',
          borderBottomRightRadius: '10px',
          marginBottom: '17px'
        }}
      />

      <Typography variant="h3">{course.name}</Typography>

      <Stack
        sx={{
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginTop: '24px',
          marginBottom: '19px'
        }}>
        <Stack
          sx={{
            flexDirection: 'row',
            alignItems: 'center',
            gap: '28px'
          }}>
          <Stack
            sx={{
              flexDirection: 'row',
              alignItems: 'center',
              gap: '8px'
            }}>
            <Icon fontSize="small">public</Icon>

            <Typography variant="body2">
              <FormattedMessage
                id="ui.course.label"
                defaultMessage="ui.course.label"
                values={{
                  privacy: intl.formatMessage({
                    id: `ui.course.privacy.${LESSONS_DATA.privacy}`,
                    defaultMessage: `ui.course.privacy.${LESSONS_DATA.privacy}`
                  })
                }}
              />
            </Typography>
          </Stack>

          <Stack
            sx={{
              flexDirection: 'row',
              alignItems: 'center',
              gap: '8px'
            }}>
            <Icon fontSize="small">courses</Icon>

            <Typography variant="body2">
              <FormattedMessage
                id="ui.course.type"
                defaultMessage="ui.course.type"
                values={{
                  typeOfCourse: intl.formatMessage({
                    id: `ui.course.type.${LESSONS_DATA.typeOfCourse}`,
                    defaultMessage: `ui.course.type.${LESSONS_DATA.typeOfCourse}`
                  })
                }}
              />
            </Typography>
          </Stack>
        </Stack>

        {handleAction && (
          <Button size="small" color="primary" variant="contained" onClick={handleAction}>
            <Typography variant="body2">
              <FormattedMessage id="ui.course.dashboard.teacher.btnLabel" defaultMessage="ui.course.dashboard.teacher.btnLabel" />
            </Typography>
          </Button>
        )}
      </Stack>
    </>
  );
}
