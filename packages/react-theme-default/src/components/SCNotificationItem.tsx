const Component = {
  styleOverrides: {
    root: ({theme}: any) => ({
      whiteSpace: 'normal',
      '& .SCNotificationItem-header': {
        display: 'flex',
        flexDirection: 'row',
        '& .SCNotificationItem-primary': {
          fontWeight: theme.typography.fontWeightMedium,
          '& .SCContributionNotification-username': {
            fontWeight: theme.typography.fontWeightBold
          },
          '& a': {
            color: theme.palette.text.primary,
            textDecoration: 'none'
          }
        },
        '& .SCNotificationItem-secondary': {
          '& .SCDateTimeAgo-root, & .MuiStack-root': {
            color: theme.palette.primary.main,
            minHeight: theme.spacing(3)
          },
          '& a': {
            textDecoration: 'none',
            color: theme.palette.text.primary
          }
        }
      },
      '& .SCNotificationItem-actions': {
        color: theme.palette.primary.main
      },
      '&.SCNotificationItem-toast': {
        backgroundColor: 'transparent',
        borderRadius: 0,
        '& .SCNotificationItem-header': {
          '& .SCNotificationItem-image': {
            marginRight: theme.spacing(1),
            '& .MuiAvatar-root': {
              width: theme.selfcommunity.user.avatar.sizeSmall,
              height: theme.selfcommunity.user.avatar.sizeSmall
            }
          }
        }
      },
      '&.SCNotificationItem-snippet': {
        backgroundColor: 'transparent',
        borderRadius: 0,
        '& .SCNotificationItem-header': {
          '& .SCNotificationItem-image': {
            marginRight: theme.spacing(1),
            '& .MuiAvatar-root': {
              width: theme.selfcommunity.user.avatar.sizeSmall,
              height: theme.selfcommunity.user.avatar.sizeSmall
            }
          }
        }
      },
      '&.SCNotificationItem-detail': {
        backgroundColor: 'transparent',
        borderRadius: 0,
        '& .SCNotificationItem-header': {
          '& .SCNotificationItem-image': {
            marginRight: theme.spacing(1),
            '& .MuiAvatar-root': {
              width: theme.selfcommunity.user.avatar.sizeMedium,
              height: theme.selfcommunity.user.avatar.sizeMedium
            }
          }
        }
      }
    })
  }
};

export default Component;
