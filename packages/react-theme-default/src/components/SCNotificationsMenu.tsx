const Component = {
  styleOverrides: {
    root: ({theme}: any) => ({
      '& .SCNotificationsMenu-paper': {
        padding: theme.spacing(2),
        '& .MuiList-root': {
          padding: 0
        }
      }
    })
  }
};

export default Component;
