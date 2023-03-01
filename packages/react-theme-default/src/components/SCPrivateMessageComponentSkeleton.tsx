const Component = {
  styleOverrides: {
    root: ({theme}: any) => ({
      [theme.breakpoints.up('sm')]: {
        width: theme.breakpoints.values['lg']
        //maxHeight: theme.breakpoints.values['lg'],
      },
      '& .SCPrivateMessageComponentSkeleton-snippets-section': {
        '& .MuiCardContent-root': {
          display: 'flex',
          flexDirection: 'column',
          '& .SCPrivateMessageSnippetsSkeleton-button': {
            alignSelf: 'center'
          },
          '& .SCPrivateMessageSnippetsSkeleton-search-bar': {
            marginTop: theme.spacing(2)
          }
        }
      },
      ' .MuiPaper-root, MuiAppBar-root': {
        boxShadow: 'none',
        borderRadius: 0
      }
    })
  }
};

export default Component;
