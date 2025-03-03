const Component = {
  styleOverrides: {
    root: ({theme}: any) => ({
      backgroundColor: theme.palette.common.white
    }),
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
        [theme.breakpoints.down('md')]: {marginRight: '100vw', width: '100%'},
        [theme.breakpoints.up('sm')]: {marginRight: '300px'},
        width: `calc(100% - 300px)`
      }),
      '& .SCLessonTemplate-navigation-title': {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between'
      }
    })
  }
};

export default Component;
