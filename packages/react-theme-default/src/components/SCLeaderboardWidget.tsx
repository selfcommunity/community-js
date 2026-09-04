import {alpha} from '@mui/material';

const Component = {
  styleOverrides: {
    root: ({theme}: any) => ({
      borderRadius: theme.shape.borderRadius * 2,
      '& .SCLeaderboardWidget-podium-header': {
        marginBottom: theme.spacing(4)
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
        position: 'absolute',
        top: -28,
        left: '50%',
        transform: 'translateX(-50%)',
        zIndex: 1,
        display: 'inline-block',
        width: 38,
        height: 38,
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
        width: '100%',
        textAlign: 'center',
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        whiteSpace: 'nowrap'
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
        borderRadius: 12,
        backgroundColor: theme.palette.background.paper,
        boxShadow: `0px 2px 8px ${alpha(theme.palette.common.black, 0.08)}`
      },
      '& .SCLeaderboardWidget-ranking-item-active': {
        backgroundColor: theme.palette.primary.main,
        boxShadow: `0px 4px 12px ${alpha(theme.palette.primary.main, 0.35)}`,
        '& .SCLeaderboardWidget-ranking-position, & .SCLeaderboardWidget-ranking-name, & .SCLeaderboardWidget-ranking-score': {
          color: theme.palette.primary.contrastText
        }
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
