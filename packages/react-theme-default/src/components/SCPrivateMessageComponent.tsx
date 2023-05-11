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
    })
  }
};

export default Component;
