const Component = {
  styleOverrides: {
    root: ({theme}: any) => ({
      '& .SCLanguageSwitcher-label': {
        fontWeight: theme.typography.fontWeightBold
      },
      '& .MuiInputBase-root': {
        textTransform: 'uppercase'
      },
      '& fieldset.MuiOutlinedInput-notchedOutline': {
        borderWidth: 0
      }
    })
  }
};

export default Component;
