import React, {useState} from 'react';
import {styled} from '@mui/material/styles';
import {IconButton, InputAdornment, TextField, TextFieldProps} from '@mui/material';
import VisibilityIcon from '@mui/icons-material/VisibilityOutlined';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOffOutlined';

const PREFIX = 'SCPasswordTextField';

const Root = styled(TextField, {
  name: PREFIX,
  slot: 'Root',
  overridesResolver: (props, styles) => styles.root
})(({theme}) => ({}));

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
      InputProps={{
        endAdornment: (
          <InputAdornment position="end">
            <IconButton aria-label="toggle password visibility" onClick={handleClick} onMouseDown={handleClick} edge="end">
              {showPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
            </IconButton>
          </InputAdornment>
        )
      }}
    />
  );
}
