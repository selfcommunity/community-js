const Component = {
  styleOverrides: {
    root: ({theme}: any) => ({
      padding: theme.spacing(0, 3),
      '& .SCNavigationToolbar-logo': {
        '& img': {
          verticalAlign: 'middle',
          maxHeight: theme.mixins.toolbar.maxHeight
        }
      },
      '& .SCNavigationToolbar-navigation': {
        alignSelf: 'end',
        '& .SCNavigationToolbar-home, & .SCNavigationToolbar-explore': {
          padding: theme.spacing(2, 2, 1, 2),
          margin: theme.spacing(0, 2),
          color: theme.palette.primary.main,
          borderRadius: 0,
          borderBottom: `1px solid transparent`,
          '&.SCNavigationToolbar-active, &:hover': {
            color: theme.palette.secondary.main,
            borderBottom: `1px solid ${theme.palette.secondary.main}`
          }
        }
      },
      '& .SCNavigationToolbar-search': {
        textAlign: 'right',
        marginRight: theme.spacing(1.5),
        '& .MuiFormControl-root': {
          width: 330
        }
      },
      '& .SCNavigationToolbar-profile, & .SCNavigationToolbar-notification, & .SCNavigationToolbar-messages': {
        margin: theme.spacing(0, 0.5)
      },
      '& .SCNavigationToolbar-settings': {
        marginLeft: theme.spacing(4.5)
      }
    })
  }
};

export default Component;
