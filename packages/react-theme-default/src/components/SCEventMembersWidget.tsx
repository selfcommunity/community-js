import {getContrastRatio} from '@mui/material';

const Component = {
  styleOverrides: {
    root: ({theme}) => ({
      '& .SCEventMembersWidget-content': {
        padding: `${theme.spacing(2)} ${theme.spacing(2)}}`,

        '& .SCEventMembersWidget-title': {
          marginBottom: '18px'
        },

        '& .SCEventMembersWidget-tabs-wrapper': {
          borderBottom:
            getContrastRatio(theme.palette.background.paper, theme.palette.common.white) > 4.5
              ? `1px solid ${theme.palette.grey[800]}`
              : `1px solid ${theme.palette.grey[300]}`,

          '& .SCEventMembersWidget-tab-label-wrapper': {
            gap: '2px',
            alignItems: 'center'
          }
        },

        '& .SCEventMembersWidget-tab-panel': {
          padding: `${theme.spacing(4)} 0 0`
        },

        '& .SCEventMembersWidget-action-button': {
          left: '50%',
          transform: 'translate(-50%)',
          color: theme.palette.primary.main
        },

        '& .SCEventMembersWidget-event-button': {
          left: '50%',
          transform: 'translate(-50%)'
        }
      }
    }),
    skeletonRoot: ({theme}) => ({
      '& .SCEventMembersWidget-content': {
        padding: `${theme.spacing(2)} ${theme.spacing(2)}`,

        '& .SCEventMembersWidget-title': {
          marginBottom: '18px'
        },

        '& .SCEventMembersWidget-tabs-wrapper': {
          borderBottom:
            getContrastRatio(theme.palette.background.paper, theme.palette.common.white) > 4.5
              ? `1px solid ${theme.palette.grey[800]}`
              : `1px solid ${theme.palette.grey[300]}`,

          '& .SCEventMembersWidget-tab-label-wrapper': {
            gap: '2px',
            alignItems: 'center'
          }
        },

        '& .SCEventMembersWidget-tab-panel': {
          padding: `${theme.spacing(4)} 0 0`
        },

        '& .SCEventMembersWidget-action-button': {
          left: '50%',
          transform: 'translate(-50%)'
        }
      }
    }),
    dialogRoot: () => ({})
  }
};

export default Component;
