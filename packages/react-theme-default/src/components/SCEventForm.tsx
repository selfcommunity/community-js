import {alpha} from '@mui/system';

const Component = {
  styleOverrides: {
    root: ({theme, disableModal}: any) => ({
      ...(disableModal && {position: 'relative'}),
      '& .SCEventForm-cover': {
        position: 'relative',
        height: 120,
        minHeight: 120,
        '& .SCEventForm-upload-event-cover-root': {
          position: 'absolute',
          right: theme.spacing(2),
          bottom: theme.spacing(1),
          padding: theme.spacing(1),
          minWidth: 'auto'
        }
      },
      '& .SCEventForm-header': {
        marginTop: theme.spacing(4.5),
        color: theme.palette.text.secondary
      },
      '& .SCEventForm-form': {
        '& .SCEventForm-picker': {
          width: '50%',
          '& .MuiFormHelperText-root': {
            height: 0,
            marginTop: 0
          }
        },
        '& .MuiTextField-root, .SCEventForm-frequency': {
          marginBottom: theme.spacing(2)
        },
        '& .MuiButton-text': {
          justifyContent: 'start',
          paddingLeft: theme.spacing(1),
          '&:hover': {
            backgroundColor: 'transparent'
          }
        }
      },
      '& .SCEventForm-date-time': {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: theme.spacing(1),
        '& .MuiInputBase-root': {
          paddingLeft: theme.spacing(0.5)
        }
      },
      '& .SCEventForm-error': {
        color: theme.palette.error.main
      },
      '& .SCEventForm-switch': {
        '& .MuiButtonBase-root': {
          '&.Mui-checked': {
            color: theme.palette.secondary.main,
            '& + .MuiSwitch-track': {
              backgroundColor: theme.palette.secondary.main
            }
          }
        }
      },
      '& .SCEventForm-switch-label': {
        fontWeight: theme.typography.fontWeightMedium,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: theme.spacing(0.5)
      },
      '& .SCEventForm-active': {
        color: theme.palette.secondary.main
      },
      '& .SCEventForm-privacy-section': {
        marginTop: theme.spacing(2),
        justifyContent: 'center',
        '& .SCEventForm-privacy-section-info': {
          marginBottom: theme.spacing(2)
        }
      },
      '& .SCEventForm-visibility-section-info': {
        marginTop: theme.spacing(1)
      },
      '& .MuiDivider-root': {
        marginTop: theme.spacing(2),
        border: `1px solid ${alpha(theme.palette.primary.main, theme.palette.action.activatedOpacity)}`
      },
      '& .MuiDialogTitle-root': {
        '& span': {
          flexGrow: 1,
          textAlign: 'center'
        }
      },
      '& .SCEventForm-event-address-root': {
        marginTop: theme.spacing(2),
        backgroundColor: theme.palette.grey['A200'],
        borderRadius: 5,
        '& .SCEventForm-event-address-tabs': {
          padding: theme.spacing(0, 2, 0, 2),
          '& .MuiTabs-indicator': {
            bottom: theme.spacing(1.5)
          }
        },
        '& .SCEventForm-event-address-tab': {
          textTransform: 'none'
        },
        '& .SCEventForm-event-address-tab-content': {
          padding: theme.spacing(0.5, 2, 2, 2)
        }
      }
    })
  }
};

export default Component;
