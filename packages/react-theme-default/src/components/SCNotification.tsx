import {alpha} from '@mui/system';

const Component = {
  styleOverrides: {
    root: ({theme}: any) => ({
      '& .SCNotification-header': {
        padding: theme.spacing(2, 2, 0, 2),
        '& .SCNotification-avatar': {
          width: theme.selfcommunity.user.avatar.sizeMedium,
          height: theme.selfcommunity.user.avatar.sizeMedium
        }
      },
      '& .SCNotification-content': {
        padding: 0,
        '& .SCNotification-uncollapsed': {
          padding: theme.spacing(2, 2, 1, 2),
          '& > *': {
            marginBottom: theme.spacing()
          }
        },
        '& .SCNotification-show-other-aggregated': {
          backgroundColor: alpha(theme.palette.primary.main, theme.palette.action.hoverOpacity)
        },
        '& .SCNotification-collapsed': {
          padding: theme.spacing(2),
          '& .MuiCollapse-wrapperInner > *': {
            marginBottom: theme.spacing()
          }
        },
        '& .SCNotificationItem-detail': {
          borderRadius: 0
        }
      },
      '& a': {
        textDecoration: 'none',
        color: theme.palette.text.primary,
        '&:hover, &:active': {
          color: theme.palette.text.primary,
          textDecoration: 'underline'
        }
      }
    })
  }
};

export default Component;
