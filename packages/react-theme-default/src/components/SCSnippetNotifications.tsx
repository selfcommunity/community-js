const Component = {
  styleOverrides: {
    root: ({theme}: any) => ({
      width: '100%',
      '& .SCSnippetNotifications-notifications-wrap': {
        height: 330,
        overflowY: 'hidden'
      },
      '& .SCSnippetNotifications-item': {
        padding: 0,
        marginBottom: theme.spacing(),
        '&:hover': {
          backgroundColor: 'transparent',
          cursor: 'default'
        },
        '& .SCNotificationItem-root': {
          backgroundColor: 'transparent',
          borderRadius: 0,
          '&.SCNotificationItem-snippet': {
            '&:before': {
              borderRadius: theme.shape.borderRadius,
              width: theme.spacing(0.6),
              left: 1,
              height: '100%',
              display: 'block',
              zIndex: '20',
              position: 'absolute',
              content: '" "',
              backgroundColor: 'rgba(84, 110, 122, 0.3)'
            },
            '&.SCNotificationItem-new': {
              '&:before': {
                backgroundColor: theme.palette.primary.main
              }
            },
            '& .SCNotificationItem-header': {
              padding: theme.spacing(1, 2)
            }
          }
        },
        '&.SCSnippetNotifications-broadcast-messages-banner': {
          '& .SCNotificationItem-root.SCNotificationItem-snippet.SCNotificationItem-new': {
            '&:before': {
              backgroundColor: theme.palette.secondary.main
            }
          },
          '& .SCNotificationItem-title a': {
            color: theme.palette.secondary.main,
            fontWeight: theme.typography.fontWeightBold
          }
        }
      }
    }),
    skeletonRoot: ({theme}: any) => ({
      margin: 0,
      padding: 0,
      '& .SCSnippetNotifications-item': {
        padding: 0,
        marginBottom: theme.spacing(),
        '& .SCNotificationItem-root': {
          backgroundColor: 'transparent',
          borderRadius: 0,
          '&.SCNotificationItem-snippet': {
            '&:before': {
              borderRadius: theme.shape.borderRadius,
              width: theme.spacing(0.6),
              left: 1,
              height: '100%',
              display: 'block',
              zIndex: '20',
              position: 'absolute',
              content: '" "',
              backgroundColor: 'rgba(84, 110, 122, 0.3)'
            },
            '&.SCNotificationItem-new': {
              '&:before': {
                backgroundColor: theme.palette.primary.main
              }
            },
            '& .SCNotificationItem-header': {
              padding: theme.spacing(1, 2)
            }
          }
        }
      }
    })
  }
};

export default Component;
