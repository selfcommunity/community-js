const Component = {
  styleOverrides: {
    root: ({theme}: any) => ({
      '& .SCLoyaltyProgram-actions': {
        padding: theme.spacing(2),
        '& .SCLoyaltyProgram-points-box': {
          borderRadius: theme.shape.borderRadius,
          backgroundColor: theme.palette.secondary.main,
          padding: theme.spacing(1, 2),
          ' .SCLoyaltyProgram-points': {
            fontSize: '1rem',
            fontWeight: theme.typography.fontWeightBold,
            backgroundColor: theme.palette.secondary.main
          }
        }
      }
    })
  }
};

export default Component;
