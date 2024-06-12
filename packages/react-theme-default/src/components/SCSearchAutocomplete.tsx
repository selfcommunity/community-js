import {alpha} from '@mui/system';

const Component = {
  styleOverrides: {
    root: ({theme}: any) => ({
      '& .SCSearchAutocomplete-input': {
        padding: theme.spacing(0, 2),
        borderRadius: theme.shape.borderRadius,
        '& .MuiAutocomplete-input': {
          padding: theme.spacing(0.5, 1)
        }
      },
      '& .MuiInputBase-root': {
        '& fieldset': {
          borderColor: alpha(theme.palette.primary.main, theme.palette.action.disabledOpacity)
        },
        '&:hover fieldset': {
          borderColor: theme.palette.primary.main
        },
        '&.Mui-focused fieldset': {
          borderColor: theme.palette.secondary.main
        },
        '&.Mui-focused .SCSearchAutocomplete-icon': {
          color: theme.palette.secondary.main
        }
      }
    })
  }
};

export default Component;
