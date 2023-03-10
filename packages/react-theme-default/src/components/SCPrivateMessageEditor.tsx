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
            '& .MuiImageListItemBar-root': {
              height: '100%',
              background: 'transparent',
              '&:hover': {
                background: 'rgba(0,0,0,0.5)'
              },
              '& .MuiImageListItemBar-title': {
                '& .MuiTypography-root': {
                  fontSize: '0.75rem'
                }
              },
              '& .MuiImageListItemBar-actionIcon': {
                position: 'absolute',
                left: '20%',
                '& .MuiIcon-root': {
                  color: theme.palette.common.white
                }
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
