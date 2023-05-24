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
    })
  }
};

export default Component;
