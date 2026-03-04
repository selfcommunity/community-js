import {darken, getContrastRatio, lighten} from '@mui/material';

const Component = {
  styleOverrides: {
    root: ({theme}) => ({
      '& .SCCourseCompletedDialog-wrapper': {
        alignItems: 'center',

        '& .SCCourseCompletedDialog-contrast-color': {
          color:
            getContrastRatio(theme.palette.background.paper, theme.palette.common.white) > 4.5
              ? lighten(theme.palette.common.white, 0.5)
              : darken(theme.palette.common.white, 0.5)
        },

        '& .SCCourseCompletedDialog-title': {
          marginTop: '60px',
          marginBottom: '27px'
        },

        '& .SCCourseCompletedDialog-description-pt1': {
          marginTop: '27px'
        },

        '& .SCCourseCompletedDialog-description-pt2': {
          marginTop: '11px',
          marginBottom: '53px'
        }
      }
    })
  }
};

export default Component;
