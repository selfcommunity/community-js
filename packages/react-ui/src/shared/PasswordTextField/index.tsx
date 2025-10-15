import {useState} from 'react';
import {styled, IconButton, InputAdornment, TextField, TextFieldProps, Icon} from '@mui/material';

const PREFIX = 'SCPasswordTextField';

const Root = styled(TextField, {
  name: PREFIX,
  slot: 'Root',
  overridesResolver: (_props, styles) => styles.root
})(() => ({}));

export default function PasswordTextField(props: TextFieldProps): JSX.Element {
  // STATE
  const [showPassword, setShowPassword] = useState<boolean>(false);

  // HANDLERS
  const handleClick = () => {
    setShowPassword(!showPassword);
  };

  // RENDER
  return (
    <Root
      type={showPassword ? 'text' : 'password'}
      {...props}
      slotProps={{
        input: {
          endAdornment: (
            <>
              {props?.slotProps.input?.['endAdornment']}
              <InputAdornment position="end">
                <IconButton aria-label="toggle password visibility" onClick={handleClick} edge="end">
                  {showPassword ? <Icon>visibility_off</Icon> : <Icon>visibility</Icon>}
                </IconButton>
              </InputAdornment>
            </>
          )
        }
      }}
    />
  );
}
