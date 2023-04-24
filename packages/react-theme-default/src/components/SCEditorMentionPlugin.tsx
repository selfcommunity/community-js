const Component = {
  styleOverrides: {
    root: ({theme}: any) => ({
      position: 'absolute',
      background: theme.palette.background.paper,
      boxShadow: '0px 5px 10px rgba(0, 0, 0, 0.3)',
      borderEadius: 8,
      zIndex: 3000,
      '& ul': {
        padding: 0,
        listStyle: 'none',
        margin: 0,
        borderRadius: 10,
        '& li': {
          padding: theme.spacing(1),
          margin: 0,
          minWidth: 180,
          fontSize: theme.typography.body2.fontSize,
          outline: 'none',
          cursor: 'pointer',
          display: 'flex',
          flexDirection: 'row',
          justifyContent: 'left',
          alignItems: 'center',
          '&.selected': {
            background: theme.palette.action.selected
          },
          '&.hovered': {
            background: theme.palette.action.hover
          },
          '& .MuiAvatar-root': {
            width: 20,
            height: 20,
            marginRight: theme.spacing()
          }
        }
      }
    })
  }
};

export default Component;
