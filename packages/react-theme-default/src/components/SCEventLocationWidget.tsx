const Component = {
  styleOverrides: {
    root: ({theme}: any) => ({
      '& .SCEventLocationWidget-title, & .SCEventLocationWidget-location-title': {
        fontWeight: theme.typography.fontWeightBold
        // marginBottom: theme.spacing(0.5)
      },
      '& .SCEventLocationWidget-map': {
        marginBottom: theme.spacing(1),
        minHeight: 248,
        width: '100%'
      }
    }),
    skeletonRoot: ({theme}: any) => ({
      '& .SCEventLocationWidget-skeleton-map': {
        margin: theme.spacing(1, 0, 1, 0),
        minHeight: 248,
        width: '100%'
      }
    })
  }
};

export default Component;
