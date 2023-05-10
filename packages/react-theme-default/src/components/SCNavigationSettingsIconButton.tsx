const Component = {
  styleOverrides: {
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
