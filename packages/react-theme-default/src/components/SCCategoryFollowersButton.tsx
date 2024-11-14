const Component = {
  styleOverrides: {
    root: ({theme, followers}: any) => ({
      padding: theme.spacing(),

      '& .MuiAvatarGroup-root': {
        '& .MuiAvatar-root': {
          '&:first-of-type': {
            width: followers > 3 ? 'auto' : theme.selfcommunity.user.avatar.sizeSmall
          },

          '&:not(:first-of-type)': {
            width: theme.selfcommunity.user.avatar.sizeSmall
          },

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
        }
      }
    }),
    dialogRoot: () => ({})
  }
};

export default Component;
