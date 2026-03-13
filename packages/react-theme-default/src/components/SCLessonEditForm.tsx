import {darken, getContrastRatio, lighten} from '@mui/material';

const Component = {
  styleOverrides: {
    root: ({theme}: any) => ({
      padding: theme.spacing(2),
      [theme.breakpoints.up('sm')]: {
        paddingBottom: theme.spacing(5)
      },
      height: '100%',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-between',
      '& .SCLessonEditForm-contrast-color': {
        color:
          getContrastRatio(theme.palette.background.paper, theme.palette.common.white) > 4.5
            ? lighten(theme.palette.common.white, 0.5)
            : darken(theme.palette.common.white, 0.5)
      },
      '& .SCLessonEditForm-form': {
        display: 'flex',
        flexDirection: 'column'
      },
      '& .MuiFormLabel-root': {
        fontWeight: 700,
        color: 'inherit',
        '& .Mui-focused': {color: 'inherit'}
      },
      '& .SCLessonEditForm-settings': {
        marginTop: theme.spacing(2)
      },
      '& .SCLessonEditForm-button': {
        alignSelf: 'center',
        marginBottom: theme.spacing(3)
      }
    })
  }
};

export default Component;
