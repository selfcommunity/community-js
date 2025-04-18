import {getContrastRatio} from '@mui/material';

const Component = {
  styleOverrides: {
    root: ({theme}: any) => ({
      padding: theme.spacing(0, 1),
      '& .SCNavigationToolbar-logo, & .SCNavigationToolbar-custom-item': {
        marginRight: theme.spacing(2),
        '& img': {
          verticalAlign: 'middle',
          maxHeight: theme.mixins.toolbar.minHeight - 20
        }
      },
      '& .SCNavigationToolbar-navigation': {
        flexGrow: 1,
        textAlign: 'center',
        alignSelf: 'end',
        '& .SCNavigationToolbar-home, & .SCNavigationToolbar-explore, & .SCNavigationToolbar-groups, & .SCNavigationToolbar-events, & .SCNavigationToolbar-courses':
          {
            paddingTop: 12,
            paddingLeft: theme.spacing(1),
            paddingRight: theme.spacing(1),
            paddingBottom: 11,
            margin: theme.spacing(0, 1),
            borderRadius: 0,
            borderBottom: `2px solid transparent`,
            '&.SCNavigationToolbar-active, &:hover': {
              color: theme.palette.secondary.main,
              borderBottom: `2px solid ${theme.palette.secondary.main}`
            }
          }
      },
      '& .SCNavigationToolbar-search': {
        flexGrow: 1,
        textAlign: 'right',
        marginRight: theme.spacing(1.5),
        '& .MuiFormControl-root': {
          width: 190,
          [theme.breakpoints.up('lg')]: {
            width: 300
          }
        }
      },
      '& .SCNavigationToolbar-profile, & .SCNavigationToolbar-notification, & .SCNavigationToolbar-messages': {
        margin: theme.spacing(0, 0.5)
      },
      '& .SCNavigationToolbar-profile .MuiAvatar-root': {
        width: theme.selfcommunity.user.avatar.sizeMedium,
        height: theme.selfcommunity.user.avatar.sizeMedium
      },
      '& .SCNavigationToolbar-notification, & .SCNavigationToolbar-messages': {
        paddingTop: 12,
        paddingBottom: 9,
        borderRadius: 0,
        borderBottom: `2px solid transparent`,
        '&.SCNavigationToolbar-active, &:hover': {
          color: theme.palette.secondary.main,
          borderBottom: `2px solid ${theme.palette.secondary.main}`
        }
      },
      '& .SCNavigationToolbar-settings': {
        marginLeft: 0
      },
      '& .SCNavigationToolbar-composer:hover': {
        color: theme.palette.secondary.main
      },
      '& .MuiIconButton-root': {
        color: getContrastRatio(theme.palette?.navbar?.main, '#fff') > 4.5 ? '#fff' : theme.palette.primary.main
      },
      [theme.breakpoints.up(950)]: {
        padding: theme.spacing(0, 2),
        '& .SCNavigationToolbar-navigation': {
          '& .SCNavigationToolbar-home, & .SCNavigationToolbar-explore': {
            margin: theme.spacing(0, 2)
          }
        }
      }
    }),
    skeletonRoot: ({theme}: any) => ({
      '& .SCNavigationToolbar-logo': {
        width: 100,
        height: 20
      },
      '& .SCNavigationToolbar-navigation': {
        flexGrow: 1,
        margin: theme.spacing(0, 20)
      },
      '& .SCNavigationToolbar-avatar': {
        width: theme.selfcommunity.user.avatar.sizeMedium,
        height: theme.selfcommunity.user.avatar.sizeMedium
      }
    }),
    notificationsMenuRoot: ({theme}: any) => ({
      '& .SCNavigationToolbar-paper': {
        minWidth: 370,
        padding: theme.spacing(2),
        '& .MuiList-root': {
          padding: 0
        }
      },
      '& .SCNavigationToolbar-link': {
        display: 'block',
        textAlign: 'center',
        margin: theme.spacing(0, 'auto')
      }
    })
  }
};

export default Component;
