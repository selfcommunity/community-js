const Component = {
  styleOverrides: {
    root: ({theme}: any) => ({
      '& .SCCategoryHeader-cover': {
        height: 350,
        borderRadius: 0,
        [theme.breakpoints.up('md')]: {
          borderRadius: theme.shape.borderRadius
        }
      },
      '& .SCCategoryHeader-info': {
        marginTop: theme.spacing(3),
        marginBottom: theme.spacing(5),
        '& .SCCategoryHeader-name': {
          fontSize: '1.65rem',
          fontWeight: theme.typography.fontWeightBold,
          marginBottom: 16
        },
        '& .SCCategoryHeader-slogan': {
          display: 'none'
        },
        '& .SCCategoryHeader-followed': {
          marginBottom: 20,
          '& .SCCategoryHeader-followed-counter': {
            fontSize: '1.1rem',
            fontWeight: theme.typography.fontWeightRegular
          },
          '& .MuiAvatarGroup-root .MuiAvatar-root': {
            border: 0,
            marginLeft: 0,
            width: 30,
            height: 30,
            padding: 2
          }
        }
      }
    })
  }
};

export default Component;
