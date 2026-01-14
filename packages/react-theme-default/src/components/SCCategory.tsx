const Component = {
  styleOverrides: {
    root: ({theme}: any) => ({
      borderRadius: 0,
      [theme.breakpoints.up('sm')]: {
        borderRadius: theme.shape.borderRadius
      },
      '& .SCCategory-category-image': {
        '& img': {
          borderRadius: theme.spacing(1)
        }
      },
      '& .SCCategory-primary': {
        color: theme.palette.text.primary
      },
      '& .SCCategory-secondary': {
        color: theme.palette.text.secondary
      },
      '& .SCBaseItemButton-primary, & .SCCategory-primary': {
        fontWeight: theme.typography.fontWeightBold
      },
      '& .SCBaseItemButton-secondary': {
        fontSize: '0.857rem',
        whiteSpace: 'nowrap',
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        display: 'block'
      },
      '& .SCCategory-primary, & .SCCategory-secondary': {
        whiteSpace: 'nowrap',
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        display: 'block'
      },
      '&.MuiPaper-outlined': {
        paddingLeft: theme.spacing(1),
        paddingRight: theme.spacing(1)
      }
    }),
    skeletonRoot: ({theme}: any) => ({
      '& .SCCategory-image': {
        borderRadius: theme.spacing(1)
      },
      '& .SCCategory-primary': {
        marginBottom: theme.spacing(1)
      },
      '& .SCCategory-secondary': {
        marginBottom: theme.spacing(1)
      },
      '& .SCCategory-action': {
        margin: theme.spacing(0.5)
      },
			'&.MuiPaper-outlined': {
				paddingLeft: theme.spacing(1),
				paddingRight: theme.spacing(1)
			}
    })
  }
};

export default Component;
