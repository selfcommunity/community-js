const Component = {
  styleOverrides: {
    root: ({theme}: any) => ({
      marginTop: 0,
      [theme.breakpoints.up('md')]: {
        marginTop: theme.spacing(4)
      },
      '& .SCUserProfileTemplate-tags': {
        marginTop: theme.spacing(1),
        justifyContent: 'center'
      },
      '& .SCUserProfileTemplate-counters': {
        marginTop: theme.spacing(2),
        justifyContent: 'center',
        display: 'flex',
        alignItems: 'center',
        flexWrap: 'wrap'
      },
      '& .SCUserProfileTemplate-info': {
        marginTop: theme.spacing(1),
        textAlign: 'center'
      },
      '& .SCUserProfileTemplate-feed': {
        marginTop: theme.spacing(2)
      },
      '& .SCUserProfileTemplate-actions': {
        margin: theme.spacing(1, 2, 2, 2),
        justifyContent: 'center'
      }
    })
  }
};

export default Component;
