const Component = {
  styleOverrides: {
    root: ({theme}: any) => ({}),
    skeletonRoot: ({theme}: any) => ({}),
    dialogRoot: ({theme}: any) => ({
      '& .infinite-scroll-component__outerdiv .infinite-scroll-component .SCFeedObject-snippet': {
        marginLeft: `0 !important`
      }
    })
  }
};

export default Component;
