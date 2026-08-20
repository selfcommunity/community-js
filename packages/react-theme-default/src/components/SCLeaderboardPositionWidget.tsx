import {alpha} from '@mui/material';

const Component = {
  styleOverrides: {
    root: ({theme}: any) => ({
      borderRadius: theme.shape.borderRadius * 2,
      overflow: 'hidden',
      '& .SCLeaderboardPositionWidget-title': {
        fontWeight: theme.typography.fontWeightBold,
        marginBottom: theme.spacing(2)
      },
      '& .SCLeaderboardPositionWidget-user': {
        padding: theme.spacing(1.5),
        marginBottom: theme.spacing(2),
        textDecoration: 'none',
        cursor: 'pointer'
      },
      '& .SCLeaderboardPositionWidget-user-name': {
        color: theme.palette.text.primary
      },
      '& .SCLeaderboardPositionWidget-footer': {
        margin: theme.spacing(0, -2.2, -3, -2.2),
        padding: theme.spacing(2, 2.2),
        backgroundColor: alpha(theme.palette.primary.main, 0.3)
      },
      '& .SCLeaderboardPositionWidget-position': {
        fontWeight: theme.typography.fontWeightBold
      },
      '& .SCLeaderboardPositionWidget-score': {
        color: theme.palette.text.secondary
      }
    }),
    skeletonRoot: ({theme}: any) => ({
      borderRadius: theme.shape.borderRadius * 2,
      overflow: 'hidden',
      '& .SCLeaderboardPositionWidget-header': {
        marginBottom: theme.spacing(2)
      },
      '& .SCLeaderboardPositionWidget-user': {
        padding: theme.spacing(1.5),
        marginBottom: theme.spacing(2)
      },
      '& .SCLeaderboardPositionWidget-footer': {
        margin: theme.spacing(0, -2.2, -3, -2.2),
        padding: theme.spacing(2, 2.2),
        backgroundColor: alpha(theme.palette.primary.main, theme.palette.action.hoverOpacity)
      }
    })
  }
};

export default Component;
