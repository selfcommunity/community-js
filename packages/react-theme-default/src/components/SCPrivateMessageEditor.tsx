import {alpha} from '@mui/system';

const Component = {
  styleOverrides: {
    root: ({theme}: any) => ({
      backgroundColor: alpha(theme.palette.secondary.main, theme.palette.action.activatedOpacity),
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
        borderRadius: 0,
        height: theme.spacing(15),
        backgroundColor: theme.palette.secondary.light,
        '& .MuiCardContent-root': {
          // borderTop: `1px dashed${theme.palette.secondary.main}`,
          // '&:hover': {
          //   backgroundColor: alpha(theme.palette.secondary.main, theme.palette.action.selectedOpacity)
          // },
          overflow: 'visible',
          padding: theme.spacing(1),
          //display: 'flex',
          //flexDirection: 'column',
          //height: theme.mixins.toolbar.minHeight,
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
            '& .MuiListItem-root': {
              height: theme.spacing(6.25),
              marginRight: theme.spacing(3),
              img: {
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
