import {alpha} from '@mui/material';

const Component = {
  styleOverrides: {
    root: ({theme}: any) => ({
      borderRadius: theme.shape.borderRadius * 2,
      '& .SCLeaderboardWidget-podium-header': {
        marginBottom: theme.spacing(2)
      },
      '& .SCLeaderboardWidget-podium-title': {
        fontWeight: theme.typography.fontWeightBold
      },
      '& .SCLeaderboardWidget-podium': {
        gap: theme.spacing(2),
        marginBottom: theme.spacing(3)
      },
      '& .SCLeaderboardWidget-podium-item': {
        flex: '0 0 auto',
        width: 90
      },
      '& .SCLeaderboardWidget-podium-item-1': {
        order: 2
      },
      '& .SCLeaderboardWidget-podium-item-2': {
        order: 1
      },
      '& .SCLeaderboardWidget-podium-item-3': {
        order: 3
      },
      '& .SCLeaderboardWidget-podium-crown': {
        display: 'inline-block',
        width: 24,
        height: 24,
        marginBottom: theme.spacing(0.5),
        backgroundColor: theme.palette.primary.main,
        maskRepeat: 'no-repeat',
        maskPosition: 'center',
        maskSize: 'contain',
        WebkitMaskRepeat: 'no-repeat',
        WebkitMaskPosition: 'center',
        WebkitMaskSize: 'contain'
      },
      '& .SCLeaderboardWidget-podium-avatar-wrap': {
        position: 'relative',
        marginBottom: theme.spacing(1)
      },
      '& .SCLeaderboardWidget-podium-item-1 .SCLeaderboardWidget-podium-avatar': {
        width: 72,
        height: 72,
        border: `3px solid ${theme.palette.primary.main}`
      },
      '& .SCLeaderboardWidget-podium-item-2 .SCLeaderboardWidget-podium-avatar, & .SCLeaderboardWidget-podium-item-3 .SCLeaderboardWidget-podium-avatar':
        {
          width: 56,
          height: 56,
          border: `2px solid ${theme.palette.primary.light}`
        },
      '& .SCLeaderboardWidget-podium-badge': {
        position: 'absolute',
        bottom: -6,
        left: '50%',
        transform: 'translateX(-50%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: 22,
        height: 22,
        borderRadius: '50%',
        backgroundColor: theme.palette.primary.main,
        color: theme.palette.primary.contrastText,
        fontSize: 12,
        lineHeight: 1,
        fontWeight: theme.typography.fontWeightBold,
        border: `2px solid ${theme.palette.background.paper}`
      },
      '& .SCLeaderboardWidget-podium-name': {
        textAlign: 'center'
      },
      '& .SCLeaderboardWidget-podium-score': {
        color: theme.palette.text.secondary
      },
      '& .SCLeaderboardWidget-ranking-header': {
        marginBottom: theme.spacing(1.5)
      },
      '& .SCLeaderboardWidget-ranking-title': {
        fontWeight: theme.typography.fontWeightBold
      },
      '& .SCLeaderboardWidget-ranking-item': {
        padding: theme.spacing(1, 1.5),
        borderRadius: theme.shape.borderRadius
      },
      '& .SCLeaderboardWidget-ranking-item-active': {
        backgroundColor: alpha(theme.palette.primary.main, theme.palette.action.selectedOpacity)
      },
      '& .SCLeaderboardWidget-ranking-position': {
        width: 16,
        color: theme.palette.text.secondary
      },
      '& .SCLeaderboardWidget-ranking-avatar': {
        width: 36,
        height: 36
      },
      '& .SCLeaderboardWidget-ranking-name': {
        flex: 1,
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        whiteSpace: 'nowrap'
      },
      '& .SCLeaderboardWidget-ranking-score': {
        color: theme.palette.text.secondary
      },
      '& .SCLeaderboardWidget-see-more': {
        display: 'inline-block',
        marginTop: theme.spacing(1.5),
        color: theme.palette.primary.main,
        cursor: 'pointer',
        fontWeight: theme.typography.fontWeightMedium
      }
    }),
    skeletonRoot: ({theme}: any) => ({
      borderRadius: theme.shape.borderRadius * 2,
      '& .SCLeaderboardWidget-podium-header': {
        marginBottom: theme.spacing(2)
      },
      '& .SCLeaderboardWidget-podium': {
        marginBottom: theme.spacing(3)
      },
      '& .SCLeaderboardWidget-ranking-header': {
        marginBottom: theme.spacing(1.5)
      },
      '& .SCLeaderboardWidget-ranking-item': {
        padding: theme.spacing(1, 1.5)
      }
    })
  }
};

export default Component;
