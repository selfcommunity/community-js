const Component = {
  styleOverrides: {
    root: ({ theme }) => ({
      gap: theme.spacing(1),
      marginTop: '0 !important',

      '&:hover': {
        backgroundColor: 'unset'
      },

      '& .SCEventPartecipantsButton-avatar': {
        width: '24px',
        height: '24px'
      },

      '& .SCEventPartecipantsButton-partecipants': {
        color: theme.palette.primary.main
      }
    }),
    dialogRoot: ({ theme }) => ({
      '& .SCEventPartecipantsButton-infinite-scroll': {
        height: '400px !important',

        [theme.breakpoints.down('md')]: {
          height: '100%'
        }
      }
    })
  }
};

export default Component;
