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
        padding: '1px',
        display: 'flex',
        justifyContent: 'space-between',
        '& img': {
          maxHeight: theme.mixins.toolbar.minHeight,
          paddingLeft: theme.spacing(1.5)
        }
      },
      '& .MuiTypography-subtitle1': {
        fontSize: '1.286rem',
        padding: theme.spacing(0, 2),
        '& MuiButton-root': {
          padding: theme.spacing(1, 1, 1, 2)
        }
      }
    })
  }
};

export default Component;
