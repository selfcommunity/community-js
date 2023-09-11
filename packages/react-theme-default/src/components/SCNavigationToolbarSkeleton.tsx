const Component = {
  styleOverrides: {
    root: ({theme}: any) => ({
      '& .SCNavigationToolbarSkeleton-logo': {
        width: 100,
        height: 20
      },
      '& .SCNavigationToolbarSkeleton-navigation': {
        flexGrow: 1,
        margin: theme.spacing(0, 20)
      },
      '& .SCNavigationToolbarSkeleton-avatar': {
        width: theme.selfcommunity.user.avatar.sizeMedium,
        height: theme.selfcommunity.user.avatar.sizeMedium
      },
      [theme.breakpoints.up('xs')]: {
        minHeight: 45
      }
    })
  }
};

export default Component;
