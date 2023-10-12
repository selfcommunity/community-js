const Component = {
  styleOverrides: {
    root: ({theme}: any) => ({
      '& .MuiToggleButton-root': {
        padding: theme.spacing(0.5, 2),
        fontSize: '1rem',
        fontWeight: theme.typography.fontWeightBold,
        textTransform: 'capitalize'
      }
    })
  }
};

export default Component;
