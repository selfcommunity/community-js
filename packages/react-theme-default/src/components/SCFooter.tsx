const Component = {
  styleOverrides: {
    root: ({theme}: any) => ({
      '& .SCFooter-copyright': {
        marginTop: theme.spacing(2)
      },
      '& .SCFooter-item-list': {
        display: 'flex',
        justifyContent: 'center',
        flexDirection: 'row',
        '& .SCFooter-item': {
          padding: theme.spacing(0.5, 1)
        }
      }
    })
  }
};

export default Component;
