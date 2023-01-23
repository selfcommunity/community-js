const Component = {
  styleOverrides: {
    root: ({theme}: any) => ({
      '& .SCNotificationItem-primary': {
        color: theme.palette.grey[600],
        '& a': {
          '&:hover': {
            color: theme.palette.primary.main,
            textDecoration: 'none'
          }
        }
      },
      '& .SCUserNotification-username': {
        '&:hover': {
          textDecoration: 'none'
        }
      },
      '& .SCUserNotificationPrivateMessage-reply-button': {
        color: theme.palette.primary.main,
        '&:hover': {
          color: '#FFF !important'
        }
      },
      '& .SCCommentNotification-vote-button': {
        '& > span': {
          fontSize: '18px !important'
        }
      }
    })
  }
};

export default Component;
