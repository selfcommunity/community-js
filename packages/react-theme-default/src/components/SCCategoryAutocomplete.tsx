const Component = {
  styleOverrides: {
    root: ({theme}: any) => ({
      '& .SCCategoryAutocomplete-paper-contrast-color': {
        color: theme.palette.getContrastText(theme.palette.background.paper)
      }
    })
  }
};

export default Component;
