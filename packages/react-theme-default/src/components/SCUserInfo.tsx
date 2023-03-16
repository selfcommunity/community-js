const Component = {
  styleOverrides: {
    root: ({theme}: any) => ({
      '& .SCUserInfo-field': {
        marginBottom: theme.spacing(2),
        '& h6': {
          fontSize: '1.143rem',
          fontWeight: theme.typography.fontWeightBold,
          marginBottom: theme.spacing(0.5)
        },
        '&:last-of-type': {
          marginBottom: 0
        }
      }
    })
  }
};

export default Component;
