const Component = {
  styleOverrides: {
    root: ({theme}: any) => ({
      width: '100%',
      position: 'absolute',
      bottom: 0,
      left: 0,
      zIndex: 1,
      [theme.breakpoints.down('md')]: {
        position: 'fixed',
        top: 'auto',
        bottom: 0
      },
      backgroundColor: theme.palette.primary.main,
      '& .MuiIcon-root': {
        fontSize: '1.571rem'
      },
      '& .SCPrivateMessageEditor-message-input': {
        width: '100%'
      },
      '& .MuiInputBase-root, MuiOutlinedInput-root': {
        '& textarea': {
          backgroundColor: theme.palette.common.white,
          borderRadius: theme.shape.borderRadius,
          padding: theme.spacing(1)
        }
      },
      '& .MuiPaper-root, MuiCard-root, SCWidget-root, SCMessageMediaUploader-root': {
        height: theme.spacing(15),
        backgroundColor: theme.palette.primary.main,
        '& .MuiCardContent-root': {
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
          '& .SCMessageMediaUploader-preview-content': {
            position: 'relative',
            display: 'flex',
            margin: '0 auto',
            width: theme.spacing(6.25),
            height: theme.spacing(6.25),
            img: {
              resizeMode: 'contain',
              width: theme.spacing(6.25),
              height: theme.spacing(6.25)
            },
            video: {
              width: theme.spacing(6.25),
              height: theme.spacing(6.25)
            },
            '& .SCMessageMediaUploader-preview-actions': {
              width: 'inherit',
              height: 'inherit',
              position: 'absolute',
              '& .MuiButtonBase-root, .MuiTypography-root': {
                color: theme.palette.common.white,
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)'
              },
              '&:hover': {
                background: 'rgba(0,0,0,0.5)'
              },
              '& .SCMessageMediaUploader-progress': {
                background: 'rgba(0,0,0,0.5)',
                height: '100%'
              }
            }
          },
          '& .SCMessageMediaUploader-preview-info': {
            '& .MuiTypography-root': {
              fontSize: '0.75rem'
            }
          }
        }
      }
    })
  }
};

export default Component;
