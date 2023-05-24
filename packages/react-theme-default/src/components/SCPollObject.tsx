import {alpha} from '@mui/system';

const Component = {
  styleOverrides: {
    root: ({theme}: any) => ({
      marginTop: theme.spacing(1),
      marginBottom: theme.spacing(1),
      borderTop: `1px solid ${alpha(theme.palette.primary.main, theme.palette.action.activatedOpacity)}`,
      borderBottom: `1px solid ${alpha(theme.palette.primary.main, theme.palette.action.activatedOpacity)}`,
      boxShadow: 'none',
      borderRadius: 0,
      '& .MuiButton-root': {
        '&:focus:not(:focus-visible)': {
          borderColor: alpha(theme.palette.primary.main, theme.palette.action.activatedOpacity)
        }
      },
      '& .MuiCardHeader-root': {
        textAlign: 'center',
        padding: theme.spacing(2),
        '& .SCPollObject-toggle-button': {
          fontSize: '0.875rem',
          textTransform: 'uppercase',
          '& .MuiButton-endIcon': {
            display: 'none'
          },
          '& .SCPollObject-expand-icon': {
            marginBottom: 2,
            marginLeft: -2,
            transition: theme.transitions.create('transform', {
              duration: theme.transitions.duration.shortest
            })
          },
          '& .SCPollObject-collapsed-icon': {
            transform: 'rotate(180deg)'
          }
        }
      },
      '& .SCPollObject-title': {
        textAlign: 'center',
        color: theme.palette.text.primary,
        marginBottom: theme.spacing(1),
        fontWeight: theme.typography.fontWeightBold
      },
      '& .SCPollObject-voters, & .SCPollObject-votes': {
        display: 'flex',
        margin: theme.spacing(1),
        alignItems: 'center',
        justifyContent: 'center',
        '& .MuiIcon-root': {
          width: '1em',
          marginRight: theme.spacing(1)
        }
      },
      '& .SCPollObject-expiration, & .SCPollObject-close, & .SCPollObject-voters': {
        textAlign: 'center',
        color: theme.palette.text.secondary,
        marginBottom: theme.spacing(2.5),
        fontWeight: theme.typography.fontWeightLight,
        fontSize: '0.765rem'
      },
      '& .SCPollObject-voters .MuiTypography-root': {
        fontWeight: theme.typography.fontWeightLight,
        fontSize: '1rem'
      },
      '& ul': {
        padding: theme.spacing(2.5),
        marginBottom: theme.spacing(2.5),
        backgroundColor: alpha(theme.palette.primary.main, theme.palette.action.activatedOpacity),
        borderRadius: theme.shape.borderRadius,
        '& li': {
          padding: 0,
          '& .SCChoices-root': {
            backgroundColor: 'transparent',
            padding: 0,
            marginBottom: theme.spacing(3),
            '& .SCChoices-label': {
              marginBottom: 0,
              fontWeight: theme.typography.fontWeightBold
            },
            '& .SCChoices-progress': {
              marginBottom: 0,
              '& .MuiLinearProgress-root': {
                height: 10,
                borderRadius: theme.shape.borderRadius
              },
              '& > .MuiTypography-root': {
                fontSize: '0.987rem',
                fontWeight: theme.typography.fontWeightLight
              }
            }
          }
        }
      }
    })
  }
};

export default Component;
