const Component = {
  styleOverrides: {
    root: ({theme}: any) => ({
      padding: theme.spacing(0, 1, 0, 2),
      '& .SCNavigationToolbarMobile-logo': {
        marginRight: theme.spacing(2),
        '& img': {
          verticalAlign: 'middle',
          maxHeight: theme.mixins.toolbar.maxHeight
        }
      }
    })
  }
};

export default Component;
