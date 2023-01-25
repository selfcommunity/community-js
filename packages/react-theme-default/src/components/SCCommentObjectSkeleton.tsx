import {alpha} from '@mui/system';

const Component = {
  styleOverrides: {
    root: ({theme}: any) => ({
      '& .SCWidget-root': {
        borderRadius: theme.shape.borderRadius * 0.5,
        borderColor: alpha(theme.palette.primary.main, theme.palette.action.activatedOpacity),
        '& .MuiCardContent-root': {
          padding: theme.spacing(2)
        }
      }
    })
  }
};

export default Component;
