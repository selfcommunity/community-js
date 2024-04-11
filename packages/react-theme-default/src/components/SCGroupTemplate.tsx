const Component = {
  styleOverrides: {
    root: ({theme}: any) => ({
      marginTop: 0,
      '& .SCCategoryTemplate-feed': {
        marginTop: theme.spacing(2)
      },
      '& .SCGroupInfoWidget-root': {
        marginTop: theme.spacing(2)
      }
    }),
    skeletonRoot: ({theme}: any) => ({
      marginTop: 0,
      [theme.breakpoints.up('md')]: {
        marginTop: 30
      }
    })
  }
};

export default Component;
