const Component = {
  styleOverrides: {
    root: ({theme}: any) => ({
      [theme.breakpoints.up('sm')]: {
        maxWidth: theme.breakpoints.values['lg'],
        maxHeight: theme.breakpoints.values['md']
      },
      ' .MuiPaper-root': {
        boxShadow: 'none',
        borderRadius: 0
      },
      '& .SCPrivateMessageSnippetItem-root, .SCPrivateMessageThreadItem-root': {
        boxShadow: '0px 0px 10px rgba(0, 0, 0, 0.1)',
        marginBottom: theme.spacing(1)
      },
      [theme.breakpoints.down('md')]: {
        '& .MuiPaper-root, MuiCard-root, SCWidget-root, SCPrivateMessageSnippets-root': {
          border: 'none',
          '& .SCPrivateMessageThread-root': {
            borderRadius: 0
          }
        }
      },
      '& .SCPrivateMessageComponent-hide': {
        display: 'none'
      }
    })
  }
};

export default Component;
