const Component = {
  styleOverrides: {
    root: ({theme}: any) => ({
      '& .MuiTypography-root': {
        marginBottom: theme.spacing(2)
      },
      '& .SCAccountDelete-confirm > .MuiTextField-root': {
        display: 'block'
      }
    })
  }
};

export default Component;
