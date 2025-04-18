import {useEffect, useState} from 'react';
import {styled} from '@mui/material';
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
import {PREFIX, unitType} from './constants';
import {DateTimePickerTabs, LocalizationProvider, MobileDateTimePicker} from '@mui/x-date-pickers';
import {SCCourseSectionType, SCCourseType, SCCourseTypologyType} from '@selfcommunity/types';
import {AdapterDateFns} from '@mui/x-date-pickers/AdapterDateFns';
import {SCContextType, useSCContext} from '@selfcommunity/react-core';
import itLocale from 'date-fns/locale/it';
import enLocale from 'date-fns/locale/en-US';
import {CourseService} from '@selfcommunity/api-services';
import {SCOPE_SC_UI} from '../../constants/Errors';
import {Logger} from '@selfcommunity/utils';
import {getDripDelayAndUnit} from '../../utils/course';
import {useIsDisabled} from '../EditCourse/hooks';

const messages = defineMessages({
  pickerPlaceholder: {
    id: 'ui.lessonReleaseMenu.scheduled.picker.placeholder',
    defaultMessage: 'ui.lessonReleaseMenu.scheduled.picker.placeholder'
  },
  pickerCancelMessage: {
    id: 'ui.lessonReleaseMenu.scheduled.picker.cancel',
    defaultMessage: 'ui.lessonReleaseMenu.scheduled.picker.cancel'
  },
  pickerClearMessage: {
    id: 'ui.lessonReleaseMenu.scheduled.picker.clear',
    defaultMessage: 'ui.lessonReleaseMenu.scheduled.picker.clear'
  },
  pickerOkMessage: {
    id: 'ui.lessonReleaseMenu.scheduled.picker.ok',
    defaultMessage: 'ui.lessonReleaseMenu.scheduled.picker.ok'
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
  overridesResolver: (_props, styles) => [styles.root]
})(() => ({}));

const PopoverRoot = styled(Popover, {
  name: PREFIX,
  slot: 'PopoverRoot',
  overridesResolver: (_props, styles) => styles.popoverRoot
})(() => ({}));

export interface LessonReleaseMenuProps {
  /**
   * The lesson object
   */
  section: SCCourseSectionType;
  /**
   *
   */
  course: SCCourseType;
  /**
   * Overrides or extends the styles applied to the component.
   * @default null
   */
  className?: string;
  /**
   * onSuccess Callback
   */
  onSuccess?: (data: SCCourseSectionType) => void;
  /**
   *
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
  const {className = null, course, section, onSuccess, ...rest} = props;
  // CONTEXT
  const scContext: SCContextType = useSCContext();

  // STATE
  const [drippedAt, setDrippedAt] = useState<Date | null>(null);
  const {delay, _unit} = getDripDelayAndUnit(section?.drip_delay || 0);
  const [dripDelay, setDripDelay] = useState(delay);
  const [unit, setUnit] = useState(_unit);
  const [anchorEl, setAnchorEl] = useState(null);
  const [open, setOpen] = useState(false);

  // HOOKS
  const {isDisabled} = useIsDisabled();

  //INTL
  const intl = useIntl();

  const handleUnitChange = (e) => {
    setUnit(e.target.value);
  };

  // EFFECTS
  useEffect(() => {
    if (section && section.dripped_at) {
      setDrippedAt(new Date(section.dripped_at));
    } else {
      setDrippedAt(null);
    }
  }, [section, setDrippedAt]);

  useEffect(() => {
    if (section) {
      setDripDelay(delay);
    }
  }, [section, setDripDelay]);

  // HANDLERS

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleValueChange = (e) => {
    setDripDelay(e.target.value);
  };
  const handleSave = () => {
    const _delay = unit === unitType.DAYS ? dripDelay : dripDelay * 7;
    CourseService.patchCourseSection(course.id, section.id, {drip_delay: _delay})
      .then((data: SCCourseSectionType) => {
        setOpen(false);
        onSuccess(data);
      })
      .catch((e) => {
        Logger.error(SCOPE_SC_UI, e);
      });
  };

  const handleUpdate = (value) => {
    CourseService.patchCourseSection(course.id, section.id, {dripped_at: value ? value.toISOString() : null})
      .then((data: SCCourseSectionType) => {
        setOpen(false);
        onSuccess(data);
      })
      .catch((e) => {
        Logger.error(SCOPE_SC_UI, e);
      });
  };

  const placeholderStructured =
    dripDelay > 0
      ? intl.formatMessage(
          {
            id: `ui.lessonReleaseMenu.structured.label.${unit}`,
            defaultMessage: `ui.lessonReleaseMenu.structured.label.${unit}`
          },
          {total: dripDelay}
        )
      : intl.formatMessage({
          id: 'ui.lessonReleaseMenu.now.label',
          defaultMessage: 'ui.lessonReleaseMenu.now.label'
        });

  return (
    <Root className={classNames(className, classes.root)} {...rest}>
      {course && course.type === SCCourseTypologyType.SCHEDULED ? (
        <LocalizationProvider
          dateAdapter={AdapterDateFns}
          adapterLocale={scContext.settings.locale.default === 'it' ? itLocale : enLocale}
          localeText={{
            okButtonLabel: `${intl.formatMessage(messages.pickerOkMessage)}`,
            cancelButtonLabel: `${intl.formatMessage(messages.pickerCancelMessage)}`,
            clearButtonLabel: `${intl.formatMessage(messages.pickerClearMessage)}`
          }}>
          <MobileDateTimePicker
            className={classes.picker}
            disablePast
            label={
              drippedAt && (
                <FormattedMessage
                  id="ui.lessonReleaseMenu.scheduled.picker.placeholder"
                  defaultMessage="ui.lessonReleaseMenu.scheduled.picker.placeholder"
                />
              )
            }
            value={drippedAt}
            slots={{
              //actionBar: PickerActionBar,
              tabs: (props) => <DateTimePickerTabs {...props} />,
              textField: (params) => (
                <TextField
                  {...params}
                  error={false}
                  InputProps={{
                    ...params.InputProps,
                    placeholder: `${intl.formatMessage(messages.pickerPlaceholder)}`,
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton disabled={isDisabled}>
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
                    id="ui.lessonReleaseMenu.scheduled.picker.placeholder"
                    defaultMessage="ui.lessonReleaseMenu.scheduled.picker.placeholder"
                  />
                )
              },
              actionBar: {
                actions: ['cancel', 'clear', 'accept']
              }
            }}
            onChange={(value) => setDrippedAt(value)}
            onAccept={handleUpdate}
            onClear={() => setDrippedAt(null)}
            disabled={isDisabled}
          />
        </LocalizationProvider>
      ) : (
        <>
          <TextField
            size="small"
            value={placeholderStructured}
            onClick={isDisabled ? undefined : handleClick}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton onClick={handleClick} disabled={isDisabled}>
                    <Icon>expand_more</Icon>
                  </IconButton>
                </InputAdornment>
              )
            }}
            disabled={isDisabled}
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
                  value={dripDelay}
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
                      value={unitType.DAYS}
                      control={<Radio size="small" />}
                      label={<FormattedMessage id="ui.lessonReleaseMenu.dialog.days" defaultMessage="ui.lessonReleaseMenu.dialog.days" />}
                    />
                    <FormControlLabel
                      value={unitType.WEEKS}
                      control={<Radio size="small" />}
                      label={<FormattedMessage id="ui.lessonReleaseMenu.dialog.weeks" defaultMessage="ui.lessonReleaseMenu.dialog.weeks" />}
                    />
                  </RadioGroup>
                </FormControl>
              </Box>
              <Typography variant="body1">
                {dripDelay > 0 ? (
                  <FormattedMessage
                    id={`ui.lessonReleaseMenu.dialog.info.structured.${unit}`}
                    defaultMessage={`ui.lessonReleaseMenu.dialog.info.structured.${unit}`}
                    values={{total: dripDelay}}
                  />
                ) : (
                  <FormattedMessage id="ui.lessonReleaseMenu.dialog.info.now" defaultMessage="ui.lessonReleaseMenu.dialog.info.now" />
                )}
              </Typography>
              <Button className={classes.popoverAction} variant="contained" disabled={section.drip_delay === dripDelay} onClick={handleSave}>
                <FormattedMessage id="ui.lessonReleaseMenu.dialog.button.done" defaultMessage="ui.lessonReleaseMenu.dialog.button.done" />
              </Button>
            </Box>
          </PopoverRoot>
        </>
      )}
    </Root>
  );
}
