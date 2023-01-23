const Component = {
  styleOverrides: {
    root: ({theme}: any) => ({
      '& .SCUserProfileHeader-cover': {
        height: 350,
        borderRadius: 0,
        [theme.breakpoints.up('md')]: {
          borderRadius: theme.shape.borderRadius
        }
      },
      '& .SCUserProfileHeader-avatar': {
        height: 150,
        width: 150,
        top: 275
      },
      '& .SCUserProfileHeader-change-picture': {
        top: 235,
        left: 50
      },
      '& .SCUserProfileHeader-username': {
        marginTop: 80,
        fontWeight: theme.typography.fontWeightBold,
        fontSize: '1.25rem'
      }
    })
  }
};

export default Component;
