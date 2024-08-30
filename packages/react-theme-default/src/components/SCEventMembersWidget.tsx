const Component = {
  styleOverrides: {
    root: ({ theme }) => ({
      '& .SCEventMembersWidget-content': {
        padding: `${theme.spacing(2)} ${theme.spacing(2)} ${theme.spacing(3)}`,

        '& .SCEventMembersWidget-title': {
          marginBottom: '18px'
        },

        '& .SCEventMembersWidget-tabs-wrapper': {
          borderBottom: `1px solid ${theme.palette.grey['300']}`,

          '& .SCEventMembersWidget-tab-label-wrapper': {
            gap: '2px',
            alignItems: 'center'
          }
        },

        '& .SCEventMembersWidget-tab-panel': {
          padding: `${theme.spacing(4)} 0 0`
        }
      },

      '& .SCEventMembersWidget-actions': {
        padding: `0 ${theme.spacing(2)} ${theme.spacing(3)}`,
        justifyContent: 'center',

        '& .SCSuggestedEventsWidget-actionButton': {
          color: theme.palette.primary.main
        }
      }
    }),
    skeletonRoot: ({ theme }) => ({
      '& .SCEventMembersWidget-content': {
        padding: `${theme.spacing(2)} ${theme.spacing(2)} ${theme.spacing(3)}`,

        '& .SCEventMembersWidget-title': {
          marginBottom: '18px'
        },

        '& .SCEventMembersWidget-tabs-wrapper': {
          borderBottom: `1px solid ${theme.palette.grey['300']}`,

          '& .SCEventMembersWidget-tab-label-wrapper': {
            gap: '2px',
            alignItems: 'center'
          }
        },

        '& .SCEventMembersWidget-tab-panel': {
          padding: `${theme.spacing(4)} 0 0`
        }
      },

      '& .SCEventMembersWidget-actions': {
        padding: `0 ${theme.spacing(2)} ${theme.spacing(3)}`,
        justifyContent: 'center'
      }
    }),
    dialogRoot: ({ theme }) => ({
      '& .SCEventMembersWidget-infinite-scroll': {
        height: '400px',

        [theme.breakpoints.down('md')]: {
          height: '100%'
        }
      }
    })
  }
};

export default Component;
