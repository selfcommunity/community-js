import {alpha} from '@mui/system';

const Component = {
  styleOverrides: {
    root: ({theme}: any) => ({
      backgroundColor: alpha(theme.palette.secondary.main, theme.palette.action.selectedOpacity),
      position: 'relative',
      [theme.breakpoints.up('sm')]: {
        height: '100vh',
        maxHeight: 'calc(100vh - 6.2rem)'
      },
      '& .MuiCardContent-root': {
        overflow: 'auto',
        padding: theme.spacing(0),
        height: 'calc(100vh - 6.2rem)',
        [theme.breakpoints.up('sm')]: {
          height: `calc(100% - ${theme.spacing(6.25)})`
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
            maxHeight: theme.spacing(5),
            overflow: 'auto',
            scrollbarWidth: 'none',
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
      }
    })
  }
};

export default Component;
