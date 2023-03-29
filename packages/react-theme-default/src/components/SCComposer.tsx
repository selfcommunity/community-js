import {alpha} from '@mui/system';
import {hexToRgb} from '@mui/material';

const Component = {
  styleOverrides: {
    root: ({theme}: any) => {
      let mediaActionBackground = theme.palette.getContrastText(theme.palette.primary.main);
      if (mediaActionBackground.startsWith('#')) {
        mediaActionBackground = hexToRgb(mediaActionBackground).replace(')', ', .5)');
      }
      return {
        '& .SCComposer-title': {
          borderBottom: `1px solid ${theme.palette.grey[400]}`,
          padding: theme.spacing(0, 0, 2, 0),
          lineHeight: 1,
          fontSize: '1.143rem',
          display: 'flex',
          flexDirection: 'row',
          flexWrap: 'nowrap',
          justifyContent: 'space-between',
          alignItems: 'center',
          '& .SCComposer-types .MuiInputBase-input': {
            fontWeight: theme.typography.fontWeightBold,
            fontSize: '1.286rem',
            minHeight: 'auto'
          },
          '& > div': {
            flex: 1,
            textAlign: 'center'
          },
          '& > div:first-of-type': {
            textAlign: 'left'
          },
          '& > div:last-of-type': {
            textAlign: 'right',
            display: 'block'
          }
        },
        '& .SCComposer-types': {
          flexDirection: 'row',
          alignItems: 'center'
        },
        '& .SCComposer-avatar': {
          width: theme.selfcommunity.user.avatar.sizeMedium,
          height: theme.selfcommunity.user.avatar.sizeMedium,
          display: 'inline-block'
        },
        '& .SCComposer-content': {
          position: 'relative',
          overflowY: 'visible',
          padding: theme.spacing(3, 0),
          minHeight: 300,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          '& .SCComposer-editor': {
            padding: 0,
            fontSize: '1rem',
            minHeight: 'auto',
            '& .SCEditor-placeholder': {
              top: 0,
              left: 0
            },
            '& .SCEditor-actions': {
              bottom: theme.spacing(4),
              padding: theme.spacing(3, 0, 0, 0),
              '& > p.MuiTypography-alignLeft > .MuiIconButton-root': {
                marginLeft: theme.spacing(0.3),
                marginRight: theme.spacing(0.3),
                '&:first-of-type': {
                  marginLeft: 0
                },
                '&:last-child': {
                  marginRight: 0
                }
              },
              '& > p.MuiTypography-alignRight > .MuiIconButton-root': {
                marginRight: theme.spacing(1.5)
              },
              '& .MuiIconButton-sizeMedium': {
                fontSize: '1.429rem'
              }
            }
          },
          '& .SCComposer-medias, & .SCComposer-audience, & .SCComposer-block': {
            margin: theme.spacing(1, 0),
            padding: 0
          },
          '& .SCComposer-medias': {
            '& .SCComposer-mediasActions': {
              position: 'relative',
              borderTop: `1px solid ${theme.palette.grey[400]}`,
              backgroundColor: theme.palette.background.paper,
              padding: theme.spacing(1, 0),
              '& .SCComposer-mediasActionsTitle': {
                fontSize: '1.143rem'
              }
            }
          }
        },
        '& .SCComposer-mediaContent, & .SCComposer-audienceContent, & .SCComposer-locationContent': {
          minHeight: 300
        },
        '& .SCComposer-block': {
          padding: theme.spacing(1)
        },
        '& .SCComposer-editor': {
          minHeight: 200,
          '& .SCEditor-placeholder': {
            top: theme.spacing(1),
            left: theme.spacing(1)
          }
        },
        '& .SCComposer-divider': {
          borderTop: '1px solid #D1D1D1'
        },
        '& .SCComposer-medias': {
          margin: '0 23px'
        },
        '& .SCComposer-location, & .SCComposer-audience': {
          padding: theme.spacing(2),
          paddingBottom: 0
        },
        '& .SCComposer-mediasActions': {
          position: 'absolute',
          left: 0,
          right: 0,
          background: mediaActionBackground,
          padding: theme.spacing(),
          zIndex: 1,
          display: 'flex',
          flexWrap: 'nowrap',
          justifyContent: 'space-between',
          '& .SCComposer-mediasActionsActions': {
            textAlign: 'right'
          }
        },
        '& .SCComposer-sortableMedia': {
          position: 'relative'
        },
        '& .SCComposer-sortableMediaCover': {
          backgroundSize: 'cover !important',
          backgroundPosition: 'center !important',
          backgroundRepeat: 'no-repeat !important',
          border: '2px solid white',
          borderRadius: 6,
          height: 300
        },
        '& .SCComposer-links': {
          padding: theme.spacing(2)
        },
        '& .SCComposer-actions': {
          margin: 0,
          borderTop: '1px solid #D1D1D1',
          padding: theme.spacing(1),
          display: 'block',
          '& .MuiTypography-alignLeft': {
            float: 'left'
          },
          '& .MuiTypography-alignRight': {
            float: 'right'
          },
          [theme.breakpoints.up('md')]: {
            display: 'flex',
            flexDirection: 'row',
            flexWrap: 'nowrap',
            justifyContent: 'space-between',
            alignItems: 'center',
            '& .MuiTypography-alignLeft, & .MuiTypography-alignRight': {
              float: 'none'
            }
          }
        },
        '& .SCComposer-actionInput': {
          display: 'none !important'
        },
        '& .SCComposer-badgeError .MuiBadge-badge': {
          padding: 0
        },
        '& .MuiDialog-paper': {
          //padding: theme.spacing(2, 3, 3)
        },
        '& .SCComposer-mediaContent': {
          '& .SCMediaActionImage-root': {
            padding: 0,
            '& .SCMediaActionImage-upload': {
              padding: theme.spacing(2),
              backgroundColor: alpha(theme.palette.primary.main, theme.palette.action.activatedOpacity),
              borderRadius: theme.shape.borderRadius,
              color: theme.palette.primary.main,
              '&.SCMediaActionImage-dragOver': {
                backgroundColor: alpha(theme.palette.primary.main, theme.palette.action.hoverOpacity)
              },
              '& .SCMediaActionImage-uploadBtn': {
                border: '0 none'
              }
            }
          },
          '& .SCMediaActionDocument-root': {
            padding: 0,
            '& .SCMediaActionDocument-upload': {
              padding: theme.spacing(2),
              backgroundColor: alpha(theme.palette.primary.main, theme.palette.action.activatedOpacity),
              borderRadius: theme.shape.borderRadius,
              color: theme.palette.primary.main,
              '&.SCMediaActionDocument-dragOver': {
                backgroundColor: alpha(theme.palette.primary.main, theme.palette.action.hoverOpacity)
              },
              '& .SCMediaActionDocument-uploadBtn': {
                border: '0 none'
              }
            }
          }
        },
        '& .SCComposer-locationContent': {
          padding: theme.spacing(3, 0),
          minHeight: 300
        },
        '& .MuiDialog-container': {
          '& .MuiDialog-paper': {
            boxShadow: theme.shadows[12],
            [theme.breakpoints.up('md')]: {
              borderRadius: theme.shape.borderRadius
            },
            '&.MuiDialog-paperFullScreen': {
              height: 'auto'
            }
          }
        }
      };
    }
  }
};

export default Component;
