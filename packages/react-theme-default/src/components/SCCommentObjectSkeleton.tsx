import {alpha} from '@mui/system';

const Component = {
  styleOverrides: {
    root: ({theme}: any) => ({
      '&.SCWidget-root': {
        '& .SCBaseItem-text': {
          marginBottom: 0,
          '& > .SCWidget-root': {
            borderRadius: theme.shape.borderRadius * 0.5,
            borderColor: alpha(theme.palette.primary.main, theme.palette.action.activatedOpacity)
          },
          '& .MuiCardContent-root': {
            padding: theme.spacing(1)
          }
        }
      }
    })
  }
};

export default Component;
