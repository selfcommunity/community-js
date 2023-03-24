const Component = {
  styleOverrides: {
    root: ({theme}: any) => ({
      color: theme.palette.primary.main,
      marginTop: theme.spacing(0.5),
      marginBottom: theme.spacing(0.5),
      borderRadius: '50%',
      padding: theme.spacing(1.5),
      minWidth: 0,
      '& .MuiIcon-root': {
        fontSize: '1.571rem'
      }
    })
  }
};

export default Component;
