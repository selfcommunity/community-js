const Component = {
  styleOverrides: {
    root: ({theme}: any) => ({
      '& .SCLoyaltyProgramSkeleton-root, .MuiCardContent-root': {
        padding: theme.spacing(2)
      },
      '& .SCLoyaltyProgramSkeleton-actions, .MuiCardActions-root': {
        display: 'flex',
        justifyContent: 'space-between',
        padding: theme.spacing(0, 3, 2, 2),
        '& .SCLoyaltyProgramSkeleton-points': {
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center'
        },
        '& .SCLoyaltyProgramSkeleton-chip': {
          borderRadius: theme.shape.borderRadius,
          marginRight: theme.spacing(2)
        }
      }
    })
  }
};

export default Component;
