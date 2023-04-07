const Component = {
  styleOverrides: {
    root: ({theme}: any) => ({
      '& .MuiCardContent-root': {
        padding: theme.spacing(2, 3, 2, 3)
      },
      '& .SCLoyaltyProgram-title': {
        fontWeight: theme.typography.fontWeightBold,
        fontSize: '1.143rem'
      },
      '& .SCLoyaltyProgram-actions': {
        display: 'flex',
        justifyContent: 'space-between',
        padding: theme.spacing(0, 3, 2, 3),
        '& .SCLoyaltyProgram-points': {
          fontSize: '1rem',
          fontWeight: theme.typography.fontWeightBold,
          textTransform: 'uppercase',
          color: theme.palette.secondary.main,
          '& .MuiChip-root': {
            color: theme.palette.common.white,
            borderRadius: theme.shape.borderRadius,
            backgroundColor: theme.palette.secondary.main,
            marginRight: theme.spacing(1)
          }
        }
      }
    })
  }
};

export default Component;
