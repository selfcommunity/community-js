const Component = {
  styleOverrides: {
    root: ({theme}: any) => ({
      '& .SCUserProfileEditSectionAccountCredentials-email, .SCUserProfileEditSectionAccountCredentials-password': {
        margin: theme.spacing(1, 0, 1, 0),
        fontWeight: 'bold'
      },
      '& .SCUserProfileEditSectionAccountCredentials-danger-zone': {
        marginTop: theme.spacing(2),
        '&  > *': {
          marginBottom: theme.spacing(2)
        }
      }
    }),
    dialogRoot: ({theme}: any) => ({
      '& .MuiDialogContent-root': {
        '& .SCUserProfileEditSectionAccountCredentials-password-form': {
          '& .SCUserProfileEditSectionAccountCredentials-form-field': {
            margin: theme.spacing(1, 1, 1, 0)
          }
        }
      },
      '& .SCUserProfileEditSectionAccountCredentials-confirm-change-button': {
        marginTop: theme.spacing(1)
      }
    })
  }
};

export default Component;
