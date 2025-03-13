const Component = {
  styleOverrides: {
    root: ({theme}) => ({
      border: `1px solid ${theme.palette.grey['300']}`,
      borderRadius: '5px',

      '& .SCAccordionLessons-empty': {
        padding: theme.spacing('19px', 3)
      },

      '& .SCAccordionLessons-accordion': {
        '& .SCAccordionLessons-summary': {
          flexDirection: 'row-reverse',
          gap: theme.spacing(1),
          borderBottom: `1px solid ${theme.palette.grey['300']}`,
          padding: theme.spacing('22px', 3),
          backgroundColor: theme.palette.grey['200'],

          '& .MuiAccordionSummary-content': {
            justifyContent: 'space-between',
            margin: 0
          }
        },

        '& .SCAccordionLessons-details': {
          display: 'flex',
          alignItems: 'center',
          gap: theme.spacing(1),
          padding: theme.spacing('22px', 6),

          '&:not(:last-child)': {
            borderBottom: `1px solid ${theme.palette.grey['300']}`
          },

          '& .SCAccordionLessons-circle': {
            flexShrink: 0,
            width: theme.spacing(2),
            height: theme.spacing(2),
            borderRadius: '9999px',
            backgroundColor: theme.palette.grey['300']
          }
        }
      }
    }),
    skeletonRoot: ({theme}) => ({
      border: `1px solid ${theme.palette.grey['300']}`,
      borderRadius: '5px',

      '& .SCAccordionLessons-accordion': {
        '& .SCAccordionLessons-summary': {
          display: 'flex',
          justifyContent: 'space-between',
          borderBottom: `1px solid ${theme.palette.grey['300']}`,
          padding: theme.spacing('22px', 3),
          backgroundColor: theme.palette.grey['200']
        }
      }
    })
  }
};

export default Component;
