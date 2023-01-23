const Component = {
  styleOverrides: {
    root: ({theme}: any) => ({
      '& .SCCommentsObjectSkeleton-root': {
        '& .SCWidget-root': {
          marginBottom: '0px !important'
        }
      },
      '& .SCCommentObjectSkeleton-root': {
        background: 'transparent',
        boxShadow: 'none',
        border: 0,
        '& .SCCommentObjectSkeleton-root': {
          marginBottom: '0px !important'
        }
      }
    })
  }
};

export default Component;
