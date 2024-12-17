const Component = {
  styleOverrides: {
    root: ({theme}: any) => ({
      '& .SCCourses-filters': {
        alignItems: 'center',
        marginTop: theme.spacing(),
        marginBottom: theme.spacing(2),
        '& .SCCourses-search': {
          '& .MuiInputBase-root': {
            paddingRight: 0,
            '& .MuiButtonBase-root': {
              borderRadius: '0 5px 5px 0',
              height: '37px',
              '& .MuiButton-endIcon': {
                margin: 0
              }
            }
          }
        },
        '& .SCCourses-category': {
          //height: theme.spacing(5.25),
          borderRadius: theme.spacing(0.5),
          '& .MuiTextField-root': {
            marginTop: '2px'
          }
        }
      },
      '& .SCCourses-courses': {
        marginTop: theme.spacing(2),

        [theme.breakpoints.down('md')]: {
          marginBottom: theme.spacing(7)
        },

        '& .SCCourses-item': {
          paddingTop: theme.spacing(2)
        },

        '& .SCCourses-item-placeholder': {
          paddingTop: theme.spacing(2)
        },
        '& .SCBaseItem-root': {
          display: 'flex',
          justifyContent: 'space-between'
        },
        '& .SCCourse-skeleton-preview-name': {
          marginTop: 6,
          marginBottom: 6
        },
        '& .SCCourse-skeleton-snippet .SCBaseItem-content': {
          maxWidth: '70%'
        }
      },
      '& .SCCourses-no-results': {
        marginTop: theme.spacing(5),
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        '& .SCCourses-student-view': {
          marginTop: theme.spacing(3),
          width: '100%',
          '& .MuiIcon-root': {
            textAlign: 'center',
            fontSize: theme.spacing(8),
            color: '#B4B4B4',
            marginBottom: theme.spacing(3),
            width: '100%'
          },
          '& h5': {
            fontWeight: theme.typography.fontWeightBold,
            marginBottom: theme.spacing(0.5)
          },
          '& .SCCourses-skeleton-item': {
            minWidth: '250px',
            [theme.breakpoints.down('md')]: {
              width: '100%'
            }
          }
        },
        '& .SCCourses-teacher-view': {
          width: '100%',
          '& .SCCourses-skeleton-item': {
            minWidth: '250px',
            [theme.breakpoints.down('md')]: {
              width: '100%'
            },
            '& .SCCourse-placeholder-root': {
              height: '250px'
            }
          }
        }
      },
      '& .SCCourses-show-more': {
        paddingLeft: theme.spacing(1),
        '&.Mui-selected, &:hover': {
          backgroundColor: 'transparent'
        }
      }
    }),
    skeletonRoot: ({theme}: any) => ({
      '& .SCCourses-skeleton-courses': {
        justifyContent: 'center',
        marginTop: theme.spacing(2),
        '& .SCCourses-skeleton-item': {
          paddingTop: theme.spacing(2)
        }
      }
    }),
    coursesChipRoot: ({theme, showForMe}: any) => ({
      height: theme.spacing(5.25),
      borderRadius: theme.spacing(0.5),
      color: showForMe ? theme.palette.common.white : theme.palette.text.primary,
      '& .MuiIcon-root': {
        fontSize: '1rem',
        color: theme.palette.common.white
      }
    })
  }
};

export default Component;
