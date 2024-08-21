const Component = {
  styleOverrides: {
    root: ({ theme }) => ({
      '& .SCMyEventsWidget-title-wrapper': {
        padding: `12px ${theme.spacing(2)}`
      },

      '& .SCMyEventsWidget-content': {
        padding: `52px ${theme.spacing(3)} 0 !important`,

        '& .SCMyEventsWidget-first-divider': {
          marginTop: '18px',
          marginBottom: '16px'
        },

        '& .SCMyEventsWidget-second-divider': {
          marginTop: '16px',
          marginBottom: '18px'
        }
      },

      '& .SCMyEventsWidget-actions': {
        padding: `0 ${theme.spacing(3)} 18px`,
        justifyContent: 'center',
        gap: '56px',

        '& .SCMyEventsWidget-arrows': {
          width: '24px',
          height: '24px',
          color: theme.palette.primary.main
        },

        '& .SCMyEventsWidget-action-button': {
          color: theme.palette.primary.main,
          textDecoration: 'none'
        }
      }
    }),
    skeletonRoot: ({ theme }) => ({
      '& .SCMyEventsWidget-calendar': {
        position: 'absolute',
        bottom: '-36px',
        left: '24px',
        boxShadow: '0px 3px 8px #00000040'
      },

      '& .SCMyEventsWidget-content': {
        padding: `52px ${theme.spacing(3)} 0 !important`,

        '& .SCMyEventsWidget-first-divider': {
          marginTop: '18px',
          marginBottom: theme.spacing(2)
        },

        '& .SCMyEventsWidget-second-divider': {
          marginTop: theme.spacing(2),
          marginBottom: '18px'
        }
      },

      '& .SCMyEventsWidget-actions': {
        height: '50px',
        padding: `0 ${theme.spacing(3)} 18px`,
        justifyContent: 'center',
        gap: '56px'
      }
    })
  }
};

export default Component;
