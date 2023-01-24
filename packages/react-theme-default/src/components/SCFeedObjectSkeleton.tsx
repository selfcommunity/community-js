const Component = {
  styleOverrides: {
    root: ({theme}: any) => ({
      '&.SCFeedObjectSkeleton-preview, &.SCFeedObjectSkeleton-detail': {
        border: `0 none`,
        boxShadow: '0px 0px 10px rgba(0, 0, 0, 0.1)',
        borderRadius: 0,
        [theme.breakpoints.up('sm')]: {
          borderRadius: theme.shape.borderRadius
        }
      },
      '& .SCFeedObjectSkeleton-snippet > *': {
        paddingLeft: 0,
        paddingRight: 0
      }
    })
  }
};

export default Component;
