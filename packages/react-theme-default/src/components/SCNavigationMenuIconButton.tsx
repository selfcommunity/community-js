const Component = {
  styleOverrides: {
    root: ({theme}: any) => ({}),
    drawerRoot: ({theme}: any) => ({
      '& .MuiDrawer-paper': {
        width: '100%',
        [theme.breakpoints.up('sm')]: {
          width: theme.spacing(40)
        }
      },
      '& .SCNavigationMenuIconButton-drawer-header': {
        minHeight: theme.mixins.toolbar.minHeight,
        '& img': {
          maxHeight: theme.mixins.toolbar.minHeight,
          paddingLeft: theme.spacing(1.5)
        },
        '& .SCNavigationMenuIconButton-drawer-header-action': {
          float: 'right'
        }
      }
    })
  }
};

export default Component;
