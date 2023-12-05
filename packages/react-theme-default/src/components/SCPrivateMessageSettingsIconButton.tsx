const Component = {
  styleOverrides: {
    root: ({theme}: any) => ({}),
    menuRoot: ({theme}: any) => ({
      '& .SCNavigationSettingsIconButton-paper': {
        maxWidth: 400,
        padding: theme.spacing(2)
      }
    }),
    drawerRoot: ({theme}: any) => ({
      '& .MuiList-root': {
        '& a': {
          color: 'inherit'
        }
      }
    })
  }
};

export default Component;
