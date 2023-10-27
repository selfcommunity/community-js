const Component = {
  styleOverrides: {
    root: ({theme}: any) => ({}),
    skeletonRoot: ({theme}: any) => ({}),
    dialogRoot: ({theme}: any) => ({}),
    pollSnippetRoot: ({theme}: any) => ({
      '& > div': {
        alignItems: 'flex-start',
        paddingTop: theme.spacing(1)
      },
      '& .SCBaseItem-text': {
        marginTop: 0
      },
      '& .SCPollSuggestionWidget-username': {
        color: theme.palette.text.primary,
        fontWeight: theme.typography.fontWeightBold,
        textDecoration: 'none'
      },
      '& .SCPollSuggestionWidget-avatar': {
        width: theme.selfcommunity.user.avatar.sizeMedium,
        height: theme.selfcommunity.user.avatar.sizeMedium
      },
      '& .SCPollSuggestionWidget-activity-at': {
        textDecoration: 'none',
        color: 'inherit',
        marginTop: 3
      }
    })
  }
};

export default Component;
