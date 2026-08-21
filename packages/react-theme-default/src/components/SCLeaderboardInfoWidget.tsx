const Component = {
  styleOverrides: {
    root: ({theme}: any) => ({
      '& .SCLeaderboardInfoWidget-title': {
        fontWeight: theme.typography.fontWeightBold
      },
      '& .SCLeaderboardInfoWidget-item-icon': {
        backgroundColor: theme.palette.action.hover
      },
      '& .SCLeaderboardInfoWidget-item-icon-glyph': {
        display: 'inline-block',
        width: 18,
        height: 18,
        backgroundColor: theme.palette.primary.main,
        maskRepeat: 'no-repeat',
        maskPosition: 'center',
        maskSize: 'contain',
        WebkitMaskRepeat: 'no-repeat',
        WebkitMaskPosition: 'center',
        WebkitMaskSize: 'contain'
      },
      '& .SCLeaderboardInfoWidget-item-description': {
        color: theme.palette.text.secondary
      }
    })
  }
};

export default Component;
