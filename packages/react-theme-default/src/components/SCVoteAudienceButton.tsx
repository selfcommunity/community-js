const Component = {
  styleOverrides: {
    root: ({theme}: any) => ({
      '& .SCVoteAudienceButton-reaction-list': {
        '& .MuiIcon-root': {
          padding: 1,
          borderRadius: '50%',
          backgroundColor: theme.palette.background.paper,
          border: `1px solid ${theme.palette.background.paper}`
        }
      }
    }),
    dialogRoot: ({theme}: any) => ({
      '& .SCVoteAudienceButton-dialog-tabs': {
        '& .MuiTab-root': {
          flexDirection: 'row',
          justifyContent: 'space-evenly'
        }
      },
      '& .SCVoteAudienceButton-dialog-vote-badge': {
        width: theme.selfcommunity.user.avatar.sizeSmall,
        height: theme.selfcommunity.user.avatar.sizeSmall,
        backgroundColor: theme.palette.background.paper,
        border: `1px solid ${theme.palette.background.paper}`
      }
    })
  }
};

export default Component;
