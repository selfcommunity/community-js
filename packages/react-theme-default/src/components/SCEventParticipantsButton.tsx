const Component = {
  styleOverrides: {
    root: ({ theme }) => ({
      gap: theme.spacing(1),
      marginTop: '0 !important',
      minWidth: 'auto',

      '&:hover': {
        backgroundColor: 'unset'
      },

      '& .MuiAvatarGroup-avatar': {
        width: 'auto',
        height: theme.selfcommunity.user.avatar.sizeSmall,
        border: `1px solid ${theme.palette.common.white}`,
        fontSize: '0.7rem',

        '&.MuiAvatar-colorDefault': {
          marginLeft: 0,
          backgroundColor: 'transparent',
          color: theme.palette.primary.main,
          border: '0 none',
          borderRadius: 0,
          padding: 1
        }
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
