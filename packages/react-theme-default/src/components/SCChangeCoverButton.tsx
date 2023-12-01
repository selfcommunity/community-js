const Component = {
  styleOverrides: {
    root: ({theme}: any) => ({
      display: 'flex',
      alignItems: 'center',
      flexWrap: 'wrap',
      '& .MuiButtonBase-root': {
        padding: 6,
        borderRadius: 50,
        minWidth: 'auto'
      },
      '& .SCChangeCoverButton-help-popover': {
        marginLeft: theme.spacing(1)
      }
    })
  }
};

export default Component;
