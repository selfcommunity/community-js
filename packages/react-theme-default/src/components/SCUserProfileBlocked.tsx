const Component = {
  styleOverrides: {
    root: ({theme}: any) => ({
      textAlign: 'center',
      '& .SCUserProfileBlocked-info': {
        marginTop: theme.spacing(3),
        marginBottom: theme.spacing(3)
      }
    })
  }
};

export default Component;
