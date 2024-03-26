const Component = {
  styleOverrides: {
    root: ({theme}: any) => ({
      '& .MuiButton-startIcon': {
        marginRight: theme.spacing(0.5),
        '& .MuiIcon-root': {
          fontSize: '0.75rem !important'
        }
      }
    })
  }
};

export default Component;
