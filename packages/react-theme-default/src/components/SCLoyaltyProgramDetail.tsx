import {alpha} from '@mui/system';

const Component = {
  styleOverrides: {
    root: ({theme}: any) => ({
      boxShadow: 'none',
      borderRadius: 0,
      '& .SCLoyaltyProgramDetail-title': {
        fontWeight: theme.typography.fontWeightBold,
        fontSize: '1.286rem',
        marginBottom: theme.spacing(5),
        [theme.breakpoints.down('md')]: {
          textAlign: 'center'
        }
      },
      '& .SCLoyaltyProgramDetail-section-title': {
        fontWeight: theme.typography.fontWeightBold,
        fontSize: '1.143rem',
        marginBottom: theme.spacing(1)
      },
      '& .SCLoyaltyProgramDetail-section-info': {
        marginBottom: theme.spacing(5),
        [theme.breakpoints.down('md')]: {
          marginBottom: theme.spacing(3)
        }
      },
      '& .SCLoyaltyProgramDetail-user-points': {
        marginLeft: theme.spacing(2),
        backgroundColor: theme.palette.secondary.main,
        '& .MuiChip-label': {
          fontSize: '1rem',
          fontWeight: theme.typography.fontWeightBold,
          color: theme.palette.common.white,
          padding: theme.spacing(1, 2, 1, 2)
        }
      },
      '& .SCLoyaltyProgramDetail-prize-section': {
        '& .MuiGrid-item': {
          [theme.breakpoints.down('md')]: {
            marginBottom: theme.spacing(4)
          }
        }
      },
      '& .SCLoyaltyProgramDetail-card': {
        boxShadow: '0px 3px 6px rgba(0, 0, 0, 0.3)',
        [theme.breakpoints.down('md')]: {
          borderRadius: 0,
          height: '100%'
        },
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        height: theme.spacing(53),
        '& .SCLoyaltyProgramDetail-card-title': {
          fontWeight: theme.typography.fontWeightBold,
          fontSize: '1.143rem'
        },
        '& .MuiCardContent-root': {
          padding: theme.spacing(2),
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          '& .SCLoyaltyProgramDetail-card-content': {
            padding: theme.spacing(1, 0, 0, 0),
            maxHeight: theme.spacing(12.5),
            overflow: 'hidden',
            textOverflow: 'ellipsis'
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
        '& .SCLoyaltyProgramDetail-prize-points': {
          marginTop: theme.spacing(2),
          '& .MuiChip-root': {
            backgroundColor: theme.palette.secondary.main,
            '& .MuiChip-label': {
              fontSize: '1.143rem',
              fontWeight: theme.typography.fontWeightBold,
              color: theme.palette.common.white
            }
          },
          '& .SCLoyaltyProgramDetail-not-requestable': {
            backgroundColor: theme.palette.error.main
          }
        }
      },
      '& .SCLoyaltyProgramDetail-end-section': {
        boxShadow: 'none',
        '& .MuiButtonBase-root': {
          padding: 0
        }
      },
      '& .SCLoyaltyProgramDetailPointsList-root': {
        marginTop: theme.spacing(1),
        marginBottom: theme.spacing(5),
        '& .MuiGrid-item': {
          paddingTop: theme.spacing(1),
          '& .SCLoyaltyProgramDetailPointsList-element': {
            display: 'flex',
            justifyContent: 'space-between',
            marginBottom: theme.spacing(1)
          }
        }
      }
    })
  }
};

export default Component;
