const Component = {
  styleOverrides: {
    root: ({theme}: any) => ({
      '& .SCFeed-root > MuiGrid-item': {
        paddingTop: 0
      }
    }),
    skeletonRoot: ({theme}: any) => ({
      marginTop: theme.spacing(2)
    })
  }
};

export default Component;
