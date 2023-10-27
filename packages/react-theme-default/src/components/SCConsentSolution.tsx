const Component = {
  styleOverrides: {
    root: ({theme}: any) => ({
      '& .SCConsentSolution-title': {
        display: 'flex',
        justifyContent: 'center',
        fontWeight: 800,
        [theme.breakpoints.down('sm')]: {
          fontSize: '0.9rem'
        }
      },
      '& .SCConsentSolution-title-back': {
        display: 'flex',
        justifyContent: 'left'
      },
      '& .SCConsentSolution-content': {
        padding: theme.spacing(2),
        overflowX: 'hidden',
        fontSize: '0.8rem',
        [theme.breakpoints.down('sm')]: {
          padding: 12,
          '& h6': {
            fontSize: '0.8rem'
          },
          '& span, p, li': {
            fontSize: '0.7rem'
          },
          '& li': {
            fontSize: '0.7rem'
          },
          '& button': {
            fontSize: '0.6rem'
          }
        }
      },
      '& .SCConsentSolution-consent': {
        borderTop: 0,
        overflowY: 'visible',
        [theme.breakpoints.down('sm')]: {
          paddingTop: 5,
          paddingBottom: 5
        }
      },
      '& .SCConsentSolution-consent-switch': {
        margin: `${theme.spacing()} 3px`,
        '& > span:first-of-type': {
          marginRight: 10
        },
        [theme.breakpoints.down('sm')]: {
          '.MuiFormControlLabel-label': {
            fontSize: '0.7rem'
          }
        }
      },
      '& .SCConsentSolution-delete-account-button': {
        cursor: 'pointer',
        '&:hover': {
          textDecoration: 'underline'
        }
      },
      '& .SCConsentSolution-confirm-delete-account-button': {
        color: '#FFF !important',
        marginRight: theme.spacing(2),
        marginBottom: theme.spacing()
      },
      '& .SCConsentSolution-logout-account-button': {
        marginBottom: theme.spacing()
      },
      '& .SCConsentSolution-data-portability': {
        marginBottom: theme.spacing(2)
      },
      '& .SCConsentSolution-alert-accept-document': {
        padding: theme.spacing(),
        [theme.breakpoints.down('sm')]: {
          fontSize: '0.7rem',
          padding: 5
        }
      },
      '& .SCConsentSolution-alert-accept-conditions': {
        fontSize: '0.8rem',
        fontWeight: 300,
        color: theme.palette.grey['A700'],
        padding: `${theme.spacing()} ${theme.spacing()}`,
        [theme.breakpoints.down('sm')]: {
          fontSize: '0.6rem'
        }
      }
    }),
    skeletonRoot: ({theme}: any) => ({
      '& .SCConsentSolution-title': {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      },
      '& .SCConsentSolution-content': {
        paddingTop: theme.spacing(3),
        paddingBottom: theme.spacing(5)
      },
      '& .SCConsentSolution-consent': {
        borderTop: 0,
        overflowY: 'visible',
        display: 'flex'
      },
      '& .SCConsentSolution-consent-switch': {
        width: 64,
        height: 31,
        borderRadius: 22,
        marginRight: theme.spacing()
      },
      '& .SCConsentSolution-consent-switch-label': {
        marginTop: 23
      }
    })
  }
};

export default Component;
