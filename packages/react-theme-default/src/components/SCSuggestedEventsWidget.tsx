const Component = {
  styleOverrides: {
    root: ({ theme }) => ({
      '& .SCSuggestedEventsWidget-content': {
        padding: `15px 0 ${theme.spacing(2)} ${theme.spacing(2)} !important`,

        '& .SCSuggestedEventsWidget-title': {
          marginBottom: '11px'
        },

        '& .SCSuggestedEventsWidget-swiper': {
          width: '200px',
          height: 'auto'
        }
      },

      '& .SCSuggestedEventsWidget-actions': {
        padding: `0 ${theme.spacing(2)} ${theme.spacing(2)}`,
        justifyContent: 'center',

        '& .SCSuggestedEventsWidget-actionButton': {
          color: theme.palette.primary.main
        }
      }
    }),
    skeletonRoot: ({ theme }) => ({
      '& .SCSuggestedEventsWidget-content': {
        padding: `15px 0 ${theme.spacing(3)} ${theme.spacing(2)} !important`,

        '& .SCSuggestedEventsWidget-title': {
          marginBottom: '11px'
        },

        '& .SCSuggestedEventsWidget-swiper': {
          width: '200px',
          height: 'auto'
        }
      },

      '& .SCSuggestedEventsWidget-actions': {
        padding: `0 ${theme.spacing(2)} ${theme.spacing(3)}`,
        justifyContent: 'center'
      }
    })
  }
};

export default Component;
