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
        padding: theme.spacing(0.5),
        '& img': {
          maxHeight: theme.mixins.toolbar.minHeight
        },
        '& .SCNavigationMenuIconButton-drawer-header-action': {
          float: 'right'
        }
      }
    })
  }
};

export default Component;
