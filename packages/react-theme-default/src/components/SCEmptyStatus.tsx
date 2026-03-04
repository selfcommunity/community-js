import {darken, getContrastRatio, lighten} from '@mui/material';

const Component = {
  styleOverrides: {
    root: ({theme}) => ({
      alignItems: 'center',
      justifyContent: 'center',
      gap: '10px',
      padding: theme.spacing(3),
      marginTop: '9px',
      backgroundColor:
        getContrastRatio(theme.palette.background.paper, theme.palette.common.white) > 4.5
          ? theme.palette.background.paper
          : theme.palette.common.white,

      '& .SCEmptyStatus-contrast-color': {
        color:
          getContrastRatio(theme.palette.background.paper, theme.palette.common.white) > 4.5
            ? lighten(theme.palette.common.white, 0.5)
            : darken(theme.palette.common.white, 0.5)
      },

      '& .SCEmptyStatus-box': {
        width: '130px',
        height: '130px',
        border:
          getContrastRatio(theme.palette.background.paper, theme.palette.common.white) > 4.5
            ? `2px solid ${theme.palette.grey[800]}`
            : `2px solid ${theme.palette.grey[300]}`,
        borderRadius: '20px',
        marginBottom: '10px',

        '& .SCEmptyStatus-rotated-box': {
          width: 'inherit',
          height: 'inherit',
          border: 'inherit',
          borderRadius: 'inherit',
          transform: 'rotate(-25deg)',
          alignItems: 'center',
          justifyContent: 'center',

          '& .SCEmptyStatus-icon': {
            transform: 'rotate(25deg)'
          }
        }
      }
    })
  }
};

export default Component;
