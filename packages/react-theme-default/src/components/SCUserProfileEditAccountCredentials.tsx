const Component = {
  styleOverrides: {
    root: ({theme}: any) => ({
      '& .SCUserProfileEditAccountCredentials-email, .SCUserProfileEditAccountCredentials-password': {
        margin: theme.spacing(1, 0, 1, 0),
        fontWeight: 'bold'
      },
      '& .SCUserProfileEditAccountCredentials-danger-zone': {
        marginTop: theme.spacing(2),
        '&  > *': {
          marginBottom: theme.spacing(2)
        }
      }
    }),
    dialogRoot: ({theme}: any) => ({
      '& .MuiDialogContent-root': {
        '& .SCUserProfileEditAccountCredentials-form': {
          '& .SCUserProfileEditAccountCredentials-form-field': {
            margin: theme.spacing(1, 1, 1, 0)
          }
        }
      },
      '& .SCUserProfileEditAccountCredentials-confirm-change-button': {
        marginTop: theme.spacing(1)
      }
    })
  }
};

export default Component;
