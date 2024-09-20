const Component = {
  styleOverrides: {
    root: ({theme}) => ({
      gap: theme.spacing(1),
      marginTop: '0 !important',
      minWidth: 'auto',
      '&:hover': {
        backgroundColor: 'unset'
      },

      '& .MuiAvatarGroup-avatar': {
        width: theme.selfcommunity.user.avatar.sizeSmall,
        height: theme.selfcommunity.user.avatar.sizeSmall,
        fontSize: '0.8rem'
      },

      '& .SCEventParticipantsButton-participants': {
        color: theme.palette.grey[600]
      }
    }),
    dialogRoot: ({theme}) => ({
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
