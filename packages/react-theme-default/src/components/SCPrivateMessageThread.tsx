import {alpha} from '@mui/system';

const Component = {
  styleOverrides: {
    root: ({theme}: any) => ({
      height: '100%',
      width: '100%',
      backgroundColor: alpha(theme.palette.common.white, 0.5),
      borderRadius: 0,
      '& .MuiCardContent-root': {
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        padding: 0,
        position: 'relative',
        '& .MuiAlert-root': {
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          display: 'flex',
          justifyContent: 'center',
          borderRadius: 0
        },
        '& .infinite-scroll-component__outerdiv': {
          flexGrow: 1,
          overflowY: 'auto',
          '& .infinite-scroll-component': {
            display: 'flex',
            flexDirection: 'column-reverse',
            '& .MuiList-root': {
              margin: 0,
              padding: theme.spacing(2, 2, 0, 2),
              '& .MuiListItem-root': {
                padding: theme.spacing(1, 1, 4, 2),
                minWidth: '35%',
                maxWidth: '80%',
                textAlign: 'left',
                width: 'fit-content',
                position: 'relative',
                marginBottom: theme.spacing(1),
                '&.SCPrivateMessageThread-receiver': {
                  backgroundColor: theme.palette.common.white,
                  marginLeft: theme.spacing(-4),
                  filter: 'drop-shadow(0px 0px 10px rgba(0, 0, 0, 0.1))',
                  '&:after': {
                    marginRight: theme.spacing(3),
                    content: `""`,
                    position: 'absolute',
                    border: `${theme.spacing(3)} solid transparent`,
                    borderTop: `${theme.spacing(3)} solid ${theme.palette.common.white}`,
                    top: theme.spacing(0),
                    left: theme.spacing(-2)
                  }
                },
                '&.SCPrivateMessageThread-sender': {
                  backgroundColor: theme.palette.grey[300],
                  position: 'relative',
                  marginLeft: 'auto',
                  marginRight: theme.spacing(1),
                  '&:after': {
                    content: `""`,
                    position: 'absolute',
                    border: `${theme.spacing(3)} solid transparent`,
                    borderTop: `${theme.spacing(3)} solid ${theme.palette.grey[300]}`,
                    top: theme.spacing(0),
                    right: theme.spacing(-2)
                  }
                }
              }
            }
          }
        },
        '& .SCPrivateMessageThread-item': {
          display: 'flex',
          marginBottom: theme.spacing(1),
          '& .SCPrivateMessageThread-avatar': {
            marginRight: theme.spacing(6),
            '& img': {
              height: theme.selfcommunity.group.avatar.sizeMedium,
              width: theme.selfcommunity.group.avatar.sizeMedium
            }
          }
        }
      },
      '& .SCPrivateMessageThread-empty-message': {
        height: '100%',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        fontSize: '1.5rem'
      },
      '& .SCPrivateMessageThread-new-message-header': {
        display: 'flex',
        width: '100%',
        height: theme.mixins.toolbar.minHeight,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: alpha(theme.palette.primary.main, theme.palette.action.activatedOpacity),
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
            [theme.breakpoints.down('md')]: {
              maxHeight: theme.spacing(3.75)
            },
            width: '100%',
            marginLeft: theme.spacing(1),
            maxHeight: theme.mixins.toolbar.minHeight,
            overflow: 'auto',
            '& .MuiAutocomplete-tag': {
              height: theme.spacing(3),
              '& .MuiChip-deleteIcon': {
                fontSize: '18px'
              }
            },
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
        zIndex: 1000,
        '& .SCPrivateMessageThread-subheader': {
          width: 'fit-content',
          minWidth: 100,
          padding: theme.spacing(0.25, 1),
          backgroundColor: 'white',
          fontWeight: theme.typography.fontWeightRegular,
          borderRadius: theme.shape.borderRadius,
          boxShadow: '0px 0px 10px rgba(0, 0, 0, 0.1)'
        }
      },
      '& .MuiList-root, .SCPrivateMessageThread-new-message-content': {flexGrow: 1}
    }),
    skeletonRoot: ({theme}: any) => ({
      height: '100%',
      width: '100%',
      borderRadius: 0,
      '& .MuiCardContent-root': {
        padding: 0,
        '& .MuiList-root .MuiListItem-root': {
          height: theme.spacing(10)
        },
        '&:last-child': {
          paddingBottom: 0
        }
      }
    })
  }
};

export default Component;
