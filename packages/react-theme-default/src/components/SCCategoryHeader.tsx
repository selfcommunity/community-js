const Component = {
  defaultProps: {
    CategoryFollowButtonProps: {
      size: 'medium'
    }
  },
  styleOverrides: {
    root: ({theme}: any) => ({
      '& .SCCategoryHeader-cover': {
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: 270,
        color: '#FFF',
        background: 'linear-gradient(180deg, rgba(177,177,177,1) 0%, rgba(255,255,255,1) 90%)',
        height: 200,
        borderRadius: 0,
        [theme.breakpoints.up('md')]: {
          borderRadius: theme.shape.borderRadius
        }
      },
      '& .SCCategoryHeader-info': {
        paddingLeft: theme.spacing(2),
        paddingRight: theme.spacing(2),
        marginTop: theme.spacing(1),
        marginBottom: theme.spacing(3),
        '& .SCCategoryHeader-name, & .SCCategoryHeader-slogan': {
          display: 'block',
          whiteSpace: 'nowrap',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          textAlign: 'center',
          marginBottom: theme.spacing(2)
        },
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
        '& .SCCategoryHeader-followed, & .SCCategoryHeader-action': {
          textAlign: 'center',
          marginBottom: theme.spacing(2)
        },
        '& .SCCategoryHeader-followed': {
          '& .SCCategoryHeader-followed-counter': {
            fontSize: '1rem',
            fontWeight: theme.typography.fontWeightRegular,
            display: 'inline'
          }
        }
      }
    }),
    skeletonRoot: ({theme}: any) => ({})
  }
};

export default Component;
