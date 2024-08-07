const Component = {
  styleOverrides: {
    root: ({theme}: any) => ({
      marginTop: 0,
      '& .SCGroupInfoWidget-root': {
        padding: theme.spacing(1)
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
