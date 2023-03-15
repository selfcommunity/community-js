const Component = {
  styleOverrides: {
    root: ({theme}: any) => ({
      flexGrow: 1,
      display: 'flex',
      flexDirection: 'row-reverse',
      '& .SCCommentObjectReactions-btnViewVotes': {
        minWidth: 0,
        '& .MuiIcon-root': {
          fontSize: '1.571rem'
        }
      },
      '& .SCCommentObjectReactions-grouped-reactions': {
        justifyContent: 'center',
        alignItems: 'center',
        '& .MuiAvatar-root': {
          fontSize: '1.571rem',
          marginRight: '6px',
          height: '1em',
          width: '1em'
        }
      }
    })
  }
};

export default Component;
