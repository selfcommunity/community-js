const Component = {
  styleOverrides: {
    root: ({theme}) => ({
      '& .SCCourseDashboard-header-img': {
        width: '100%',
        height: '150px',
        borderBottomLeftRadius: '10px',
        borderBottomRightRadius: '10px',
        marginBottom: '17px',

        [theme.breakpoints.down('sm')]: {
          display: 'none'
        }
      },
      '& .SCCourseDashboard-header-outer-wrapper': {
        alignItems: 'flex-start',
        gap: '32px',
        marginTop: theme.spacing(2),
        marginBottom: theme.spacing(3),

        [theme.breakpoints.up('sm')]: {
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginTop: theme.spacing(3),
          marginBottom: '19px'
        },

        '& .SCCourseDashboard-header-inner-wrapper': {
          alignItems: 'flex-start',
          gap: '17px',

          [theme.breakpoints.up('sm')]: {
            flexDirection: 'row',
            alignItems: 'center',
            gap: '28px'
          },

          '& .SCCourseDashboard-header-icon-wrapper': {
            flexDirection: 'row',
            alignItems: 'center',
            gap: theme.spacing(1)
          }
        }
      },

      '& .SCCourseDashboard-info-wrapper': {
        gap: theme.spacing(2),
        marginBottom: theme.spacing(2),

        [theme.breakpoints.up('sm')]: {
          flexDirection: 'row',
          gap: '38px'
        },

        '& .SCCourseDashboard-info': {
          flex: 1,
          gap: '6px',
          border: `1px solid ${theme.palette.grey['300']}`,
          borderRadius: '10px',
          padding: theme.spacing('17px', 3, '19px'),

          '& .SCCourseParticipantsButton-root': {
            justifyContent: 'flex-start',
            padding: 0
          }
        }
      },

      '& .SCCourseDashboard-tab-list': {
        borderBottom: `1px solid ${theme.palette.grey['300']}`,

        '& .SCCourseDashboard-tab': {
          textTransform: 'inherit'
        },

        '& > .Mui-disabled': {
          opacity: 0.3
        },

        '& > .MuiTabs-scrollButtons': {
          display: 'inline-flex'
        }
      },

      '& .SCCourseDashboard-tab-panel': {
        padding: '13px 0 0',

        [theme.breakpoints.down('md')]: {
          marginLeft: '14px'
        }
      }
    }),
    skeletonRoot: () => ({})
  }
};

export default Component;
