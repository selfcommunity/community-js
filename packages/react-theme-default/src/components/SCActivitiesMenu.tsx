const Component = {
  styleOverrides: {
    root: ({theme}: any) => ({
      '& .SCActivitiesMenu-selector': {
        display: 'flex',
        alignItems: 'center',
        textAlign: 'center',
        justifyContent: 'flex-end'
      },
      '& .SCActivitiesMenu-selector .MuiButton-root': {
        textTransform: 'capitalize',
        fontWeight: theme.typography.fontWeightBold
      }
    })
  }
};

export default Component;
