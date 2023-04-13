const Component = {
  styleOverrides: {
    root: ({theme}: any) => ({
      height: '100%',
      '& .SCLoyaltyProgramDetailSkeleton-title': {
        display: 'flex',
        marginBottom: theme.spacing(5),
        alignItems: 'center',
        [theme.breakpoints.down('md')]: {
          justifyContent: 'center'
        },
        '& .SCLoyaltyProgramDetailSkeleton-chip': {
          marginLeft: theme.spacing(2),
          borderRadius: theme.shape.borderRadius
        }
      },
      '& .SCLoyaltyProgramDetailSkeleton-section-title': {
        marginBottom: theme.spacing(2),
        '& .SCLoyaltyProgramDetailSkeleton-sub-title': {
          marginBottom: theme.spacing(4)
        }
      },
      '& .SCLoyaltyProgramDetailSkeleton-points-list': {
        marginBottom: theme.spacing(5)
      },
      '& .MuiCard-root': {
        [theme.breakpoints.down('md')]: {
          borderRadius: 0,
          height: '100%'
        },
        '& .MuiCardContent-root': {
          justifyContent: 'center',
          '& .SCLoyaltyProgramDetailSkeleton-content': {
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            marginTop: theme.spacing(2)
          }
        },
        '& .MuiCardActions-root': {
          justifyContent: 'center'
        }
      }
    })
  }
};

export default Component;
