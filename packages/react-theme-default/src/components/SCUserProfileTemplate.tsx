const Component = {
  styleOverrides: {
    root: ({theme}: any) => ({
      marginTop: 0,
      '& .SCUserProfileTemplate-tags': {
        marginTop: theme.spacing(2),
        marginLeft: theme.spacing(2),
        justifyContent: 'start'
      },
      '& .SCUserProfileTemplate-counters': {
        marginLeft: theme.spacing(1.25),
        justifyContent: 'start',
        display: 'flex',
        alignItems: 'center',
        flexWrap: 'wrap'
      },
      '& .SCUserProfileTemplate-info': {
        marginTop: theme.spacing(1),
        marginLeft: theme.spacing(2),
        textAlign: 'start'
      },
      '& .SCUserProfileTemplate-feed': {
        marginTop: theme.spacing(2)
      },
      '& .SCUserProfileTemplate-actions': {
        [theme.breakpoints.up('md')]: {
          margin: theme.spacing(1, 2, 2, 2)
        },
        height: 'fit-content',
        marginTop: theme.spacing(1)
      }
    }),
    skeletonRoot: ({theme}: any) => ({
      marginTop: theme.spacing(2)
    })
  }
};

export default Component;
