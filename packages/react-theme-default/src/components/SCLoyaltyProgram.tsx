const Component = {
  styleOverrides: {
    root: ({theme}: any) => ({
      '& .SCLoyaltyProgram-actions': {
        padding: theme.spacing(0, 2, 2),
        '& .SCLoyaltyProgram-points': {
          borderRadius: theme.shape.borderRadius,
          backgroundColor: theme.palette.secondary.main,
          padding: theme.spacing(1, 2),
          fontSize: '1rem',
          fontWeight: theme.typography.fontWeightBold
        }
      }
    })
  }
};

export default Component;
