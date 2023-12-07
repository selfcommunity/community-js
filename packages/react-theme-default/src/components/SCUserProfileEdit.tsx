const Component = {
  styleOverrides: {
    root: ({theme}: any) => ({
      '& .SCUserProfileEdit-tabs': {
        marginBottom: theme.spacing(3),
        '& .MuiTabScrollButton-root': {
          transition: 'width 1s ease-in-out',
          '&.Mui-disabled': {
            width: 0
          }
        }
      },
      '& .SCUserProfileEdit-tab-content': {
        padding: theme.spacing(0, 2),
        maxWidth: 400
      }
    }),
    skeletonRoot: ({theme}: any) => ({}),
    passwordDialogRoot: ({theme}: any) => ({
      '& .MuiDialogContent-root': {
        '& .SCUserProfileEdit-password-form': {
          '& .SCUserProfileEdit-form-field': {
            margin: theme.spacing(1, 1, 1, 0)
          }
        }
      },
      '& .SCUserProfileEdit-confirm-change-button': {
        marginTop: theme.spacing(1)
      }
    }),
    accountRoot: ({theme}: any) => ({
      '& .SCUserProfileEdit-danger-zone': {
        marginTop: theme.spacing(2),
        '&  > *': {
          marginBottom: theme.spacing(2)
        }
      },
      '& .SCUserProfileEdit-language-switcher': {
        margin: theme.spacing(1, 0, 1, 0)
      },
      '& .SCUserProfileEdit-account-credentials-root': {
        '& .SCUserProfileEdit-email, .SCUserProfileEdit-password': {
          margin: theme.spacing(1, 0, 1, 0),
          fontWeight: 'bold'
        }
      }
    }),
    settingsRoot: ({theme}: any) => ({
      '& .SCUserProfileEdit-control': {
        margin: theme.spacing(0, 0, 2, 0),
        '& .MuiFormControl-root': {
          display: 'block'
        }
      }
    }),
    publicInfoRoot: ({theme}: any) => ({
      '& .SCUserProfileEdit-field': {
        margin: theme.spacing(1, 0, 1, 0)
      },
      '& .SCUserProfileEdit-field .MuiSelect-icon': {
        right: theme.spacing(5)
      },
      '& .SCUserProfileEdit-btn-save': {
        marginTop: theme.spacing(2),
        marginBottom: theme.spacing()
      }
    })
  }
};

export default Component;
