import {Box, Icon, MenuItem, Select, SelectChangeEvent, Typography, useMediaQuery, useTheme} from '@mui/material';
import {Fragment, memo, MouseEvent, useCallback, useEffect, useMemo, useState} from 'react';
import {FormattedMessage} from 'react-intl';
import {PREFIX} from '../constants';
import {SCThemeType} from '@selfcommunity/react-core';
import MenuRow from '../MenuRow';
import {Logger} from '@selfcommunity/utils';
import {SCOPE_SC_UI} from '../../../constants/Errors';
import {LoadingButton} from '@mui/lab';
import {useSnackbar} from 'notistack';
import {SCCourseLessonStatusType, SCCourseLessonType, SCCourseSectionType, SCCourseType} from '@selfcommunity/types';
import {CourseService} from '@selfcommunity/api-services';

const OPTIONS = [
  {
    id: 'ui.editCourse.tab.lessons.table.select.draft',
    value: 'ui.editCourse.tab.lessons.table.select.draft'
  },
  {
    id: 'ui.editCourse.tab.lessons.table.select.published',
    value: 'ui.editCourse.tab.lessons.table.select.published'
  }
];

const classes = {
  changeLessonStatusPublishedWrapper: `${PREFIX}-change-lesson-status-published-wrapper`,
  changeLessonStatusIconDraft: `${PREFIX}-change-lesson-status-icon-draft`
};

interface ChangeLessonStatusProps {
  course: SCCourseType;
  section: SCCourseSectionType;
  lesson: SCCourseLessonType;
}

function ChangeLessonStatus(props: ChangeLessonStatusProps) {
  // PROPS
  const {course, section, lesson} = props;

  // HOOKS
  // const intl = useIntl();
  const theme = useTheme<SCThemeType>();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const {enqueueSnackbar} = useSnackbar();

  // STATES
  const [value, setValue] = useState('');
  const [loading, setLoading] = useState(false);

  // EFFECTS
  useEffect(() => {
    setValue(`ui.editCourse.tab.lessons.table.select.${lesson.status || 'draft'}`);
  }, [lesson, setValue]);

  // MEMOS
  const hasPublished = useMemo(() => value === 'ui.editCourse.tab.lessons.table.select.published', [value]);

  const icon = useMemo(
    () =>
      value === 'ui.editCourse.tab.lessons.table.select.draft' ? (
        <Box className={classes.changeLessonStatusIconDraft} />
      ) : (
        <Icon>circle_checked</Icon>
      ),
    [value]
  );

  // HANDLERS
  const handleAction = useCallback(
    (newValue: string) => {
      setLoading(true);

      const data: Partial<SCCourseLessonType> = {
        status: newValue.endsWith(SCCourseLessonStatusType.DRAFT) ? SCCourseLessonStatusType.DRAFT : SCCourseLessonStatusType.PUBLISHED
      };

      CourseService.patchCourseLesson(course.id, section.id, lesson.id, data)
        .then(() => {
          setValue(newValue);
          setLoading(false);

          enqueueSnackbar(
            <FormattedMessage id="ui.editCourse.tab.lessons.table.snackbar.save" defaultMessage="ui.editCourse.tab.lessons.table.snackbar.save" />,
            {
              variant: 'success',
              autoHideDuration: 3000
            }
          );
        })
        .catch((error) => {
          Logger.error(SCOPE_SC_UI, error);

          enqueueSnackbar(<FormattedMessage id="ui.common.error.action" defaultMessage="ui.common.error.action" />, {
            variant: 'error',
            autoHideDuration: 3000
          });
        });
    },
    [course, section, lesson, setLoading, setValue]
  );

  const handleChange = useCallback((e: SelectChangeEvent) => handleAction(e.target.value), [handleAction]);

  const handleClick = useCallback(
    (e: MouseEvent<HTMLButtonElement, globalThis.MouseEvent>) => {
      const newValue = e.currentTarget.getAttribute('data-value');

      if (newValue !== value) {
        handleAction(newValue as SCCourseLessonStatusType);
      }
    },
    [handleAction, value]
  );

  return (
    <Fragment>
      {isMobile ? (
        <MenuRow buttonClassName={hasPublished ? classes.changeLessonStatusPublishedWrapper : undefined} icon={icon}>
          {OPTIONS.map((option, i) => (
            <MenuItem key={i}>
              <LoadingButton
                size="small"
                color="inherit"
                onClick={handleClick}
                loading={loading}
                disabled={loading}
                data-value={option.value}
                sx={{
                  padding: 0,
                  ':hover': {
                    backgroundColor: 'unset'
                  }
                }}>
                <Typography variant="body1">
                  <FormattedMessage id={option.id} defaultMessage={option.id} />
                </Typography>
              </LoadingButton>
            </MenuItem>
          ))}
        </MenuRow>
      ) : (
        <Select className={hasPublished ? classes.changeLessonStatusPublishedWrapper : undefined} size="small" value={value} onChange={handleChange}>
          {OPTIONS.map((option, i) => (
            <MenuItem key={i} value={option.value}>
              <LoadingButton
                size="small"
                color="inherit"
                loading={loading}
                disabled={loading}
                sx={{
                  padding: 0,
                  ':hover': {
                    backgroundColor: 'unset'
                  }
                }}>
                <Typography variant="body1">
                  <FormattedMessage id={option.id} defaultMessage={option.id} />
                </Typography>
              </LoadingButton>
            </MenuItem>
          ))}
        </Select>
      )}
    </Fragment>
  );
}

export default memo(ChangeLessonStatus);
