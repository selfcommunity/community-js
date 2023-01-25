const Component = {
  styleOverrides: {
    root: ({theme}: any) => ({
      '& .MuiButton-root': {
        '&:focus:not(:focus-visible)': {
          backgroundColor: 'transparent',
          borderWidth: '2px !important',
          borderColor: theme.palette.primary.light
        },
        '&:hover': {
          borderWidth: '2px !important'
        }
      },
      '& .MuiCardHeader-root': {
        maxHeight: 'none',
        padding: theme.spacing(2),
        '& .SCPollObject-toggleButton': {
          fontSize: '0.875rem',
          textTransform: 'uppercase',
          '& .MuiButton-endIcon': {
            display: 'none'
          }
        }
      },
      '& .SCPollObject-title': {
        color: theme.palette.grey[600],
        marginBottom: 10,
        fontWeight: theme.typography.fontWeightBold,
      },
      '& .SCPollObject-expiration, & .SCPollObject-close, & .SCPollObject-voters': {
        color: theme.palette.grey[600],
        marginBottom: theme.spacing(2.5),
        fontWeight: theme.typography.fontWeightLight,
        fontSize: '0.765rem'
      },
      '& .SCPollObject-voters .MuiTypography-root': {
        fontWeight: theme.typography.fontWeightLight,
        fontSize: '0.765rem'
      },
      '& ul': {
        padding: theme.spacing(2.5),
        marginBottom: theme.spacing(2.5),
        backgroundColor: theme.palette.grey[300],
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
