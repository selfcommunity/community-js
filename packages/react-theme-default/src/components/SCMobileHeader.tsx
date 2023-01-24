const Component = {
  styleOverrides: {
    root: ({theme}: any) => ({
      '& .MuiButtonBase-root': {
        color: theme.palette.text.secondary
      }
    })
  }
};

export default Component;
