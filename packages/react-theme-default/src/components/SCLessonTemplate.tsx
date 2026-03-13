import {darken, getContrastRatio, lighten} from '@mui/material';

const Component = {
  styleOverrides: {
    root: () => ({}),
    containerRoot: ({theme, open}: any) => ({
      display: 'flex',
      flexDirection: 'column',
      paddingBottom: theme.mixins.toolbar.minHeight,
      //overflow: 'hidden',
      transition: theme.transitions.create('margin', {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen
      }),
      marginRight: 0,
      ...(open && {
        [theme.breakpoints.down('md')]: {width: '100%'},
        width: `calc(100% - 300px)`
      }),
      '& .SCLessonTemplate-contrast-color': {
        color:
          getContrastRatio(theme.palette.background.paper, theme.palette.common.white) > 4.5
            ? lighten(theme.palette.common.white, 0.5)
            : darken(theme.palette.common.white, 0.5)
      },
      '& .SCLessonTemplate-navigation-title': {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: theme.spacing(1)
      },
      '& .SCLessonTemplate-preview-info': {
        justifyContent: 'center',
        borderRadius: 5,
        marginBottom: theme.spacing(1)
      },
      '& .SCLessonTemplate-button': {
        alignSelf: 'center',
        marginTop: 'auto'
      }
    })
  }
};

export default Component;
