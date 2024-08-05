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
          width: 100,
          height: 60,
          '& img': {
            borderRadius: 0
          }
        }
      },
      '& .SCBaseItemButton-text': {
        fontSize: theme.typography.fontSize,
        '& .SCEvent-primary': {
          '& p': {
            fontWeight: theme.typography.fontWeightBold
          }
        },
        '& .SCEvent-secondary': {
          color: theme.palette.text.secondary
        }
      }
    }),
    skeletonRoot: ({theme}: any) => ({})
  }
};

export default Component;
