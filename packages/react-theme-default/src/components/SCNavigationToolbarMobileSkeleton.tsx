const Component = {
  styleOverrides: {
    root: ({theme}: any) => ({
      '& .SCNavigationToolbarMobileSkeleton-logo': {
        width: 100,
        height: 20
      },
      [theme.breakpoints.up('xs')]: {
        minHeight: 45
      }
    })
  }
};

export default Component;
