import {getContrastRatio} from '@mui/material/styles';

const Component = {
  styleOverrides: {
    root: ({theme}: any) => ({
      color: getContrastRatio(theme.palette?.navbar?.main, '#fff') > 4.5 ? '#fff' : theme.palette.text.primary,
      backgroundColor: theme.palette?.navbar?.main
    })
  }
};

export default Component;
