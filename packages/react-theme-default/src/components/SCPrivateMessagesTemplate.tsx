const Component = {
  styleOverrides: {
    root: ({theme}: any) => ({
      maxWidth: theme.breakpoints.values['lg'],
      maxHeight: theme.breakpoints.values['lg'],
      ' .MuiPaper-root, MuiAppBar-root': {
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
        // '& .MuiAppBar-root': {
        //   color: theme.palette.text.secondary,
        //   '& .MuiFormControl-root, MuiTextField-root': {
        //     marginTop: '30px',
        //     '&  .MuiInputBase-root': {
        //       borderRadius: 0
        //     }
        //   }
        // }
      }
    })
  }
};

export default Component;
