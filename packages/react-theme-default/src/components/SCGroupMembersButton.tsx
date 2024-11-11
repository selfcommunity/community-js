const Component = {
  styleOverrides: {
    root: ({ theme }: any) => ({
      padding: theme.spacing(),

      '& .MuiAvatarGroup-root .MuiAvatar-root': {
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
      }
    })
  }
};

export default Component;
