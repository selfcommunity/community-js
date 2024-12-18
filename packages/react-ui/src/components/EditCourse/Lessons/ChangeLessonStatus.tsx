import {Box, Icon, MenuItem, Select, SelectChangeEvent, Typography, useMediaQuery, useTheme} from '@mui/material';
import {Fragment, MouseEvent, useCallback, useMemo, useState} from 'react';
import {FormattedMessage, useIntl} from 'react-intl';
import {PREFIX} from '../constants';
import {SCThemeType} from '@selfcommunity/react-core';
import MenuRow from './MenuRow';
import {setStatus} from '../data';
import {Status} from '../types';
import {Logger} from '@selfcommunity/utils';
import {SCOPE_SC_UI} from 'packages/react-ui/src/constants/Errors';
import {LoadingButton} from '@mui/lab';
import {useSnackbar} from 'notistack';

const classes = {
  changeLessonStatusPublishedWrapper: `${PREFIX}-change-lesson-status-published-wrapper`,
  changeLessonStatusIconDraft: `${PREFIX}-change-lesson-status-icon-draft`
};

export default function ChangeLessonStatus() {
  // HOOKS
  const intl = useIntl();
  const theme = useTheme<SCThemeType>();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const {enqueueSnackbar} = useSnackbar();

  // STATES
  const [value, setValue] = useState(
    intl.formatMessage({id: 'ui.editCourse.table.select.draft', defaultMessage: 'ui.editCourse.table.select.draft'})
  );
  const [loading, setLoading] = useState(false);

  // MEMOS
  const options = useMemo(
    () => [
      {
        id: 'ui.editCourse.table.select.draft',
        value: intl.formatMessage({id: 'ui.editCourse.table.select.draft', defaultMessage: 'ui.editCourse.table.select.draft'})
      },
      {
        id: 'ui.editCourse.table.select.published',
        value: intl.formatMessage({id: 'ui.editCourse.table.select.published', defaultMessage: 'ui.editCourse.table.select.published'})
      }
    ],
    []
  );

  const hasPublished = useMemo(
    () => value === intl.formatMessage({id: 'ui.editCourse.table.select.published', defaultMessage: 'ui.editCourse.table.select.published'}),
    [value]
  );

  const icon = useMemo(
    () =>
      value === intl.formatMessage({id: 'ui.editCourse.table.select.draft', defaultMessage: 'ui.editCourse.table.select.draft'}) ? (
        <Box className={classes.changeLessonStatusIconDraft} />
      ) : (
        <Icon>circle_checked</Icon>
      ),
    [value]
  );

  // HANDLERS
  const handleAction = useCallback(
    (newValue: Status) => {
      setLoading(true);

      setStatus(newValue)
        .then((value) => {
          setValue(value);
          setLoading(false);
        })
        .catch((error) => {
          Logger.error(SCOPE_SC_UI, error);

          enqueueSnackbar(<FormattedMessage id="ui.common.error.action" defaultMessage="ui.common.error.action" />, {
            variant: 'error',
            autoHideDuration: 3000
          });
        });
    },
    [setLoading, setValue]
  );

  const handleChange = useCallback((e: SelectChangeEvent) => handleAction(e.target.value as Status), [handleAction]);

  const handleClick = useCallback(
    (e: MouseEvent<HTMLSpanElement, globalThis.MouseEvent>) => {
      const newValue = e.currentTarget.innerText;

      if (newValue !== value) {
        handleAction(e.currentTarget.innerText as Status);
      }
    },
    [handleAction, value]
  );

  return (
    <Fragment>
      {isMobile ? (
        <MenuRow buttonClassName={hasPublished ? classes.changeLessonStatusPublishedWrapper : undefined} icon={icon}>
          {options.map((option, i) => (
            <MenuItem key={i}>
              <LoadingButton
                size="small"
                color="inherit"
                onClick={handleClick}
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
        </MenuRow>
      ) : (
        <Select className={hasPublished ? classes.changeLessonStatusPublishedWrapper : undefined} size="small" value={value} onChange={handleChange}>
          {options.map((option, i) => (
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
