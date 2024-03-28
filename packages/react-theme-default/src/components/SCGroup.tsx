const Component = {
  styleOverrides: {
    root: ({theme}: any) => ({
      borderRadius: 0,
      paddingBottom: 0,
      overflow: 'visible',
      [theme.breakpoints.up('sm')]: {
        borderRadius: theme.shape.borderRadiusSm
      },
      '& .SCBaseItemButton-image': {
        marginRight: theme.spacing(1.25),
        '& .MuiAvatar-root': {
          width: theme.selfcommunity.group.avatar.sizeSmall,
          height: theme.selfcommunity.group.avatar.sizeSmall,
          '& img': {
            borderRadius: 0
          }
        }
      },
      '& .SCBaseItemButton-primary': {
        fontWeight: theme.typography.fontWeightBold
      },
      '& .SCBaseItemButton-secondary': {
        fontSize: '0.857rem'
      },
      '& .SCGroup-actions': {
        '& .MuiIcon-root': {
          fontSize: '1.286rem',
          color: theme.palette.primary.main
        }
      }
    }),
    skeletonRoot: ({theme}: any) => ({})
  }
};

export default Component;
