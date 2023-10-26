const Component = {
  styleOverrides: {
    root: ({theme}: any) => ({
      borderRadius: 0,
      [theme.breakpoints.up('sm')]: {
        borderRadius: theme.shape.borderRadius
      },
      '& .SCCategory-category-image': {
        '& img': {
          borderRadius: theme.spacing(1)
        }
      },
      '& .SCBaseItemButton-primary': {
        fontWeight: theme.typography.fontWeightBold
      },
      '& .SCBaseItemButton-secondary': {
        fontSize: '0.857rem'
      }
    }),
    skeletonRoot: ({theme}: any) => ({
      '& .SCCategory-image': {
        borderRadius: theme.spacing(1)
      },
      '& .SCCategory-primary': {
        marginBottom: theme.spacing(1)
      },
      '& .SCCategory-secondary': {
        marginBottom: theme.spacing(1)
      },
      '& .SCCategory-action': {
        margin: theme.spacing(0.5)
      }
    })
  }
};

export default Component;
