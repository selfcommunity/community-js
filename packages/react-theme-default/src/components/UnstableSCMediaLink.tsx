import { alpha } from '@mui/system';

const Component = {
  styleOverrides: {
    layerRoot: ({theme}: any) => ({
      '& .UnstableSCMediaLink-content': {
        '& form button[type=submit]': {
          fontWeight: theme.typography.fontWeightBold
        }
      }
    }),
    displayRoot: ({theme}: any) => ({
      '& .UnstableSCMediaLink-link': {
        position: 'relative',
        backgroundColor: '#F5F5F5',
        margin: theme.spacing(1, 0),
        padding: theme.spacing(1)
      },
      '& .UnstableSCMediaLink-video': {
        margin: '10px 0px',
        height: 360
      },
      '& .UnstableSCMediaLink-thumbnail': {
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
      '& .UnstableSCMediaLink-image': {
        backgroundSize: 'contain !important',
        backgroundPosition: 'center !important',
        backgroundRepeat: 'no-repeat !important',
        backgroundColor: '#FFF !important',
        paddingBottom: 120
      },

      '& .UnstableSCMediaLink-snippet': {
        padding: theme.spacing(2),
        '& .UnstableSCMediaLink-snippet-title': {},
        '& .UnstableSCMediaLink-snippet-description': {
          fontSize: '0.857rem'
        },
        '& a': {
          fontSize: '1rem',
          fontStyle: 'italic'
        }
      }
    }),
    previewRoot: ({theme}: any) => ({
      '& .UnstableSCMediaLink-media': {
        position: 'relative',
        margin: theme.spacing(1),
        '& .UnstableSCMediaLink-delete': {
          position: 'absolute',
          right: theme.spacing(2),
          top: theme.spacing(2)
        }
      }
    }),
  }
};

export default Component;
