const Component = {
  styleOverrides: {
    root: ({theme}: any) => ({
      '& .SCCommentsObject-pagination': {
        paddingBottom: theme.spacing(1),
        '& button': {
          fontWeight: theme.typography.fontWeightLight,
          textDecoration: 'underline',
          textUnderlineOffset: 3,
          textDecorationStyle: 'dashed'
        },
        '& .SCCommentsObject-comments-counter': {
          fontSize: '0.8rem'
        }
      }
    })
  }
};

export default Component;
