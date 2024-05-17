const Component = {
  styleOverrides: {
    root: ({theme}: any) => ({
      color: theme.palette.text.primary,
      backgroundColor: theme.palette?.navbar?.main,
      zIndex: 1300
    })
  }
};

export default Component;
