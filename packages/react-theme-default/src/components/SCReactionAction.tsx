const Component = {
  styleOverrides: {
    root: ({theme}: any) => ({
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      flexDirection: 'column',
      fontSize: '1.571rem',
      '&.SCReactionAction-inline': {
        flexDirection: 'row-reverse'
      },
      '& .SCReactionAction-divider': {
        width: '100%',
        borderBottom: 0
      },
      '& .SCReactionAction-reaction': {
        width: '1em',
        height: '1em'
      }
    })
  }
};

export default Component;
