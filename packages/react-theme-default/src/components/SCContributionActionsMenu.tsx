import {alpha, darken} from '@mui/system';

const Component = {
  styleOverrides: {
    root: ({theme}: any) => ({
      '& .SCContributionActionsMenu-button': {
        color: theme.palette.primary.main,
        '&:hover': {
          backgroundColor: alpha(theme.palette.primary.main, theme.palette.action.hoverOpacity)
        }
      },
      '& .SCContributionActionsMenu-visibility-icons': {
        color: theme.palette.secondary.main,
        '& > span: nth-of-type(2)': {
          position: 'relative',
          top: 1
        }
      }
    }),
    popperRoot: ({theme}: any) => ({
      zIndex: 2,
      '& .SCContributionActionsMenu-popper-root': {
        overflow: 'visible',
        filter: 'drop-shadow(0px -1px 5px rgba(0,0,0,0.10))',
        mt: 1.5
      },
      '& .SCContributionActionsMenu-paper': {
        width: 280,
        '& .SCContributionActionsMenu-sub-item': {
          '& .MuiListItemIcon-root': {
            color: theme.palette.text.secondary
          },
          '&:hover': {
            backgroundColor: alpha(theme.palette.text.primary, theme.palette.action.hoverOpacity)
          }
        }
      },
      '& .SCContributionActionsMenu-footer-sub-items': {
        margin: '10px 10px 10px 17px',
        border: '1px solid #dddddd',
        padding: 5,
        borderRadius: 3,
        fontSize: 11
      },
      '& .SCContributionActionsMenu-selected-icon': {
        marginLeft: 2,
        '&.MuiListItemIcon-root': {
          width: '10px'
        },
        '& svg': {
          fontSize: '1.4rem'
        }
      },
      '& .SCContributionActionsMenu-section-badge': {
        padding: 0,
        minWidth: 15,
        height: 15,
        top: 3
      },
      '& .SCContributionActionsMenu-section-with-selection-icon': {
        fontSize: 12,
        color: theme.palette.common.white
      }
    })
  }
};

export default Component;
