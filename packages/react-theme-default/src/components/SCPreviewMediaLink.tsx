import {alpha} from '@mui/system';

const Component = {
  styleOverrides: {
    root: ({theme}: any) => ({
      '& .SCPreviewMediaLink-preview-link': {
        position: 'relative',
        backgroundColor: '#F5F5F5',
        margin: theme.spacing(2, 0),
        padding: theme.spacing(1)
      },
      '& .SCPreviewMediaLink-preview-video': {
        margin: '10px 0px',
        height: 360
      },
      '& .SCPreviewMediaLink-thumbnail': {
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
      '& .SCPreviewMediaLink-image': {
        backgroundSize: 'contain !important',
        backgroundPosition: 'center !important',
        backgroundRepeat: 'no-repeat !important',
        backgroundColor: '#FFF !important',
        paddingBottom: 120
      },

      '& .SCPreviewMediaLink-snippet': {
        padding: theme.spacing(2),
        '& .SCPreviewMediaLink-snippet-title': {},
        '& .SCPreviewMediaLink-snippet-description': {
          fontSize: '0.857rem'
        },
        '& a': {
          fontSize: '1rem',
          fontStyle: 'italic'
        }
      }
    })
  }
};

export default Component;
