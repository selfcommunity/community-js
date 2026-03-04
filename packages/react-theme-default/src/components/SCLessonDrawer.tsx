import {darken, getContrastRatio, lighten} from '@mui/material';

const Component = {
  styleOverrides: {
    root: ({theme}: any) => ({
      [theme.breakpoints.down('md')]: {
        width: '100vw',
        flexShrink: 0
      },
      [theme.breakpoints.up('sm')]: {
        width: '300px'
      },
      '& .SCLessonDrawer-contrast-color': {
        color:
          getContrastRatio(theme.palette.background.paper, theme.palette.common.white) > 4.5
            ? lighten(theme.palette.common.white, 0.5)
            : darken(theme.palette.common.white, 0.5)
      },
      '& h4': {
        fontWeight: theme.typography.fontWeightMedium
      },
      '& .MuiDrawer-paper': {
        width: '100%',
        [theme.breakpoints.up('sm')]: {
          width: '300px'
        },
        backgroundColor:
          getContrastRatio(theme.palette.background.paper, theme.palette.common.white) > 4.5
            ? theme.palette.background.paper
            : theme.palette.grey[200]
      },
      '& .SCLessonDrawer-header': {
        [theme.breakpoints.up('sm')]: {
          minHeight: '60px'
        },
        display: 'block',
        padding: theme.spacing(1.5)
      },
      '& .SCLessonDrawer-header-content': {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between'
      },
      '& .SCLessonDrawer-header-edit': {
        justifyContent: 'space-between'
      },
      '& .SCScrollContainer-root:hover': {
        '& .Mui-disabled': {
          opacity: '0.38 !important'
        }
      }
    })
  }
};

export default Component;
