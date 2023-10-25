const Component = {
  styleOverrides: {
    root: ({theme}: any) => ({
      '& .SCFooter-copyright': {
        marginTop: theme.spacing(3),
        fontSize: '0.857rem'
      },
      '& .SCFooter-item-list': {
        display: 'flex',
        justifyContent: 'center',
        flexDirection: 'row',
        '& .SCFooter-item': {
          padding: theme.spacing(0.5, 1),
          color: theme.palette.text.primary
        }
      }
    })
  }
};

export default Component;
