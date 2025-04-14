const Component = {
  styleOverrides: {
    root: ({theme}: any) => ({
      '& .MuiButton-startIcon': {
        '& .MuiIcon-root': {
          fontSize: '0.75rem !important'
        }
      }
    })
  }
};

export default Component;
