const Component = {
  styleOverrides: {
    root: ({theme}: any) => ({
      height: '100%',
      '& .SCPrivateMessageComponent-snippets-box, & .SCPrivateMessageComponent-thread-box': {
        position: 'relative',
        '& .SCPrivateMessageSnippets-root, & .SCPrivateMessageThread-root': {
          position: 'absolute',
          top: 0,
          left: 0
        }
      },
      '& .SCPrivateMessageComponent-hide': {
        display: 'none'
      }
    }),
    skeletonRoot: ({theme}: any) => ({
      [theme.breakpoints.up('sm')]: {
        width: theme.breakpoints.values['lg']
      },
      '& .SCPrivateMessageComponent-thread-section': {
        '& .MuiCardContent-root': {
          padding: 0,
          '& .MuiList-root': {
            paddingTop: 0,
            paddingBottom: 0
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
