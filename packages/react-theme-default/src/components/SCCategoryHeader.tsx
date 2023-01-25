const Component = {
  defaultProps: {
    FollowCategoryButtonProps: {
      size: 'medium'
    }
  },
  styleOverrides: {
    root: ({theme}: any) => ({
      '& .SCCategoryHeader-cover': {
        height: 200,
        borderRadius: 0,
        [theme.breakpoints.up('md')]: {
          borderRadius: theme.shape.borderRadius
        }
      },
      '& .SCCategoryHeader-info': {
        marginTop: theme.spacing(1),
        marginBottom: theme.spacing(3),
        '& .SCCategoryHeader-name': {
          fontSize: '1.857rem',
          fontWeight: theme.typography.fontWeightBold,
          marginBottom: theme.spacing()
        },
        '& .SCCategoryHeader-slogan': {
          fontSize: '1rem',
          fontWeight: theme.typography.fontWeightMedium,
          marginBottom: theme.spacing(2)
        },
        '& .SCCategoryHeader-followed': {
          marginBottom: theme.spacing(2),
          '& .SCCategoryHeader-followed-counter': {
            fontSize: '1rem',
            fontWeight: theme.typography.fontWeightRegular
          },
          '& .MuiButton-root': {
            padding: theme.spacing(),
            '& .MuiAvatarGroup-root .MuiAvatar-root': {
              width: theme.selfcommunity.user.avatar.sizeSmall,
              height: theme.selfcommunity.user.avatar.sizeSmall,
              border: '1px solid #fff'
            },
            '& .MuiAvatar-colorDefault': {
              margin: 0,
              backgroundColor: 'transparent',
              color: theme.palette.primary.main,
              borderRadius: 0
            }
          }
        }
      }
    })
  }
};

export default Component;
