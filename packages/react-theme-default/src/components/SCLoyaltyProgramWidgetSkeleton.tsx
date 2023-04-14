const Component = {
  styleOverrides: {
    root: ({theme}: any) => ({
      '& .SCLoyaltyProgramWidgetSkeleton-root, .MuiCardContent-root': {
        padding: theme.spacing(2)
      },
      '& .SCLoyaltyProgramWidgetSkeleton-actions, .MuiCardActions-root': {
        display: 'flex',
        justifyContent: 'space-between',
        padding: theme.spacing(0, 3, 2, 2),
        '& .SCLoyaltyProgramWidgetSkeleton-points': {
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center'
        },
        '& .SCLoyaltyProgramWidgetSkeleton-chip': {
          borderRadius: theme.shape.borderRadius,
          marginRight: theme.spacing(2)
        }
      }
    })
  }
};

export default Component;
