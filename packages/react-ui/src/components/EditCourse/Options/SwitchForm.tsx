import {FormControl, FormControlLabel, FormLabel, Switch, Typography} from '@mui/material';
import {ChangeEvent, useCallback, useState} from 'react';
import {FormattedMessage} from 'react-intl';

interface SwitchFormProps {
  name: string;
  title: string;
  description: string;
  checked: boolean;
  handleChangeOptions: (key: string, value: boolean) => void;
}

export default function SwitchForm(props: SwitchFormProps) {
  // PROPS
  const {name, title, description, checked, handleChangeOptions} = props;

  // STATES
  const [value, setValue] = useState(checked);

  // HANDLERS
  const handleChange = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      const _checked = e.target.checked;

      setValue(_checked);
      handleChangeOptions(name, _checked);
    },
    [setValue]
  );

  return (
    <FormControl component="fieldset" variant="standard">
      <FormLabel component="legend">
        <Typography variant="h5">
          <FormattedMessage id={title} defaultMessage={title} />
        </Typography>
      </FormLabel>
      <FormControlLabel
        control={<Switch color="primary" checked={value} name={name} onChange={handleChange} />}
        label={
          <Typography variant="body1">
            <FormattedMessage id={description} defaultMessage={description} />
          </Typography>
        }
      />
    </FormControl>
  );
}
