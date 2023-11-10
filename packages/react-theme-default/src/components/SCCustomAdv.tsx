const Component = {
  styleOverrides: {
    root: ({theme}: any) => ({
      margin: theme.spacing(2, 0),
      '& .SCCustomAdv-wrap': {
        width: '100%',
        position: 'relative'
      },
      '& .SCCustomAdv-image': {
        width: '100%'
      },
      '& .SCCustomAdv-embed-code': {
        width: '100%'
      },
      '& .SCCustomAdv-prefixed-height': {
        position: 'absolute',
        top: 0,
        left: 0,
        bottom: 0,
        right: 0
      }
    }),
    skeletonRoot: ({theme}: any) => ({}),
    dialogRoot: ({theme}: any) => ({})
  }
};

export default Component;
