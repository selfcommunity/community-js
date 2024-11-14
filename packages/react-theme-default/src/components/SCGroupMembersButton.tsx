const Component = {
  styleOverrides: {
    root: ({theme, subscribers}: any) => ({
      padding: theme.spacing(),

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
            width: subscribers > 3 ? 'auto' : theme.selfcommunity.user.avatar.sizeSmall
          },

          '&:not(:first-of-type)': {
            width: theme.selfcommunity.user.avatar.sizeSmall
          }
        }
      }
    }),
    dialogRoot: () => ({})
  }
};

export default Component;
