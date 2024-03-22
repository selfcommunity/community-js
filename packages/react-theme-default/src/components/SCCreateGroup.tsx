import {alpha} from '@mui/system';

const Component = {
  styleOverrides: {
    root: ({theme}: any) => ({
      '& .SCCreateGroup-cover': {
        position: 'relative',
        height: 120,
        minHeight: 120,
        '& .SCCreateGroup-avatar': {
          top: 120,
          display: 'block',
          position: 'absolute',
          transform: 'translate(-50%, -50%)',
          left: '50%',
          '& .MuiAvatar-root': {
            height: theme.selfcommunity.group.avatar.sizeMedium,
            width: theme.selfcommunity.group.avatar.sizeMedium,
            borderRadius: '50%',
            border: `#FFF solid ${theme.spacing(0.5)}`,
            objectFit: 'cover',
            '& img': {
              height: theme.selfcommunity.group.avatar.sizeMedium,
              width: theme.selfcommunity.group.avatar.sizeMedium
            }
          }
        },
        '& .SCChangeGroupPictureButton-root': {
          top: 120,
          left: '50%',
          transform: 'translate(90%, -50%)',
          position: 'relative',
          display: 'flex'
        },
        '& .SCChangeGroupCoverButton-root': {
          position: 'absolute',
          right: theme.spacing(2),
          bottom: theme.spacing(2)
        }
      },
      '& .SCCreateGroup-header': {
        marginTop: theme.spacing(4.5),
        color: theme.palette.text.secondary
      },
      '& .SCCreateGroup-switch': {
        '& .MuiButtonBase-root': {
          '&.Mui-checked': {
            color: theme.palette.secondary.main,
            '& + .MuiSwitch-track': {
              backgroundColor: theme.palette.secondary.main
            }
          }
        }
      },
      '& .SCCreateGroup-switch-label': {
        fontWeight: theme.typography.fontWeightMedium,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: theme.spacing(0.5)
      },
      '& .SCCreateGroup-active': {
        color: theme.palette.secondary.main
      },
      '& .SCCreateGroup-privacy-section': {
        marginTop: theme.spacing(2),
        '& .SCCreateGroup-privacy-section-info': {
          marginBottom: theme.spacing(2)
        }
      },
      '& .SCCreateGroup-visibility-section-info': {
        marginTop: theme.spacing(1)
      },
      '& .MuiDivider-root': {
        marginTop: theme.spacing(2),
        border: `1px solid ${alpha(theme.palette.primary.main, theme.palette.action.activatedOpacity)}`
      },
      '& .SCCreateGroup-invite-section': {
        marginTop: theme.spacing(2),
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center'
      }
    })
  }
};

export default Component;
