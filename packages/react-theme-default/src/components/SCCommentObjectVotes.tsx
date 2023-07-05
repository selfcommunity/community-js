const Component = {
  styleOverrides: {
    root: ({theme}: any) => ({
      flexGrow: 1,
      display: 'flex',
      flexDirection: 'row-reverse',
      '& .SCCommentObjectVotes-btnViewVotes': {
        minWidth: 0,
        '& .MuiIcon-root': {
          fontSize: '1.57rem'
        }
      }
    })
  }
};

export default Component;
