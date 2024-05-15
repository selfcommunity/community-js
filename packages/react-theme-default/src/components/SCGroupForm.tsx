import {alpha} from '@mui/system';

const Component = {
  styleOverrides: {
    root: ({theme}: any) => ({
      '& .SCGroupForm-cover': {
        position: 'relative',
        height: 120,
        minHeight: 120,
        '& .SCGroupForm-avatar': {
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
      '& .SCGroupForm-header': {
        marginTop: theme.spacing(4.5),
        color: theme.palette.text.secondary
      },
      '& .SCGroupForm-error': {
        color: theme.palette.error.main
      },
      '& .SCGroupForm-switch': {
        '& .MuiButtonBase-root': {
          '&.Mui-checked': {
            color: theme.palette.secondary.main,
            '& + .MuiSwitch-track': {
              backgroundColor: theme.palette.secondary.main
            }
          }
        }
      },
      '& .SCGroupForm-switch-label': {
        fontWeight: theme.typography.fontWeightMedium,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: theme.spacing(0.5)
      },
      '& .SCGroupForm-active': {
        color: theme.palette.secondary.main
      },
      '& .SCGroupForm-privacy-section': {
        marginTop: theme.spacing(2),
        '& .SCGroupForm-privacy-section-info': {
          marginBottom: theme.spacing(2)
        }
      },
      '& .SCGroupForm-visibility-section-info': {
        marginTop: theme.spacing(1)
      },
      '& .MuiDivider-root': {
        marginTop: theme.spacing(2),
        border: `1px solid ${alpha(theme.palette.primary.main, theme.palette.action.activatedOpacity)}`
      },
      '& .SCGroupForm-invite-section': {
        marginTop: theme.spacing(2),
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center'
      }
    })
  }
};

export default Component;
