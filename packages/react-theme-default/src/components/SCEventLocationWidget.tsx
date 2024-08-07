const Component = {
  styleOverrides: {
    root: ({theme}: any) => ({
      [theme.breakpoints.up('sm')]: {
        width: 470
      },
      '& .SCEventLocationWidget-title, & .SCEventLocationWidget-location-title': {
        fontWeight: theme.typography.fontWeightBold
        // marginBottom: theme.spacing(0.5)
      },
      '& .SCEventLocationWidget-map': {
        marginBottom: theme.spacing(1),
        height: 248,
        width: '100%'
      }
    }),
    skeletonRoot: ({theme}: any) => ({
      [theme.breakpoints.up('sm')]: {
        width: 470
      },
      '& .SCEventLocationWidget-skeleton-map': {
        margin: theme.spacing(1, 0, 1, 0),
        height: 248,
        width: '100%'
      }
    })
  }
};

export default Component;
