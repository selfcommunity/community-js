import {alpha} from '@mui/system';

const Component = {
  styleOverrides: {
    root: ({theme}: any) => ({
      backgroundColor: alpha(theme.palette.secondary.main, theme.palette.action.selectedOpacity),
      position: 'relative',
      [theme.breakpoints.down('md')]: {
        minHeight: '100vh'
      },
      [theme.breakpoints.up('sm')]: {
        height: theme.spacing(103.5),
        maxHeight: 'inherit'
      },
      '& .MuiCardContent-root': {
        [theme.breakpoints.up('sm')]: {
          height: '100%',
          maxHeight: `calc(100% - ${theme.spacing(6.25)})`,
          overflow: 'auto',
          padding: theme.spacing(0)
        },
        '& .MuiAlert-root': {
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          display: 'flex',
          justifyContent: 'center'
        },
        '& .MuiList-root': {
          margin: theme.spacing(0, 2, 0, 2),
          '& .MuiListItem-root': {
            '&.SCPrivateMessageThread-receiver': {
              backgroundColor: theme.palette.common.white,
              marginLeft: theme.spacing(-2),
              filter: 'drop-shadow(0px 0px 10px rgba(0, 0, 0, 0.1))',
              '&:after': {
                marginRight: theme.spacing(3),
                content: `""`,
                position: 'absolute',
                border: `${theme.spacing(3)} solid transparent`,
                borderTop: `${theme.spacing(3)} solid ${theme.palette.common.white}`,
                top: 0,
                left: theme.spacing(-3)
              }
            },
            '&.SCPrivateMessageThread-sender': {
              backgroundColor: alpha(theme.palette.secondary.main, theme.palette.action.activatedOpacity)
            }
          }
        }
      },
      '& .SCPrivateMessageThread-empty-message': {
        position: 'relative',
        top: '50%',
        display: 'flex',
        justifyContent: 'center',
        fontSize: '1.5rem'
      },
      '& .SCPrivateMessageThread-new-message-header': {
        position: 'absolute',
        top: 0,
        right: 0,
        display: 'flex',
        width: '100%',
        height: theme.spacing(6.25),
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: alpha(theme.palette.secondary.main, theme.palette.action.activatedOpacity),
        '& .SCPrivateMessageThread-new-message-header-content': {
          display: 'flex',
          alignItems: 'center',
          width: '80%',
          maxHeight: theme.spacing(5),
          overflow: 'auto',
          backgroundColor: theme.palette.common.white,
          borderRadius: theme.shape.borderRadius,
          marginRight: theme.spacing(2),
          '& .SCPrivateMessageThread-new-message-header-icon': {
            fontSize: '1.714rem',
            marginLeft: theme.spacing(1)
          },
          '& .MuiIcon-root': {
            color: theme.palette.secondary.main
          },
          '& .MuiTypography-root': {
            color: theme.palette.secondary.main,
            marginLeft: theme.spacing(1)
          },
          '& .SCPrivateMessageThread-autocomplete': {
            minWidth: theme.spacing(27),
            marginLeft: theme.spacing(1),
            '& .MuiAutocomplete-endAdornment': {
              position: 'relative',
              '& .MuiAutocomplete-clearIndicator': {
                fontSize: '1rem'
              }
            }
          }
        }
      },
      '& .MuiListSubheader-root': {
        backgroundColor: 'inherit',
        display: 'flex',
        justifyContent: 'center',
        marginBottom: theme.spacing(1),
        '& .SCPrivateMessageThread-subheader': {
          width: 'fit-content',
          padding: theme.spacing(0.5),
          backgroundColor: 'white',
          fontWeight: theme.typography.fontWeightRegular,
          borderRadius: theme.shape.borderRadius,
          boxShadow: '0px 0px 10px rgba(0, 0, 0, 0.1)'
        }
      },
      '& .SCPrivateMessageThreadItem-root': {
        borderRadius: theme.shape.borderRadius,
        paddingTop: `${theme.spacing(2)} !important`,
        paddingBottom: `${theme.spacing(4)} !important`,
        paddingRight: `${theme.spacing(2)} !important`,
        paddingLeft: `${theme.spacing(2)} !important`,
        '& .MuiListItemSecondaryAction-root': {
          right: theme.spacing(0.5),
          top: theme.spacing(3)
        },
        '& .SCPrivateMessageThreadItem-message-time': {
          position: 'absolute',
          bottom: theme.spacing(0),
          right: theme.spacing(1),
          padding: theme.spacing(0.5)
        },
        '& .SCPrivateMessageThreadItem-text': {
          minHeight: theme.spacing(6),
          display: 'flex',
          alignItems: 'center',
          '& .MuiTypography-root': {
            fontSize: '1.143rem'
          }
        },
        '& .SCPrivateMessageThreadItem-img': {
          display: 'flex',
          alignItems: 'center',
          // maxWidth: 'max-content',
          // maxHeight: 'max-content',
          '& img': {
            width: '100%',
            minHeight: 400,
            [theme.breakpoints.down('md')]: {
              minHeight: 170
            }
          }
        },
        '& .SCPrivateMessageThreadItem-document': {
          display: 'flex',
          alignItems: 'center'
        }
      }
    })
  }
};

export default Component;
