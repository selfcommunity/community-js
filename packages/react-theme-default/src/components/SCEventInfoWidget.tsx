const Component = {
  styleOverrides: {
    root: ({theme}) => ({
      '& .SCEventInfoWidget-content': {
        position: 'relative',
        padding: `${theme.spacing(2)} ${theme.spacing(2)} 13px !important`,

        '& .SCEventInfoWidget-title-wrapper': {
          flexDirection: 'row',
          alignItems: 'center',
          gap: '9px',
          marginBottom: theme.spacing(1)
        },

        '& .SCEventInfoWidget-text-wrapper': {
          marginBottom: theme.spacing(3),

          '& .SCEventInfoWidget-show-more': {
            fontSize: theme.typography.fontSize,
            fontWeight: theme.typography.fontWeightBold,
            padding: theme.spacing(0.25),
            justifyContent: 'start',

            '&:hover': {
              backgroundColor: 'transparent'
            }
          }
        }
      }
    })
  }
};

export default Component;
