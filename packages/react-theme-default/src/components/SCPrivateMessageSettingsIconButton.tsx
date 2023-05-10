const Component = {
  styleOverrides: {
    menuRoot: ({theme}: any) => ({
      '& .SCNavigationSettingsIconButton-paper': {
        maxWidth: 400,
        padding: theme.spacing(2)
      }
    })
  }
};

export default Component;
