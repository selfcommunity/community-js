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
    })
  }
};

export default Component;
