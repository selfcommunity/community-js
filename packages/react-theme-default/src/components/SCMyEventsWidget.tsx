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
    })
  }
};

export default Component;
