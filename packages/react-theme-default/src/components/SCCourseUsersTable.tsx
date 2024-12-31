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

      '& .SCCourseUsersTable-loading-button': {
        marginTop: theme.spacing(3),
        marginLeft: theme.spacing(3)
      }
    }),
    skeletonRoot: () => ({})
  }
};

export default Component;
