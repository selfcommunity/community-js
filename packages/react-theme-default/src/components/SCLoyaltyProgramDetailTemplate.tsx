import {alpha} from '@mui/system';

const Component = {
  styleOverrides: {
    root: ({theme}: any) => ({
      [theme.breakpoints.down('sm')]: {
        padding: theme.spacing(1)
      },
      boxShadow: 'none',
      borderRadius: 0,
      '& .SCLoyaltyProgramDetailTemplate-title': {
        fontWeight: theme.typography.fontWeightBold,
        fontSize: '1.286rem',
        marginTop: theme.spacing(2),
        marginBottom: theme.spacing(2),
        [theme.breakpoints.down('md')]: {
          textAlign: 'center'
        }
      },
      '& .SCLoyaltyProgramDetailTemplate-section-title': {
        fontWeight: theme.typography.fontWeightBold,
        fontSize: '1.143rem',
        marginBottom: theme.spacing(1)
      },
      '& .SCLoyaltyProgramDetailTemplate-section-info': {
        marginBottom: theme.spacing(2)
      },
      '& .SCLoyaltyProgramDetailTemplate-user-points': {
        marginLeft: theme.spacing(2),
        backgroundColor: theme.palette.secondary.main,
        '& .MuiChip-label': {
          fontSize: '1rem',
          fontWeight: theme.typography.fontWeightBold,
          color: theme.palette.common.white,
          padding: theme.spacing(1, 2, 1, 2)
        }
      },
      '& .SCLoyaltyProgramDetailTemplate-prize-section': {
        '& .MuiGrid-item': {
          [theme.breakpoints.up('sm')]: {
            paddingLeft: theme.spacing(4),
            paddingRight: theme.spacing(2)
          },
          [theme.breakpoints.down('md')]: {
            marginBottom: theme.spacing(4)
          }
        }
      },
      '& .SCLoyaltyProgramDetailTemplate-card': {
        boxShadow: '0px 3px 6px rgba(0, 0, 0, 0.3)',
        [theme.breakpoints.down('md')]: {
          borderRadius: 0
        },
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100%',
        '& .SCLoyaltyProgramDetailTemplate-card-title': {
          fontWeight: theme.typography.fontWeightBold,
          fontSize: '1.143rem'
        },
        '& .MuiCardContent-root': {
          padding: theme.spacing(2),
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          '& .SCLoyaltyProgramDetailTemplate-card-content': {
            paddingTop: theme.spacing(1),
            maxHeight: theme.spacing(12.5),
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            display: '-webkit-box',
            WebkitBoxOrient: 'vertical',
            WebkitLineClamp: 4
          }
        },
        '& .MuiCardActions-root': {
          marginTop: 'auto',
          '& .MuiButtonBase-root': {
            '&:hover, &:active': {
              backgroundColor: alpha(theme.palette.primary.main, theme.palette.action.hoverOpacity)
            }
          }
        },
        '& .MuiCardMedia-root': {
          height: theme.spacing(17)
        },
        '& .SCLoyaltyProgramDetailTemplate-prize-points': {
          marginTop: theme.spacing(2),
          '& .MuiChip-root': {
            backgroundColor: theme.palette.secondary.main,
            '& .MuiChip-label': {
              fontSize: '1.143rem',
              fontWeight: theme.typography.fontWeightBold,
              color: theme.palette.common.white
            }
          },
          '& .SCLoyaltyProgramDetailTemplate-not-requestable': {
            backgroundColor: theme.palette.error.main
          }
        }
      },
      '& .SCLoyaltyProgramDetailTemplate-points-list-root': {
        marginTop: theme.spacing(1),
        marginBottom: theme.spacing(2),
        '& .MuiGrid-item': {
          paddingTop: theme.spacing(1),
          '& .SCLoyaltyProgramDetailTemplate-element': {
            display: 'flex',
            justifyContent: 'space-between',
            marginBottom: theme.spacing(1)
          }
        }
      },
      '& .SCLoyaltyProgramDetailTemplate-end-message': {
        padding: theme.spacing(3, 2),
        fontWeight: theme.typography.fontWeightBold,
        textAlign: 'center',
        '& .MuiButtonBase-root': {
          paddingLeft: theme.spacing(1)
        }
      }
    }),
    skeletonRoot: ({theme}: any) => ({
      height: '100%',
      '& .SCLoyaltyProgramDetailTemplate-title': {
        display: 'flex',
        marginBottom: theme.spacing(5),
        alignItems: 'center',
        [theme.breakpoints.down('md')]: {
          justifyContent: 'center'
        },
        '& .SCLoyaltyProgramDetailTemplate-chip': {
          marginLeft: theme.spacing(2),
          borderRadius: theme.shape.borderRadius
        }
      },
      '& .SCLoyaltyProgramDetailTemplate-section-title': {
        marginBottom: theme.spacing(2),
        '& .SCLoyaltyProgramDetailTemplate-sub-title': {
          marginBottom: theme.spacing(4)
        }
      },
      '& .SCLoyaltyProgramDetailTemplate-points-list': {
        marginBottom: theme.spacing(5)
      }
    }),
    prizeItemSkeletonRoot: ({theme}: any) => ({
      [theme.breakpoints.up('sm')]: {
        width: theme.spacing(45),
        height: theme.spacing(45),
        marginTop: theme.spacing(3)
      },
      '& .MuiCard-root': {
        [theme.breakpoints.down('md')]: {
          borderRadius: 0,
          height: '100%'
        }
      },
      '& .MuiCardContent-root': {
        justifyContent: 'center',
        '& .SCLoyaltyProgramDetailTemplate-content': {
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          marginTop: theme.spacing(2),
          paddingBottom: theme.spacing(8)
        }
      },
      '& .MuiCardActions-root': {
        justifyContent: 'center'
      }
    })
  }
};

export default Component;
