import React, {ReactElement, useCallback, useState} from 'react';
import {FormattedMessage} from 'react-intl';
import {Box, BoxProps, Button, DialogTitle, IconButton, Typography, DialogContent, Icon, styled} from '@mui/material';
import {LocalizationProvider, StaticDateTimePicker, DateTimePickerTabs, DatePickerToolbarProps} from '@mui/x-date-pickers';
import {AdapterDateFns} from '@mui/x-date-pickers/AdapterDateFns';
import itLocale from 'date-fns/locale/it';
import enLocale from 'date-fns/locale/en-US';
import {useSCContext} from '@selfcommunity/react-core';
import classNames from 'classnames';
import {format} from 'date-fns';
import {PREFIX} from '../../constants';
import {capitalize} from '@selfcommunity/utils';

const classes = {
  root: `${PREFIX}-layer-scheduled-root`,
  title: `${PREFIX}-layer-title`,
  content: `${PREFIX}-layer-content`,
  message: `${PREFIX}-layer-scheduled-message`,
  picker: `${PREFIX}-layer-scheduled-picker`,
  toolbar: `${PREFIX}-layer-scheduled-toolbar`
};

const Root = styled(Box, {
  name: PREFIX,
  slot: 'LayerScheduledRoot'
})(() => ({}));

export interface ScheduledLayerProps extends Omit<BoxProps, 'defaultValue'> {
  defaultValue?: Date | null;
  onClose: () => void;
  onSave: (date: Date | null) => void;
}

const ScheduledLayer = React.forwardRef((props: ScheduledLayerProps, ref: React.Ref<unknown>): ReactElement => {
  //PROPS
  const {className, onClose, onSave, defaultValue = null, ...rest} = props;

  //CONTEXT
  const scContext = useSCContext();
  const locale = scContext.settings.locale.default === 'it' ? itLocale : enLocale;

  // STATE
  const [scheduledAt, setScheduledAt] = useState<Date | null>(defaultValue);

  const handleUpdate = useCallback(
    (value: Date | null) => {
      if (value) {
        setScheduledAt(value);
        onSave(value);
      }
    },
    [onSave]
  );

  const CustomToolbar = (props: DatePickerToolbarProps<Date>) => {
    const {value} = props;
    if (!value) return null;
    const dayName = capitalize(format(value, 'EEEE', {locale}));
    const restOfDate = format(value, 'd MMMM yyyy • HH:mm', {locale});
    return <Typography variant="h4">{`${dayName} ${restOfDate}`}</Typography>;
  };

  return (
    <Root ref={ref} className={classNames(className, classes.root)} {...rest}>
      <DialogTitle className={classes.title}>
        <IconButton onClick={onClose}>
          <Icon>arrow_back</Icon>
        </IconButton>
        <Typography>
          <FormattedMessage id="ui.composer.layer.scheduled.title" defaultMessage="Programma la Pubblicazione" />
        </Typography>
        <Button size="small" color="secondary" variant="contained" onClick={() => onSave(scheduledAt)} disabled={!scheduledAt}>
          <FormattedMessage id="ui.composer.layer.scheduled.submit" defaultMessage="Attiva Programmazione" />
        </Button>
      </DialogTitle>

      <DialogContent className={classes.content}>
        <Typography className={classes.message}>
          <FormattedMessage id="ui.composer.layer.scheduled.message" defaultMessage="ui.composer.audience.scheduled.message" />
        </Typography>

        <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={locale}>
          <StaticDateTimePicker
            className={classes.picker}
            disablePast
            value={scheduledAt}
            onChange={(value) => setScheduledAt(value)}
            onAccept={handleUpdate}
            slots={{
              toolbar: CustomToolbar,
              tabs: (props) => <DateTimePickerTabs {...props} />,
              actionBar: () => null
            }}
            slotProps={{
              tabs: {
                hidden: false
              }
            }}
          />
        </LocalizationProvider>
      </DialogContent>
    </Root>
  );
});

export default ScheduledLayer;
