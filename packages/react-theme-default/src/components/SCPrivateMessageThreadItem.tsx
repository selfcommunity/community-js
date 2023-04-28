const Component = {
  styleOverrides: {
    root: ({theme}: any) => ({
      borderRadius: theme.shape.borderRadius,
      paddingTop: `${theme.spacing(2)} !important`,
      paddingBottom: `${theme.spacing(4)} !important`,
      paddingRight: `${theme.spacing(2)} !important`,
      paddingLeft: `${theme.spacing(2)} !important`,
      '& .MuiListItemSecondaryAction-root': {
        right: theme.spacing(0),
        top: theme.spacing(3)
      },
      '& .SCPrivateMessageThreadItem-message-time': {
        position: 'absolute',
        bottom: theme.spacing(0),
        right: theme.spacing(1),
        padding: theme.spacing(0.5)
      },
      '& .SCPrivateMessageThreadItem-text': {
        minHeight: theme.spacing(6),
        display: 'flex',
        alignItems: 'center',
        '& .MuiTypography-root': {
          fontSize: '1.143rem'
        }
      },
      '& .SCPrivateMessageThreadItem-img': {
        display: 'flex',
        alignItems: 'center',
        objectFit: 'cover',
        flex: '0 0 95%',
        '& img': {
          width: '100%',
          height: '100%'
        }
      },
      '& .SCPrivateMessageThreadItem-video': {
        '& .MuiButtonBase-root': {
          color: theme.palette.common.white,
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-60%, -50%)',
          '& .MuiIcon-root': {
            color: theme.palette.common.white,
            fontSize: '6rem',
            [theme.breakpoints.down('md')]: {
              fontSize: '3rem'
            }
          }
        }
      },
      '& .SCPrivateMessageThreadItem-document': {
        width: theme.spacing(32.5),
        '& img': {
          height: '100%',
          width: '100%'
        },
        '& .MuiButtonBase-root': {
          width: 'inherit',
          position: 'absolute',
          bottom: '10%',
          backgroundColor: 'rgba(0,0,0,0.5)',
          color: 'rgba(255,255,255,0.9)',
          display: 'flex',
          borderRadius: 0,
          '& .MuiTypography-root': {
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            marginLeft: theme.spacing(0.5)
          }
        }
      }
    })
  }
};

export default Component;
