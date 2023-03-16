const Component = {
  styleOverrides: {
    root: ({theme}: any) => ({
      padding: theme.spacing(0, 1, 0, 2),
      '& .SCNavigationToolbarMobile-logo': {
        marginRight: theme.spacing(2),
        flexGrow: 1,
        '& img': {
          verticalAlign: 'middle',
          maxHeight: theme.mixins.toolbar.minHeight
        }
      },
      '& h4': {
        fontSize: '1.286rem'
      }
    })
  }
};

export default Component;
