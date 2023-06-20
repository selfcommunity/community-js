const Component = {
  styleOverrides: {
    root: ({theme}: any) => ({
      padding: theme.spacing(0, 1, 0, 1),
      '& .SCNavigationToolbarMobile-logo': {
        margin: theme.spacing(0.5, 2, 0.5, 0),
        flexGrow: 1,
        '& img': {
          verticalAlign: 'middle',
          maxHeight: theme.mixins.toolbar.minHeight
        }
      },
      '& h4': {
        fontSize: '1.286rem',
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        whiteSpace: 'nowrap'
      }
    })
  }
};

export default Component;
