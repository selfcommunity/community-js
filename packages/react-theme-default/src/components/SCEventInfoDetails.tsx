const Component = {
  styleOverrides: {
		root: ({theme}) => ({
      gap: theme.spacing(2),

      '& .SCEventInfoDetails-icon-text-wrapper': {
        flexDirection: 'row',
        alignItems: 'center',
        gap: theme.spacing(1),

        '& .SCEventInfoDetails-link': {
          textDecoration: 'none',

          '& .SCEventInfoDetails-url': {
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            display: '-webkit-box',
            '-webkit-line-clamp': '1',
            '-webkit-box-orient': 'vertical'
          }
        }
      },

      '& .SCEventInfoDetails-creation-wrapper': {
        flexDirection: 'row',
        alignItems: 'center',
        gap: theme.spacing(1)
      }
    })
  }
};

export default Component;
