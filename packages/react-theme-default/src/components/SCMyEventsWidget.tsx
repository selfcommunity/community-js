const Component = {
  styleOverrides: {
    root: ({theme}) => ({
      '& .SCMyEventsWidget-title-wrapper': {
        padding: `12px ${theme.spacing(2)}`
      },

      '& .SCMyEventsWidget-actions': {
        padding: `0 ${theme.spacing(3)} 18px`,
        justifyContent: 'center',
        gap: theme.spacing(3),

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
    skeletonRoot: ({theme}) => ({
      '& .SCMyEventsWidget-actions': {
        height: '40px',
        padding: `0 ${theme.spacing(3)} 18px`,
        justifyContent: 'center',
        gap: theme.spacing(3)
      }
    })
  }
};

export default Component;
