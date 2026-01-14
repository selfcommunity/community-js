import {alpha} from '@mui/system';
import {getContrastRatio} from '@mui/material';

const Component = {
  styleOverrides: {
    root: ({theme}: any) => ({
      '& .SCSearchAutocomplete-input': {
        padding: theme.spacing(0, 2),
        borderRadius: theme.shape.borderRadius,
        '& .MuiAutocomplete-input': {
          padding: theme.spacing(0.5, 1),
          color: getContrastRatio(theme.palette?.navbar?.main, '#fff') > 4.5 ? '#fff' : theme.palette.primary.main
        }
      },
      '& .MuiInputBase-root': {
        '& .MuiIcon-root': {
          color: getContrastRatio(theme.palette?.navbar?.main, '#fff') > 4.5 ? '#fff' : theme.palette.primary.main
        },
        '& fieldset': {
          borderColor: alpha(
            getContrastRatio(theme.palette?.navbar?.main, '#fff') > 4.5 ? '#fff' : theme.palette.primary.main,
            theme.palette.action.disabledOpacity
          )
        },
        '&:hover fieldset': {
          borderColor: getContrastRatio(theme.palette?.navbar?.main, '#fff') > 4.5 ? '#fff' : theme.palette.primary.main
        },
        '&.Mui-focused fieldset': {
          borderColor: getContrastRatio(theme.palette?.navbar?.main, '#fff') > 4.5 ? '#fff' : theme.palette.secondary.main
        },
        '&.Mui-focused .SCSearchAutocomplete-icon': {
          color: getContrastRatio(theme.palette?.navbar?.main, '#fff') > 4.5 ? '#fff' : theme.palette.secondary.main
        }
      }
    })
  }
};

export default Component;
