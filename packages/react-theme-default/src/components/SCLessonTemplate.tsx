const Component = {
  styleOverrides: {
    root: () => ({}),
    containerRoot: ({theme, open}: any) => ({
      display: 'flex',
      flexDirection: 'column',
      overflow: 'hidden',
      transition: theme.transitions.create('margin', {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen
      }),
      marginRight: 0,
      ...(open && {
        [theme.breakpoints.down('md')]: {width: '100%'},
        width: `calc(100% - 300px)`
      }),
      '& .SCLessonTemplate-navigation-title': {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: theme.spacing(1)
      },
      '& .SCLessonTemplate-button': {
        alignSelf: 'center',
        marginTop: 'auto'
      }
    })
  }
};

export default Component;
