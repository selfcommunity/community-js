const Component = {
  styleOverrides: {
    root: ({theme}: any) => ({
      width: '100%',
      position: 'absolute',
      bottom: 0,
      left: 0,
      zIndex: 1,
      backgroundColor: theme.palette.primary.main,
      '& .MuiIcon-root': {
        fontSize: '1.571rem'
      },
      '& .SCPrivateMessageEditor-message-input': {
        width: '100%'
      },
      '& .MuiInputBase-root, MuiOutlinedInput-root': {
        //height: theme.spacing(6.25),
        '& textarea': {
          backgroundColor: theme.palette.common.white,
          borderRadius: theme.shape.borderRadius,
          padding: theme.spacing(1)
        }
      },
      '& .SCPrivateMessageEditor-send-media-section': {
        backgroundColor: theme.palette.primary.main,
        display: 'flex',
        justifyContent: 'center'
      },
      '& .MuiPaper-root, MuiCard-root, SCWidget-root, SCMessageMediaUploader-root': {
        '& .MuiIcon-root': {
          fontSize: '1.143rem'
        },
        backgroundColor: theme.palette.primary.main,
        '& .MuiCardHeader-root': {
          paddingRight: theme.spacing(2),
          paddingTop: theme.spacing(1)
        },
        '& .MuiCardContent-root': {
          '& .SCMessageMediaUploader-upload': {
            display: 'flex',
            justifyContent: 'center',
            '& .MuiButtonBase-root, MuiIconButton-root': {
              backgroundColor: theme.palette.common.white
            }
          },
          '& .SCMessageMediaUploader-preview-container': {
            display: 'flex',
            justifyContent: 'center',
            img: {
              maxWidth: theme.spacing(25)
            },
            video: {
              maxWidth: theme.spacing(25)
            }
          },
          '& .SCMessageMediaUploader-doc-preview': {
            [theme.breakpoints.down('md')]: {
              height: theme.spacing(12.5),
              width: theme.spacing(25)
            },
            height: theme.spacing(25),
            width: theme.spacing(50),
            position: 'relative'
          },
          '& .SCMessageMediaUploader-doc-loading-preview': {
            backgroundColor: theme.palette.background.default,
            height: theme.spacing(12.5),
            width: theme.spacing(25),
            position: 'relative',
            '& .MuiCircularProgress-root': {
              position: 'absolute',
              top: '40%',
              left: '45%'
            },
            '& .SCMessageMediaUploader-progress': {
              display: 'flex',
              justifyContent: 'center'
            },
            '& .SCMessageMediaUploader-clear-media': {
              display: 'flex',
              justifyContent: 'flex-end'
            }
          }
        }
      }
    })
  }
};

export default Component;
