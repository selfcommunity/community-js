const Component = {
  styleOverrides: {
    root: ({theme}: any) => ({
      '& .MuiDialogTitle-root': {
        '& span': {
          flexGrow: 1,
          textAlign: 'center'
        }
      }
    })
  }
};

export default Component;
