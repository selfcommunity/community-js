const Component = {
  styleOverrides: {
    root: ({theme}: any) => ({
      '& .SCCustomSnackMessage-card': {
        width: '100%',
        '& .SCCustomSnackMessage-content': {
          position: 'relative',
          padding: theme.spacing(2, 4, 2, 2)
        }
      }
    })
  }
};

export default Component;
