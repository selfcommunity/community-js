const Component = {
  styleOverrides: {
    root: ({theme}: any) => ({
      '& .MuiCardContent-root': {
        padding: theme.spacing(2)
      },
      '& .SCLoyaltyProgramWidget-title': {
        fontWeight: theme.typography.fontWeightBold,
        fontSize: '1.143rem'
      },
      '& .SCLoyaltyProgramWidget-actions': {
        display: 'flex',
        justifyContent: 'space-between',
        padding: theme.spacing(0, 3, 2, 3),
        '& .SCLoyaltyProgramWidget-points': {
          fontSize: '1rem',
          fontWeight: theme.typography.fontWeightBold,
          textTransform: 'uppercase',
          color: theme.palette.secondary.main,
          display: 'flex',
          alignItems: 'center',
          '& .MuiChip-root': {
            color: theme.palette.common.white,
            borderRadius: theme.shape.borderRadius,
            backgroundColor: theme.palette.secondary.main,
            marginRight: theme.spacing(1)
          }
        }
      }
    }),
    skeletonRoot: ({theme}: any) => ({
      '& .MuiCardContent-root': {
        padding: theme.spacing(2)
      },
      '& .SCLoyaltyProgramWidget-actions, .MuiCardActions-root': {
        display: 'flex',
        justifyContent: 'space-between',
        padding: theme.spacing(0, 3, 2, 2),
        '& .SCLoyaltyProgramWidget-points': {
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center'
        },
        '& .SCLoyaltyProgramWidget-chip': {
          borderRadius: theme.shape.borderRadius,
          marginRight: theme.spacing(2)
        }
      }
    })
  }
};

export default Component;
