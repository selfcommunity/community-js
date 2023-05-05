const Component = {
  styleOverrides: {
    root: ({theme}: any) => ({
      height: '100%',
      '& .SCLoyaltyProgramDetailTemplateSkeleton-title': {
        display: 'flex',
        marginBottom: theme.spacing(5),
        alignItems: 'center',
        [theme.breakpoints.down('md')]: {
          justifyContent: 'center'
        },
        '& .SCLoyaltyProgramDetailTemplateSkeleton-chip': {
          marginLeft: theme.spacing(2),
          borderRadius: theme.shape.borderRadius
        }
      },
      '& .SCLoyaltyProgramDetailTemplateSkeleton-section-title': {
        marginBottom: theme.spacing(2),
        '& .SCLoyaltyProgramDetailTemplateSkeleton-sub-title': {
          marginBottom: theme.spacing(4)
        }
      },
      '& .SCLoyaltyProgramDetailTemplateSkeleton-points-list': {
        marginBottom: theme.spacing(5)
      }
    })
  }
};

export default Component;
