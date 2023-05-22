const Component = {
  styleOverrides: {
    root: ({theme}: any) => ({
      '& .SCVoteAudienceButton-reaction-list': {
        maxWidth: theme.spacing(5),
        overflow: 'hidden',
        marginTop: theme.spacing(-0.25),
        fontSize: '1.143rem',
        display: 'flex',
        flexDirection: 'row',
        '& .MuiIcon-root': {
          paddingRight: theme.spacing(0.5),
          backgroundColor: 'transparent'
        }
      },
      '& > .MuiIcon-root': {
        fontSize: '1.143rem',
        marginTop: theme.spacing(-0.25)
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
