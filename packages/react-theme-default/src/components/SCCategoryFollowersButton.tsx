const Component = {
  styleOverrides: {
    root: ({theme}: any) => ({
      padding: theme.spacing(),
      '& .MuiAvatarGroup-root .MuiAvatar-root': {
        width: theme.selfcommunity.user.avatar.sizeSmall,
        height: theme.selfcommunity.user.avatar.sizeSmall,
        border: '1px solid #fff',
        fontSize: '0.76rem',
        '&.MuiAvatar-colorDefault': {
          marginLeft: 0,
          backgroundColor: 'transparent',
          color: theme.palette.primary.main
        }
      }
    })
  }
};

export default Component;
