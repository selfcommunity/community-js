const Component = {
  styleOverrides: {
    root: ({theme}) => ({
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

      '& .SCCourseUsersTable-loading-button': {
        marginTop: theme.spacing(3),
        marginLeft: theme.spacing(3)
      }
    }),
    skeletonRoot: () => ({}),
    dialogRoot: ({theme}) => ({
      '& .SCCourseUsersTable-dialog-content-wrapper': {
        gap: '8px',

        [theme.breakpoints.down('sm')]: {
          marginTop: '22px'
        },

        '& .SCCourseUsersTable-dialog-info-outer-wrapper': {
          gap: '9px',
          border: `1px solid ${theme.palette.grey['300']}`,
          borderRadius: '10px',
          padding: theme.spacing('15px', 3, '25px'),

          '& .SCCourseUsersTable-dialog-info-inner-wrapper': {
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: theme.spacing(2),

            '& .SCCourseUsersTable-dialog-avatar-wrapper': {
              flexDirection: 'row',
              alignItems: 'center',
              gap: theme.spacing(1),

              '& .SCCourseUsersTable-dialog-avatar': {
                width: '30px',
                height: '30px'
              }
            }
          }
        }
      }
    })
  }
};

export default Component;
