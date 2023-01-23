const Component = {
  styleOverrides: {
    root: ({theme}: any) => ({
      ' .MuiPaper-root, MuiAppBar-root': {
        boxShadow: 'none'
      },
      '& .SCMessage-root': {
        paddingRight: theme.spacing(2),
        paddingLeft: theme.spacing(2)
      },
      [theme.breakpoints.down('md')]: {
        '& .MuiPaper-root, MuiCard-root, SCWidget-root, SCSnippets-root': {
          border: 'none'
        },
        '& .MuiAppBar-root': {
          color: theme.palette.text.secondary,
          '& .MuiFormControl-root, MuiTextField-root': {
            marginTop: '30px',
            '&  .MuiInputBase-root': {
              borderRadius: 0
            }
          }
        }
      }
    })
  }
};

export default Component;
