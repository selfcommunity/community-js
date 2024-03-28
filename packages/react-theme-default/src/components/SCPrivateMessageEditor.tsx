import {alpha} from '@mui/system';

const Component = {
  styleOverrides: {
    root: ({theme}: any) => ({
      backgroundColor: alpha(theme.palette.primary.main, theme.palette.action.activatedOpacity),

      '& .SCPrivateMessageEditor-message-input': {
        width: '100%'
      },
      '& .MuiInputBase-root': {
        '&.Mui-disabled': {backgroundColor: theme.palette.grey['A200']},
        borderRadius: 0,
        padding: theme.spacing(0.5, 0, 0.5, 0),
        '& textarea': {
          backgroundColor: theme.palette.common.white,
          borderRadius: theme.shape.borderRadius,
          padding: theme.spacing(1),
          border: `2px solid transparent`,
          '&:hover': {
            border: `2px solid${theme.palette.primary.main}`
          },
          '&.Mui-disabled': {border: 'none'}
        },
        '& .MuiButtonBase-root': {
          padding: theme.spacing(1.625)
        },
        '& .MuiOutlinedInput-notchedOutline': {
          border: '0 none'
        }
      },
      '& .SCPrivateMessageEditor-emoji-section': {
        '& .EmojiPickerReact.epr-main': {
          borderRadius: 0,
          '& .epr-preview': {
            display: 'none'
          }
        }
      },
      '& .MuiPaper-root': {
        borderRadius: 0,
        backgroundColor: theme.palette.grey['A200'],
        '& .MuiCardHeader-root': {
          paddingBottom: theme.spacing(0),
          '& .SCPrivateMessageEditor-close-button': {
            fontSize: '0.857rem',
            cursor: 'pointer',
            '&:hover': {
              color: theme.palette.common.black
            }
          }
        },
        '& .MuiAlert-root': {
          position: 'relative'
        },
        '& .MuiCardContent-root': {
          overflow: 'auto',
          padding: theme.spacing(1),
          minHeight: theme.spacing(20),
          '& .SCPrivateMessageEditor-upload-section': {
            '& .SCPrivateMessageEditor-upload-button': {
              display: 'flex',
              margin: '0 auto',
              fontSize: '1.57rem'
            }
          },
          '& .MuiList-root': {
            '& .MuiListItem-root:first-of-type': {
              paddingTop: theme.spacing(1)
            },
            [theme.breakpoints.up('sm')]: {
              paddingTop: theme.spacing(0)
            }
          },
          '& .SCPrivateMessageEditor-preview-content': {
            position: 'relative',
            display: 'flex',
            margin: '0 auto',
            justifyContent: 'center',
            alignItems: 'center',
            '& .MuiListItem-root': {
              height: theme.spacing(10),
              marginRight: theme.spacing(3),
              img: {
                width: theme.spacing(10),
                height: theme.spacing(10)
              },
              video: {
                objectFit: 'fill',
                width: theme.spacing(10),
                height: theme.spacing(10)
              }
            },
            '& .SCPrivateMessageEditor-preview-actions': {
              height: '100%',
              // background: 'transparent',
              // '&:hover, &:active, &.SCPrivateMessageEditor-progress': {
              background: 'rgba(0,0,0,0.5)',
              // },
              '& .MuiButtonBase-root, .MuiTypography-root': {
                color: theme.palette.common.white,
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)'
              }
            },
            '& .SCPrivateMessageEditor-preview-info': {
              position: 'absolute',
              left: '50%',
              bottom: 0,
              transform: 'translate(-50%, 100%)',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              width: theme.spacing(10),
              '& .MuiTypography-root': {
                fontSize: '0.75rem'
              }
            }
          }
        }
      },
      '&.SCPrivateMessageEditor-ios': {
        paddingBottom: '15px'
      }
    }),
    skeletonRoot: ({theme}: any) => ({})
  }
};

export default Component;
