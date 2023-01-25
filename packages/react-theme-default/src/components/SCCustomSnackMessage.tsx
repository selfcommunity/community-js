const Component = {
  styleOverrides: {
    root: ({theme}: any) => ({
      '& .SCCustomSnackMessage-card': {
        paddingLeft: 0
      },
      '& .SCNotificationItem-content': {
        paddingBottom: theme.spacing(1)
      }
    })
  }
};

export default Component;
