import {useCallback, useState} from 'react';
import {styled} from '@mui/material/styles';
import {useThemeProps} from '@mui/system';
import classNames from 'classnames';
import {
  Box,
  Button,
  FormControl,
  FormControlLabel,
  Icon,
  IconButton,
  InputAdornment,
  Popover,
  Radio,
  RadioGroup,
  TextField,
  Typography
} from '@mui/material';
import {defineMessages, FormattedMessage, useIntl} from 'react-intl';
import {PREFIX} from './constants';
import {DateTimePickerTabs, LocalizationProvider, MobileDateTimePicker} from '@mui/x-date-pickers';
import {getNewDate} from '../EventForm/utils';
import {SCCourseType, SCCourseTypologyType} from '@selfcommunity/types';
import {AdapterDateFns} from '@mui/x-date-pickers/AdapterDateFns';
import {SCContextType, useSCContext} from '@selfcommunity/react-core';
import itLocale from 'date-fns/locale/it';
import enLocale from 'date-fns/locale/en-US';

const messages = defineMessages({
  pickerPlaceholder: {
    id: 'ui.lessonReleaseMenu.programmed.picker.placeholder',
    defaultMessage: 'ui.lessonReleaseMenu.programmed.picker.placeholder'
  },
  pickerCancelMessage: {
    id: 'ui.lessonReleaseMenu.programmed.picker.cancel',
    defaultMessage: 'ui.lessonReleaseMenu.programmed.picker.cancel'
  }
});

const classes = {
  root: `${PREFIX}-root`,
  label: `${PREFIX}-label`,
  picker: `${PREFIX}-picker`,
  popoverRoot: `${PREFIX}-popover-root`,
  popoverContent: `${PREFIX}-popover-content`,
  popoverSelection: `${PREFIX}-popover-selection`,
  popoverAction: `${PREFIX}-popover-action`
};

const Root = styled(FormControl, {
  name: PREFIX,
  slot: 'Root',
  overridesResolver: (props, styles) => [styles.root]
})(() => ({}));

const PopoverRoot = styled(Popover, {
  name: PREFIX,
  slot: 'PopoverRoot',
  overridesResolver: (props, styles) => styles.popoverRoot
})(({theme}) => ({}));

export interface LessonReleaseMenuProps {
  course: SCCourseType;
  /**
   * Overrides or extends the styles applied to the component.
   * @default null
   */
  className?: string;
  /**
   * Any other properties
   */
  [p: string]: any;
}

export default function LessonReleaseMenu(inProps: LessonReleaseMenuProps): JSX.Element {
  // PROPS
  const props: LessonReleaseMenuProps = useThemeProps({
    props: inProps,
    name: PREFIX
  });
  const {className = null, course, ...rest} = props;
  // CONTEXT
  const scContext: SCContextType = useSCContext();

  // STATE
  const initialFieldState = {
    startDateTime: getNewDate()
  };

  const [field, setField] = useState(initialFieldState);
  const [error, setError] = useState<any>({});
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedValue, setSelectedValue] = useState<number>(0);
  const [open, setOpen] = useState(false);

  const [unit, setUnit] = useState('days');

  //INTL
  const intl = useIntl();

  const handleUnitChange = (e) => {
    setUnit(e.target.value);
  };
  // HANDLERS
  const handleChangeDateTime = useCallback(
    (value: any, name: any) => {
      setField((prev) => ({...prev, [name]: value}));
      if (error[`${name}Error`]) {
        delete error[`${name}Error`];
        setError(error);
      }
    },
    [setField, error]
  );

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleValueChange = (e) => {
    setSelectedValue(e.target.value);
  };

  const handleSave = () => {
    setOpen(false);
  };

  const placeholderCalendarized =
    selectedValue > 0
      ? intl.formatMessage(
          {
            id: `ui.lessonReleaseMenu.calendarized.label.${unit}`,
            defaultMessage: `ui.lessonReleaseMenu.calendarized.label.${unit}`
          },
          {total: selectedValue}
        )
      : intl.formatMessage({
          id: 'ui.lessonReleaseMenu.calendarized.label.now',
          defaultMessage: 'ui.lessonReleaseMenu.calendarized.label.now'
        });

  return (
    <Root className={classNames(className, classes.root)} {...rest}>
      {course && course.type === SCCourseTypologyType.PROGRAMMED ? (
        <LocalizationProvider
          dateAdapter={AdapterDateFns}
          adapterLocale={scContext.settings.locale.default === 'it' ? itLocale : enLocale}
          localeText={{
            cancelButtonLabel: `${intl.formatMessage(messages.pickerCancelMessage)}`
          }}>
          <MobileDateTimePicker
            className={classes.picker}
            disablePast
            label={
              field.startDateTime && (
                <FormattedMessage
                  id="ui.lessonReleaseMenu.programmed.picker.placeholder"
                  defaultMessage="ui.lessonReleaseMenu.programmed.picker.placeholder"
                />
              )
            }
            defaultValue={null}
            slots={{
              //actionBar: PickerActionBar,
              tabs: (props) => <DateTimePickerTabs {...props} />,
              textField: (params) => (
                <TextField
                  {...params}
                  InputProps={{
                    ...params.InputProps,
                    placeholder: `${intl.formatMessage(messages.pickerPlaceholder)}`,
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton>
                          <Icon>expand_more</Icon>
                        </IconButton>
                      </InputAdornment>
                    )
                  }}
                />
              )
            }}
            slotProps={{
              tabs: {
                hidden: false
              },
              toolbar: {
                // eslint-disable-next-line @typescript-eslint/ban-ts-ignore,@typescript-eslint/ban-ts-comment
                // @ts-ignore
                toolbarTitle: (
                  <FormattedMessage
                    id="ui.lessonReleaseMenu.programmed.picker.placeholder"
                    defaultMessage="ui.lessonReleaseMenu.programmed.picker.placeholder"
                  />
                )
              }
            }}
            onChange={(value) => handleChangeDateTime(value, 'startDateTime')}
          />
        </LocalizationProvider>
      ) : (
        <>
          <TextField
            size="small"
            placeholder={placeholderCalendarized}
            defaultValue={null}
            onClick={handleClick}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton onClick={handleClick}>
                    <Icon>expand_more</Icon>
                  </IconButton>
                </InputAdornment>
              )
            }}
          />
          <PopoverRoot
            className={classes.popoverRoot}
            open={open}
            anchorEl={anchorEl}
            onClose={handleClose}
            anchorOrigin={{
              vertical: 'bottom',
              horizontal: 'left'
            }}
            transformOrigin={{
              vertical: 'top',
              horizontal: 'left'
            }}>
            <Typography variant="h6">
              <FormattedMessage id="ui.lessonReleaseMenu.dialog.title" defaultMessage="ui.lessonReleaseMenu.dialog.title" />
            </Typography>
            <Box className={classes.popoverContent}>
              <Box className={classes.popoverSelection}>
                <TextField
                  type="number"
                  value={selectedValue}
                  onChange={handleValueChange}
                  InputProps={{
                    inputProps: {
                      min: 0
                    }
                  }}
                />
                <FormControl>
                  <RadioGroup value={unit} onChange={handleUnitChange}>
                    <FormControlLabel
                      value="days"
                      control={<Radio size="small" />}
                      label={<FormattedMessage id="ui.lessonReleaseMenu.dialog.days" defaultMessage="ui.lessonReleaseMenu.dialog.days" />}
                    />
                    <FormControlLabel
                      value="weeks"
                      control={<Radio size="small" />}
                      label={<FormattedMessage id="ui.lessonReleaseMenu.dialog.weeks" defaultMessage="ui.lessonReleaseMenu.dialog.weeks" />}
                    />
                  </RadioGroup>
                </FormControl>
              </Box>
              <Typography variant="body1">
                {selectedValue > 0 ? (
                  <FormattedMessage
                    id={`ui.lessonReleaseMenu.dialog.info.calendarized.${unit}`}
                    defaultMessage={`ui.lessonReleaseMenu.dialog.info.calendarized.${unit}`}
                    values={{total: selectedValue}}
                  />
                ) : (
                  <FormattedMessage id="ui.lessonReleaseMenu.dialog.info.now" defaultMessage="ui.lessonReleaseMenu.dialog.info.now" />
                )}
              </Typography>
              <Button className={classes.popoverAction} variant="contained" onClick={handleSave}>
                <FormattedMessage id="ui.lessonReleaseMenu.dialog.button.done" defaultMessage="ui.lessonReleaseMenu.dialog.button.done" />
              </Button>
            </Box>
          </PopoverRoot>
        </>
      )}
    </Root>
  );
}
