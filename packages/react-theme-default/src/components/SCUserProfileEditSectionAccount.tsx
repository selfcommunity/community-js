const Component = {
  styleOverrides: {
    root: ({theme}: any) => ({
      '& .SCUserProfileEditSectionAccount-danger-zone': {
        marginTop: theme.spacing(2),
        '&  > *': {
          marginBottom: theme.spacing(2)
        }
      }
    })
  }
};

export default Component;
