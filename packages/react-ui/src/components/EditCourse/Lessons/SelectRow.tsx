import {Box, FormControl, Icon, MenuItem, Select, SelectChangeEvent, Typography, useMediaQuery, useTheme} from '@mui/material';
import {Fragment, MouseEvent, useCallback, useMemo, useState} from 'react';
import {FormattedMessage, useIntl} from 'react-intl';
import {PREFIX} from '../constants';
import {SCThemeType} from '@selfcommunity/react-core';
import MenuRow from './MenuRow';

const classes = {
  formSelect: `${PREFIX}-form-select`
};

export default function SelectRow() {
  // HOOKS
  const intl = useIntl();
  const theme = useTheme<SCThemeType>();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  // STATES
  const [value, setValue] = useState(
    intl.formatMessage({id: 'ui.editCourse.table.select.draft', defaultMessage: 'ui.editCourse.table.select.draft'})
  );

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

  const hasClassName = useMemo(
    () => value === intl.formatMessage({id: 'ui.editCourse.table.select.published', defaultMessage: 'ui.editCourse.table.select.published'}),
    [value]
  );

  const icon = useMemo(
    () =>
      value === intl.formatMessage({id: 'ui.editCourse.table.select.draft', defaultMessage: 'ui.editCourse.table.select.draft'}) ? (
        <Box
          sx={{
            width: '20px',
            height: '20px',
            borderRadius: 9999,
            backgroundColor: '#757575'
          }}
        />
      ) : (
        <Icon>circle_checked</Icon>
      ),
    [value]
  );

  // HANDLERS
  const handleChange = useCallback(
    (e: SelectChangeEvent) => {
      setValue(e.target.value);
    },
    [setValue]
  );

  const handleClick = useCallback(
    (e: MouseEvent<HTMLSpanElement, globalThis.MouseEvent>) => {
      setValue(e.currentTarget.innerText);
    },
    [setValue]
  );

  return (
    <Fragment>
      {isMobile ? (
        <MenuRow buttonClassName={hasClassName ? classes.formSelect : undefined} icon={icon}>
          {options.map((option, i) => (
            <MenuItem key={i}>
              <Typography variant="body1" onClick={handleClick}>
                <FormattedMessage id={option.id} defaultMessage={option.id} />
              </Typography>
            </MenuItem>
          ))}
        </MenuRow>
      ) : (
        <FormControl hiddenLabel size="small">
          <Select className={hasClassName ? classes.formSelect : undefined} value={value} onChange={handleChange}>
            {options.map((option, i) => (
              <MenuItem key={i} value={option.value}>
                <Typography variant="body1">
                  <FormattedMessage id={option.id} defaultMessage={option.id} />
                </Typography>
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      )}
    </Fragment>
  );
}
