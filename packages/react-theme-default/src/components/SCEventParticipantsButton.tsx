const Component = {
  styleOverrides: {
    root: ({ theme }) => ({
      gap: theme.spacing(1),
      marginTop: '0 !important',

      '&:hover': {
        backgroundColor: 'unset'
      },

      '& .MuiAvatarGroup-avatar': {
        width: '24px',
        height: '24px'
      },

      '& .SCEventParticipantsButton-participants': {
        color: theme.palette.grey[600]
      }
    }),
    dialogRoot: ({ theme }) => ({
      '& .SCEventParticipantsButton-infinite-scroll': {
        height: '400px !important',

        [theme.breakpoints.down('md')]: {
          height: '100%'
        }
      }
    })
  }
};

export default Component;
