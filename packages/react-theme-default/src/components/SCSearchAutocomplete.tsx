const Component = {
  styleOverrides: {
    root: ({theme}: any) => ({
      '& .SCSearchAutocomplete-input': {
        padding: theme.spacing(0, 2),
        borderRadius: theme.shape.borderRadius,
        '& .MuiAutocomplete-input': {
          padding: theme.spacing(0.5, 1)
        }
      }
    })
  }
};

export default Component;
