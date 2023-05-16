import React, {useState} from 'react';
import {styled} from '@mui/material/styles';
import {IconButton, InputAdornment, TextField, TextFieldProps} from '@mui/material';
import Icon from '@mui/material/Icon';
import useInitialAutofilledInput from '../../utils/autofilledInput';

const PREFIX = 'SCPasswordTextField';

const Root = styled(TextField, {
  name: PREFIX,
  slot: 'Root',
  overridesResolver: (props, styles) => styles.root
})(({theme}) => ({}));

export default function PasswordTextField(props: TextFieldProps): JSX.Element {
  // PROPS
  const {id, value = '', onChange, InputLabelProps = {}, ...rest} = props;

  // STATE
  const [showPassword, setShowPassword] = useState<boolean>(false);

  // HOOKS
  const {autofilled, setAutofilledInitialized} = useInitialAutofilledInput(id, value);

  // HANDLERS
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setAutofilledInitialized(true);
    onChange && onChange(event);
  };

  const handleClick = () => {
    setShowPassword(!showPassword);
  };

  // RENDER
  return (
    <Root
      {...(id && {id})}
      {...(!InputLabelProps && {InputLabelProps: {shrink: autofilled}})}
      type={showPassword ? 'text' : 'password'}
      value={value}
      onChange={handleChange}
      InputProps={{
        endAdornment: (
          <>
            {props?.InputProps?.endAdornment}
            <InputAdornment position="end">
              <IconButton aria-label="toggle password visibility" onClick={handleClick} edge="end">
                {showPassword ? <Icon>visibility_off</Icon> : <Icon>visibility</Icon>}
              </IconButton>
            </InputAdornment>
          </>
        )
      }}
      {...rest}
    />
  );
}
