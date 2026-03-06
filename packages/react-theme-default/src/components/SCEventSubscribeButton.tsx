import {darken, getContrastRatio, lighten} from '@mui/material';

const Component = {
  styleOverrides: {
    selectRoot: ({theme}) => ({
      backgroundColor:
        getContrastRatio(theme.palette.background.paper, theme.palette.common.white) > 4.5 ? theme.palette.grey[800] : theme.palette.grey['A200'],
      color: getContrastRatio(theme.palette.background.paper, theme.palette.common.white) > 4.5 ? theme.palette.common.white : undefined,
      justifyContent: 'space-between',
      height: 33,
      borderRadius: '5px',

      [theme.breakpoints.down('md')]: {
        padding: '10px'
      },

      '&:hover, &:active': {
        backgroundColor:
          getContrastRatio(theme.palette.background.paper, theme.palette.common.white) > 4.5 ? theme.palette.grey[900] : theme.palette.common.black,
        color: theme.palette.common.white,

        '& .MuiIcon-root': {
          color: theme.palette.common.white
        }
      },

      '&.SCEventSubscribeButton-going': {
        backgroundColor: `${theme.palette.success.dark} !important`,
        color: theme.palette.common.white,

        '& .MuiIcon-root': {
          color: theme.palette.common.white
        },

        '&:hover': {
          backgroundColor: theme.palette.success.dark,
          color: theme.palette.common.white,

          '& .MuiIcon-root': {
            color: theme.palette.common.white
          }
        }
      },

      '&.SCEventSubscribeButton-not-going': {
        backgroundColor: theme.palette.error.dark,
        color: theme.palette.common.white,

        '& .MuiIcon-root': {
          color: theme.palette.common.white
        },

        '&:hover': {
          backgroundColor: theme.palette.error.dark,
          color: theme.palette.common.white,

          '& .MuiIcon-root': {
            color: theme.palette.common.white
          }
        }
      }
    }),
    requestRoot: ({theme}) => ({}),
    buyButtonRoot: ({theme}) => ({
      '&:hover, &:active': {
        backgroundColor: theme.palette.common.white,
        color: theme.palette.primary.main,
        border: `1px solid ${theme.palette.primary.main}`,
        '& .MuiIcon-root': {
          color: theme.palette.primary.main
        }
      }
    }),
    menuRoot: ({theme}) => ({
      '& .MuiPaper-root': {
        width: 195,
        borderRadius: '5px',

        '& .MuiList-root .SCEventSubscribeButton-item': {
          paddingTop: 0,
          paddingBottom: 0,
          color:
            getContrastRatio(theme.palette.background.paper, theme.palette.common.white) > 4.5
              ? lighten(theme.palette.common.white, 0.5)
              : darken(theme.palette.common.white, 0.5),
          '&.Mui-disabled': {
            paddingTop: theme.spacing(1),
            paddingBottom: theme.spacing(1)
          },

          '& .Mui-checked .MuiSvgIcon-root': {
            color: theme.palette.success.main
          },

          '& > .MuiFormControlLabel-root': {
            width: '100%',
            marginLeft: 0,
            justifyContent: 'space-between'
          }
        }
      }
    }),
    drawerRoot: ({theme}) => ({
      '& .MuiPaper-root': {
        '& .SCEventSubscribeButton-item': {
          paddingTop: 0,
          paddingBottom: 0,

          '& .Mui-checked .MuiSvgIcon-root': {
            color: theme.palette.success.main
          },

          '& > .MuiFormControlLabel-root': {
            width: '100%',
            marginLeft: 0,
            justifyContent: 'space-between'
          }
        }
      }
    })
  }
};

export default Component;
