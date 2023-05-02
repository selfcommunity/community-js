const Component = {
  styleOverrides: {
    root: ({theme}: any) => ({
      '& .SCCategories-filters': {
        marginTop: theme.spacing(),
        marginBottom: theme.spacing(2)
      },
      '& .SCCategories-categories': {
        marginTop: theme.spacing(3),
        '& .SCCategories-category': {
          padding: theme.spacing(2),
          width: 'auto',
          '& > div': {
            cursor: 'default'
          },
          '& .SCCategory-category-image': {
            minWidth: 56,
            height: '100%',
            borderTopLeftRadius: theme.shape.borderRadius,
            borderBottomLeftRadius: theme.shape.borderRadius,
            borderRadius: 0
          }
        }
      }
    })
  }
};

export default Component;
