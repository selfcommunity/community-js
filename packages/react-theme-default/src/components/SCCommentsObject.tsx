const Component = {
  styleOverrides: {
    root: ({theme}: any) => ({
      boxShadow: 'none',
      position: 'relative',
      display: 'flex',
      flexWrap: 'wrap',
      width: '100%',
			paddingBottom: theme.spacing(),
      '& .SCCommentsObject-load-more-comments-button': {
        textTransform: 'initial',
        padding: theme.spacing()
      },
      '& .SCCommentsObject-load-previous-comments-button': {
        textTransform: 'initial',
        padding: theme.spacing()
      },
      '& .SCCommentsObject-comments-counter': {
        paddingRight: theme.spacing()
      },
      '& .SCCommentsObject-pagination-link': {
        display: 'none'
      },
      '& .SCCommentsObject-pagination': {
        width: '100%',
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
