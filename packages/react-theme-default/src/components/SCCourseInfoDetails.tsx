const Component = {
  styleOverrides: {
    root: ({ theme }) => ({
      gap: theme.spacing(0.5),
      '& .SCCourseInfoDetails-icon-text-wrapper': {
        flexDirection: 'row',
        alignItems: 'center',
        gap: theme.spacing(0.75),

        '& > p': {
          textTransform: 'capitalize'
        },

        '& .SCCourseInfoDetails-link': {
          textDecoration: 'none',
          color: theme.palette.text.primary,

          '&:hover': {
            textDecoration: 'underlined'
          },

          '& .SCCourseInfoDetails-url': {
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            display: '-webkit-box',
            '-webkit-line-clamp': '1',
            '-webkit-box-orient': 'vertical'
          }
        },

        '& .SCCourseInfoDetails-in-progress': {
          width: '6px',
          height: '6px',
          borderRadius: '9999px',
          backgroundColor: theme.palette.secondary.main
        }
      },

      '& .SCCourseInfoDetails-creation-wrapper': {
        flexDirection: 'row',
        alignItems: 'center',
        gap: theme.spacing(1)
      }
    })
  }
};

export default Component;
