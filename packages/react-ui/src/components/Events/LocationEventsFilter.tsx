import {ChipProps, FormControl, InputLabel, MenuItem, Radio, Select, styled} from '@mui/material';
import {FormattedMessage} from 'react-intl';
import {useThemeProps} from '@mui/system';
import {PREFIX} from './constants';
import {SCEventLocationFilterType} from '@selfcommunity/types';
import classNames from 'classnames';

const classes = {
  root: `${PREFIX}-root`
};

const Root = styled(FormControl, {
  name: PREFIX,
  slot: 'Root'
})(() => ({}));

export interface LocationEventsFilterProps extends ChipProps {
  /**
   * Overrides or extends the styles applied to the component.
   * @default null
   */
  className?: string;
  value: SCEventLocationFilterType;
  disabled?: boolean;
  autoHide?: boolean;
  handleOnChange: (event: any) => void;
}

const locationOptions = [
  {
    value: SCEventLocationFilterType.ANY,
    label: <FormattedMessage id="ui.events.location.select.any" defaultMessage="ui.events.location.select.any" />
  },
  {
    value: SCEventLocationFilterType.PERSON,
    label: <FormattedMessage id="ui.eventInfoDetails.location.inPerson" defaultMessage="ui.eventInfoDetails.location.inPerson" />
  },
  {
    value: SCEventLocationFilterType.ONLINE,
    label: <FormattedMessage id="ui.eventInfoDetails.location.virtual" defaultMessage="ui.eventInfoDetails.location.virtual" />
  }
];

export default function LocationEventsFilter(inProps: LocationEventsFilterProps): JSX.Element {
  // PROPS
  const props: LocationEventsFilterProps = useThemeProps({
    props: inProps,
    name: PREFIX
  });

  const {className, value, disabled = false, autoHide = false, handleOnChange} = props;

  if (autoHide) {
    return null;
  }

  return (
    <Root className={classNames(classes.root, className)} fullWidth>
      <InputLabel>
        <FormattedMessage id="ui.events.filterByLocation" defaultMessage="ui.events.filterByLocation" />
      </InputLabel>
      <Select
        disabled={disabled}
        size={'small'}
        label={<FormattedMessage id="ui.events.location" defaultMessage="ui.events.location" />}
        value={value}
        onChange={handleOnChange}
        renderValue={(selected) => locationOptions.find((option) => option.value === selected).label}>
        {locationOptions.map((option) => (
          <MenuItem key={option.value} value={option.value}>
            <Radio
              checked={value === option.value}
              value={option.value}
              name="radio-button-select"
              slotProps={{
                input: {
                  'aria-label': `${option.label}`
                }
              }}
            />
            {option.label}
          </MenuItem>
        ))}
      </Select>
    </Root>
  );
}
