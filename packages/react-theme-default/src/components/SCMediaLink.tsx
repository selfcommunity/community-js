import {alpha} from '@mui/system';

const Component = {
  styleOverrides: {
    displayRoot: ({theme}: any) => ({
      '& .SCMediaLink-link': {
        position: 'relative',
        backgroundColor: '#F5F5F5',
        margin: theme.spacing(1, 0),
        padding: theme.spacing(1)
      },
      '& .SCMediaLink-video': {
        margin: '10px 0px',
        height: 360
      },
      '& .SCMediaLink-html-wrap': {
        position: 'relative',
        marginLeft: theme.spacing(),
        marginRight: theme.spacing(),
        '& .SCMediaLink-html': {
          width: '100%',
          position: 'absolute',
          top: 0,
          zIndex: 2,
          '& iframe': {
            width: '100%',
            margin: '0px auto'
          }
        },
        '& .SCMediaLink-html-placeholder': {
          width: '100%',
          position: 'relative',
          top: 0,
          zIndex: 1,
          '& .SCMediaLink-html-loading': {
            position: 'absolute',
            display: 'none',
            top: '38%',
            left: '50%'
          }
        }
      },
      '& .SCMediaLink-thumbnail': {
        border: `1px solid ${alpha(theme.palette.primary.main, theme.palette.action.activatedOpacity)}`,
        borderRadius: theme.shape.borderRadius * 0.75,
        paddingTop: theme.spacing(1),
        margin: theme.spacing(1, 2, 1, 1),
        [theme.breakpoints.up('sm')]: {
          maxWidth: 200,
          width: '100%',
          float: 'left'
        }
      },
      '& .SCMediaLink-image': {
        backgroundSize: 'contain !important',
        backgroundPosition: 'center !important',
        backgroundRepeat: 'no-repeat !important',
        backgroundColor: '#FFF !important',
        paddingBottom: 120
      },

      '& .SCMediaLink-snippet': {
        padding: theme.spacing(2),
        '& .SCMediaLink-snippet-title': {},
        '& .SCMediaLink-snippet-description': {
          fontSize: '0.857rem'
        },
        '& a': {
          fontSize: '1rem',
          fontStyle: 'italic'
        }
      }
    }),
    layerRoot: ({theme}: any) => ({
      '& .SCMediaLink-content': {
        '& form button[type=submit]': {
          fontWeight: theme.typography.fontWeightBold
        }
      }
    }),
    previewRoot: ({theme}: any) => ({
      '& .SCMediaLink-media': {
        position: 'relative',
        '& .SCMediaLink-html-wrap': {
          '& .SCMediaLink-html': {
            width: '100%',
            position: 'absolute',
            zIndex: 2,
            '& iframe': {
              width: '100%',
              margin: '0px auto'
            }
          },
          '& .SCMediaLink-html-placeholder': {
            width: '100%',
            position: 'absolute',
            top: 0,
            zIndex: 1,
            '& .SCMediaLink-html-loading': {
              position: 'absolute',
              display: 'none',
              top: '40%',
              left: '50%'
            }
          }
        },
        '& .SCMediaLink-delete': {
          background: theme.palette.common.white,
          position: 'absolute',
          right: theme.spacing(0.5),
          top: theme.spacing(0.5),
          zIndex: 3
        },
        '&.SCMediaLink-media-video .SCMediaLink-delete': {
          background: theme.palette.common.white,
          right: theme.spacing(1),
          top: theme.spacing(1)
        }
      }
    }),
    triggerRoot: ({theme}: any) => ({})
  }
};

export default Component;
