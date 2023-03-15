const Component = {
  styleOverrides: {
    root: ({theme}: any) => ({
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      flexDirection: 'column',
      '&.SCVoteAction-inline': {
        flexDirection: 'row-reverse'
      },
      '& .SCVoteAction-divider': {
        width: '100%',
        borderBottom: 0
      }
    })
  }
};

export default Component;
