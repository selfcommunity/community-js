const Component = {
  styleOverrides: {
    root: ({theme}: any) => ({
      a: {
        color: theme.palette.text.primary,
        textDecoration: 'none',
        '&:hover, &:active': {
          textDecoration: 'underline'
        }
      },
      '& .SCNotificationItem-header': {
        display: 'flex',
        flexDirection: 'row',
        '& .SCNotificationItem-primary': {
          fontWeight: theme.typography.fontWeightMedium,
          '& .SCContributionNotification-username': {
            fontWeight: theme.typography.fontWeightBold
          }
        },
        '& .SCNotificationItem-secondary .SCDateTimeAgo-root': {
          marginTop: theme.spacing(1)
        }
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
