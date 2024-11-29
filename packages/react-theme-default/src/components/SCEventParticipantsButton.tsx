const Component = {
  styleOverrides: {
    root: ({theme, followers}) => ({
      gap: theme.spacing(1),
      marginTop: '0 !important',
      minWidth: 'auto',

      '&:hover': {
        backgroundColor: 'unset'
      },

      '& .MuiAvatarGroup-root': {
        '&:not(.SCAvatarGroupSkeleton-root) .MuiAvatar-root': {
          '&.MuiAvatar-colorDefault': {
            marginLeft: 0,
            backgroundColor: 'transparent',
            color: theme.palette.primary.main,
            border: '0 none',
            borderRadius: 0,
            padding: 1
          }
        },

        '& .MuiAvatar-root': {
          height: theme.selfcommunity.user.avatar.sizeSmall,
          border: `1px solid ${theme.palette.common.white}`,
          fontSize: '0.7rem',

          '&:first-of-type': {
            width: followers > 3 ? 'auto' : theme.selfcommunity.user.avatar.sizeSmall
          },

          '&:not(:first-of-type)': {
            width: theme.selfcommunity.user.avatar.sizeSmall
          }
        }
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
