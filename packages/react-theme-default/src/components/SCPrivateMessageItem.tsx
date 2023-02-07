const Component = {
  styleOverrides: {
    root: ({theme}: any) => ({
      paddingRight: `${theme.spacing(1)}!important`,
      paddingLeft: `${theme.spacing(1)}!important`,
      borderRadius: theme.spacing(1.5),
      '& .SCPrivateMessageItem-snippet-time': {
        fontSize: theme.typography.fontWeightRegular,
        color: theme.palette.text.secondary
      },
      '& .SCPrivateMessageItem-snippet-username': {
        fontWeight: theme.typography.fontWeightBold
      },
      '& .SCPrivateMessageItem-snippet-preview': {
        fontSize: theme.typography.fontWeightRegular
      }
    })
  }
};

export default Component;
