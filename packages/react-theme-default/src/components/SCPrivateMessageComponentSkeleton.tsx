const Component = {
  styleOverrides: {
    root: ({theme}: any) => ({
      [theme.breakpoints.up('sm')]: {
        width: theme.breakpoints.values['lg']
      },
      '& .SCPrivateMessageComponentSkeleton-thread-section': {
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
