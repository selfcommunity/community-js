const Component = {
  styleOverrides: {
    root: ({theme}: any) => ({
      '& .SCNotificationItem-root .SCNotificationItem-header .SCNotificationItem-secondary': {
        marginTop: theme.spacing(1),
        '& .SCDateTimeAgo-root': {
          marginTop: 0
        }
      }
    })
  }
};

export default Component;
