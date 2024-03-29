const Component = {
  styleOverrides: {
    root: ({theme}: any) => ({}),
    menuRoot: ({theme}: any) => ({
      '& .SCGroupSettingsIconButton-paper': {
        maxWidth: 400,
        padding: theme.spacing(1)
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
