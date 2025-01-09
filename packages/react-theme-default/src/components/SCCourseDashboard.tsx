const Component = {
  styleOverrides: {
    root: ({theme}) => ({
      '& .SCCourseDashboard-header': {
        [theme.breakpoints.down('sm')]: {
          paddingLeft: '14px',
          paddingRight: '14px'
        },

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
        }
      },

      '& .SCCourseDashboard-info-wrapper': {
        gap: theme.spacing(2),
        marginBottom: theme.spacing(2),

        [theme.breakpoints.up('sm')]: {
          flexDirection: 'row',
          gap: '38px'
        },

        [theme.breakpoints.down('sm')]: {
          paddingLeft: '14px',
          paddingRight: '14px'
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
        padding: theme.spacing(3, 0, 0),

        [theme.breakpoints.down('md')]: {
          paddingLeft: '14px',
          paddingRight: '14px'
        }
      },

      '& .SCCourseDashboard-comments-container': {
        [theme.breakpoints.up('sm')]: {
          paddingLeft: '36px',
          paddingRight: '36px'
        },

        '& .SCCourseDashboard-outer-wrapper': {
          marginTop: '15px',
          marginBottom: '23px',

          '& .SCCourseDashboard-inner-wrapper': {
            gap: theme.spacing(3),
            marginTop: '23px',
            marginBottom: '30px',

            '& .SCCourseDashboard-user-wrapper': {
              flexDirection: 'row',
              gap: '6px',

              '& .SCCourseDashboard-avatar': {
                width: '30px',
                height: '30px'
              },

              '& .SCCourseDashboard-user-info': {
                flexDirection: 'row',
                alignItems: 'center',
                gap: '6px',

                '& .SCCourseDashboard-circle': {
                  width: '5px',
                  height: '5px',
                  borderRadius: '9999px',
                  backgroundColor: theme.palette.grey['600']
                }
              }
            },

            '& .SCCourseDashboard-button': {
              width: 'fit-content'
            }
          }
        }
      },

      '&.SCCourseDashboard-student-container': {
        '& .SCCourseDashboard-progress': {
          borderRadius: '28px',
          backgroundColor: theme.palette.grey['300']
        },

        '& .SCCourseDashboard-accordion': {
          borderTopLeftRadius: 'unset',
          borderTopRightRadius: 'unset'
        },

        '& .SCCourseDashboard-user-wrapper': {
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',

          '& .SCCourseDashboard-user': {
            flexDirection: 'row',
            gap: '4px',
            marginTop: '6px',
            marginBottom: '6px',

            '& .SCCourseDashboard-avatar': {
              width: '36px',
              height: '36px'
            }
          }
        },

        '& .SCCourseDashboard-lessons-sections': {
          flexDirection: 'row',
          alignItems: 'center',
          gap: '6px',
          border: `1px solid ${theme.palette.grey['300']}`,
          borderBottom: 'unset',
          borderTopLeftRadius: '5px',
          borderTopRightRadius: '5px',
          padding: '19px 24px',

          '& .SCCourseDashboard-circle': {
            width: '6px',
            height: '6px',
            borderRadius: 9999,
            backgroundColor: theme.palette.common.black
          }
        },

        '& .SCCourseDashboard-margin': {
          marginTop: '19px',
          marginBottom: '11px'
        },

        '& .SCCourseDashboard-box': {
          gap: '13px',
          border: `1px solid ${theme.palette.grey['300']}`,
          borderRadius: '5px',
          padding: '11px 24px'
        },

        '& .SCCourseDashboard-percentage-wrapper': {
          flexDirection: 'row',
          justifyContent: 'space-between'
        },

        '& .SCCourseDashboard-completed-wrapper': {
          flexDirection: 'row',
          alignItems: 'center',
          gap: '11px'
        }
      }
    }),
    skeletonRoot: () => ({})
  }
};

export default Component;
