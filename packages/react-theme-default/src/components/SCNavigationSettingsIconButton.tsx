const Component = {
  styleOverrides: {
    drawerRoot: ({theme}: any) => ({
      '& .SCNavigationSettingsIconButton-paper': {
        borderTopLeftRadius: theme.shape.borderRadius,
        borderTopRightRadius: theme.shape.borderRadius
      }
    }),
    menuRoot: ({theme}: any) => ({
      '& .SCNavigationSettingsIconButton-paper': {
        maxWidth: 400,
        padding: theme.spacing(2),
        '& .MuiList-root': {
          padding: 0
        }
      }
    })
  }
};

export default Component;
