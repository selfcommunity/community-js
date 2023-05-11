import {alpha} from '@mui/system';

const Component = {
  styleOverrides: {
    root: ({theme}: any) => ({
      width: '100%',
      position: 'absolute',
      bottom: 0,
      left: 0,
      zIndex: 1,
      [theme.breakpoints.down('md')]: {
        position: 'fixed'
      },
      '& .MuiIcon-root': {
        fontSize: '1.571rem'
      },
      '& .SCPrivateMessageEditor-message-input': {
        width: '100%',
        backgroundColor: alpha(theme.palette.secondary.main, theme.palette.action.activatedOpacity)
      },
      '& .MuiInputBase-root, MuiFilledInput-root': {
        borderRadius: 0,
        padding: theme.spacing(0.5, 0, 0.5, 0),
        '& textarea': {
          backgroundColor: theme.palette.common.white,
          borderRadius: theme.shape.borderRadius,
          padding: theme.spacing(1),
          border: `2px solid transparent`,
          '&:hover': {
            border: `2px solid${theme.palette.secondary.main}`
          },
          '&.Mui-disabled': {border: 'none'}
        }
      },
      '& .MuiPaper-root, MuiCard-root, SCWidget-root, SCMessageMediaUploader-root': {
        height: theme.spacing(15),
        backgroundColor: theme.palette.secondary.light,
        '& .MuiCardContent-root': {
          borderTop: `1px dashed${theme.palette.secondary.main}`,
          '&:hover': {
            backgroundColor: alpha(theme.palette.secondary.main, theme.palette.action.selectedOpacity)
          },
          overflow: 'visible',
          padding: theme.spacing(1),
          display: 'flex',
          flexDirection: 'column',
          minHeight: theme.spacing(15),
          '& .SCMessageMediaUploader-close': {
            '& .MuiIcon-root': {
              fontSize: '0.857rem'
            }
          },
          '& .SCMessageMediaUploader-upload-section': {
            '& .SCMessageMediaUploader-upload-button': {
              display: 'flex',
              margin: '0 auto',
              fontSize: '1.571rem'
            }
          },
          '& .MuiList-root': {
            paddingTop: theme.spacing(0),
            paddingBottom: theme.spacing(0)
          },
          '& .SCMessageMediaUploader-preview-content': {
            position: 'relative',
            display: 'flex',
            margin: '0 auto',
            height: theme.spacing(6.25),
            '& .MuiListItem-root': {
              marginRight: theme.spacing(3),
              img: {
                // resizeMode: 'contain',
                width: theme.spacing(6.25),
                height: theme.spacing(6.25)
              },
              video: {
                width: theme.spacing(6.25),
                height: theme.spacing(6.25)
              }
            },
            '& .SCMessageMediaUploader-preview-actions': {
              height: '100%',
              background: 'transparent',
              '&:hover, &:active, &.SCMessageMediaUploader-progress': {
                background: 'rgba(0,0,0,0.5)'
              },
              '& .MuiButtonBase-root, .MuiTypography-root': {
                color: theme.palette.common.white,
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)'
              }
            },
            '& .SCMessageMediaUploader-preview-info': {
              position: 'absolute',
              left: '50%',
              bottom: 0,
              transform: 'translate(-50%, 100%)',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              width: theme.spacing(6.25),
              '& .MuiTypography-root': {
                fontSize: '0.75rem'
              }
            }
          }
        }
      }
    })
  }
};

export default Component;
