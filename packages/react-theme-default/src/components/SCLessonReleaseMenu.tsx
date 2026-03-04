import {darken, getContrastRatio, lighten} from '@mui/material';

const Component = {
  styleOverrides: {
    root: ({theme}: any) => ({}),
    popoverRoot: ({theme}: any) => ({
      width: '260px',
      borderRadius: '4px',
      '& .SCLessonReleaseMenu-popover-contrast-color': {
        color:
          getContrastRatio(theme.palette.background.paper, theme.palette.common.white) > 4.5
            ? lighten(theme.palette.common.white, 0.5)
            : darken(theme.palette.common.white, 0.5)
      },
      '& .MuiPaper-root': {
        padding: theme.spacing(2)
      },
      '& .SCLessonReleaseMenu-popover-content': {
        marginTop: theme.spacing(1),
        '& .SCLessonReleaseMenu-popover-selection': {
          display: 'flex',
          alignItems: 'center',
          gap: theme.spacing(2),
          '& .MuiInputBase-root': {
            width: '68px',
            height: '38px'
          },
          '& .MuiRadio-root': {
            padding: theme.spacing(0.5)
          }
        },
        '& .SCLessonReleaseMenu-popover-action': {
          marginTop: theme.spacing(1),
          width: '100%'
        }
      }
    })
  }
};

export default Component;
