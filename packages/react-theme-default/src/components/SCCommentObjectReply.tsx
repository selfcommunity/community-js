const Component = {
  styleOverrides: {
    root: ({theme}: any) => ({
      border: '0 none',
      '& .SCBaseItem-content': {
        alignItems: 'flex-start',
        '& .SCBaseItem-text': {
          marginTop: 0,
          marginBottom: 0,
          '& .SCBaseItem-secondary': {
            overflow: 'visible'
          }
        }
      },
      '& .SCCommentObjectReply-comment': {
        overflow: 'visible'
      },
      '& .SCCommentObjectReply-actions': {
        marginLeft: theme.spacing(),
        paddingBottom: theme.spacing()
      }
    })
  }
};

export default Component;
