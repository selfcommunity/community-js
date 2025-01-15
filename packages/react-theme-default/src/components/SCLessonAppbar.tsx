const Component = {
  styleOverrides: {
    root: ({theme, open}: any) => ({
      boxShadow: 'none',
      borderBottom: `1px solid ${theme.palette.grey[300]}`,
      '& .MuiToolbar-root': {
        minHeight: '60px'
      },
      transition: theme.transitions.create(['margin', 'width'], {
        easing: open ? theme.transitions.easing.easeOut : theme.transitions.easing.sharp,
        duration: open ? theme.transitions.duration.enteringScreen : theme.transitions.duration.leavingScreen
      }),
      ...(open && {
        [theme.breakpoints.down('md')]: {marginRight: '100vw'},
        [theme.breakpoints.up('sm')]: {marginRight: '300px'},
        width: `calc(100% - 300px)`
      })
    })
  }
};

export default Component;
