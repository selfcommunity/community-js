import {darken, getContrastRatio, lighten} from '@mui/material';

const Component = {
  styleOverrides: {
    root: ({theme}) => ({
      border:
        getContrastRatio(theme.palette.background.paper, theme.palette.common.white) > 4.5
          ? `1px solid ${theme.palette.grey[800]}`
          : `1px solid ${theme.palette.grey[300]}`,
      borderRadius: '5px',
      padding: theme.spacing(1),
      backgroundColor:
        getContrastRatio(theme.palette.background.paper, theme.palette.common.white) > 4.5
          ? theme.palette.background.paper
          : theme.palette.common.white,

      [theme.breakpoints.up('sm')]: {
        padding: theme.spacing(2)
      },

      '& .SCCourseUsersTable-default-contrast-color': {
        color: theme.palette.getContrastText(theme.palette.background.default)
      },

      '& .SCCourseUsersTable-paper-contrast-color': {
        color: theme.palette.getContrastText(theme.palette.background.paper)
      },

      '& .SCCourseUsersTable-search': {
        '& > .MuiInputBase-root': {
          borderBottomLeftRadius: 'unset',
          borderBottomRightRadius: 'unset',

          '& > input': {
            color:
              getContrastRatio(theme.palette.background.paper, theme.palette.common.white) > 4.5
                ? lighten(theme.palette.common.white, 0.5)
                : darken(theme.palette.common.white, 0.5)
          }
        },

        '& .SCCourseUsersTable-end-adornment-wrapper': {
          flexDirection: 'row',

          '& .SCCourseUsersTable-search-button': {
            minWidth: 'unset',
            width: '36px',
            height: '36px',
            padding: theme.spacing(1)
          }
        }
      },

      '& .SCCourseUsersTable-avatar-wrapper': {
        flexDirection: 'row',
        alignItems: 'center',
        gap: theme.spacing(2),

        '& .MuiAvatar-root': {
          width: '30px',
          height: '30px'
        }
      },

      '& .SCCourseUsersTable-progress-wrapper': {
        flexDirection: 'row',
        alignItems: 'center',
        gap: '4px',

        '& .SCCourseUsersTable-progress': {
          width: '100%',
          borderRadius: '28px',
          backgroundColor:
            getContrastRatio(theme.palette.background.paper, theme.palette.common.white) > 4.5 ? theme.palette.grey[800] : theme.palette.grey[300],

          [theme.breakpoints.down('sm')]: {
            display: 'none'
          }
        }
      },

      '& .SCCourseUsersTable-request-button-wrapper': {
        flexDirection: 'row',
        gap: '5px'
      },

      '& .SCCourseUsersTable-loading-button': {
        marginTop: theme.spacing(3),
        marginLeft: theme.spacing(3)
      }
    }),
    skeletonRoot: ({theme}) => ({
      paddingTop: theme.spacing(3)
    }),
    dialogRoot: ({theme}) => ({
      '& .SCCourseUsersTable-dialog-paper-contrast-color': {
        color: theme.palette.getContrastText(theme.palette.background.paper)
      },

      '& .MuiDialogTitle-root': {
        color:
          getContrastRatio(theme.palette.background.paper, theme.palette.common.white) > 4.5
            ? lighten(theme.palette.common.white, 0.5)
            : darken(theme.palette.common.white, 0.5)
      },

      '& .MuiDialogContent-root': {
        [theme.breakpoints.down('md')]: {
          paddingBottom: '20px'
        },

        '& .SCCourseUsersTable-contrast-color': {
          color:
            getContrastRatio(theme.palette.background.paper, theme.palette.common.white) > 4.5
              ? lighten(theme.palette.common.white, 0.5)
              : darken(theme.palette.common.white, 0.5)
        },

        '& .SCCourseUsersTable-content-wrapper': {
          gap: theme.spacing(1),

          [theme.breakpoints.down('md')]: {
            marginTop: '22px'
          },

          '& .SCCourseUsersTable-info-outer-wrapper': {
            gap: '9px',
            border: `1px solid ${theme.palette.grey['300']}`,
            borderRadius: '10px',
            padding: theme.spacing('15px', 3, '25px'),

            '& .SCCourseUsersTable-info-inner-wrapper': {
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: theme.spacing(2),

              '& .SCCourseUsersTable-avatar-wrapper': {
                flexDirection: 'row',
                alignItems: 'center',
                gap: theme.spacing(1),

                '& .SCCourseUsersTable-avatar': {
                  width: '30px',
                  height: '30px'
                }
              }
            }
          }
        }
      }
    })
  }
};

export default Component;
