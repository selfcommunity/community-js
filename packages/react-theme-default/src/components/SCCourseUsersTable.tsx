import {getContrastRatio} from '@mui/material';

const Component = {
  styleOverrides: {
    root: ({theme}) => ({
      '&.SCCourseUsersTable-contrast-bg-color': {
        backgroundColor: getContrastRatio(theme.palette.background.default, theme.palette.common.white) > 4.5 ? theme.palette.common.white : undefined
      },

      '& .SCCourseUsersTable-search': {
        '& > .MuiInputBase-root': {
          borderBottomLeftRadius: 'unset',
          borderBottomRightRadius: 'unset'
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
          backgroundColor: theme.palette.grey['300'],

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
      '& .MuiDialogContent-root': {
        [theme.breakpoints.down('md')]: {
          paddingBottom: '20px'
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
