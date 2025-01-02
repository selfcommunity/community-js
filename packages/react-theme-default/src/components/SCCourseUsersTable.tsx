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
    skeletonRoot: () => ({})
  }
};

export default Component;
