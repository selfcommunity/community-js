import {getContrastRatio} from '@mui/material';

const Component = {
  styleOverrides: {
    root: ({theme}) => ({
      flexDirection: 'row',
      alignItems: 'center',
      gap: theme.spacing(1),

      '&.SCCourseTypePopover-contrast-color': {
        color: getContrastRatio(theme.palette.background.default, theme.palette.common.white) > 4.5 ? theme.palette.common.white : undefined
      },

      '& .SCCourseTypePopover-button': {
        padding: 0,
        textDecoration: 'underline',

        '&:hover': {
          backgroundColor: 'unset',
          textDecoration: 'underline'
        }
      }
    })
  }
};

export default Component;
