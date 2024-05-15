const Component = {
  styleOverrides: {
    root: ({theme}: any) => ({
      padding: theme.spacing(0, 1, 0, 1),
      '& .SCNavigationToolbarMobile-logo': {
        margin: theme.spacing(0.5, 2, 0.5, 0.5),
        flexGrow: 1,
        '& img': {
          verticalAlign: 'middle',
          maxHeight: `calc(${theme.mixins.toolbar.minHeight}px - ${theme.spacing(1)})`
        }
      },
      '& h4': {
        fontSize: '1.286rem',
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        whiteSpace: 'nowrap'
      }
    }),
    skeletonRoot: ({theme}: any) => ({
      '& .SCNavigationToolbarMobile-logo': {
        width: 100,
        height: 20
      }
    })
  }
};

export default Component;
