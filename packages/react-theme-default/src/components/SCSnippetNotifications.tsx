const Component = {
  styleOverrides: {
    root: ({theme}: any) => ({
      '& .SCSnippetNotifications-notifications-wrap': {
        maxWidth: 'initial',
        '& .SCNotificationItem-primary': {
          color: theme.palette.grey[600],
          '& a': {
            '&:hover': {
              color: theme.palette.primary.main,
              textDecoration: 'underline'
            }
          }
        }
      },
      '& .SCNotificationItem-image': {
        paddingLeft: '0px !important'
      },
      '&.SCNotificationItem-new-snippet': {
        '&::before': {
          backgroundColor: theme.palette.primary.main
        }
      },
      '& .SCUserNotificationPrivateMessage-reply-button': {
        color: theme.palette.primary.main,
        '&:hover': {
          color: '#FFF !important'
        }
      }
    })
  }
};

export default Component;
