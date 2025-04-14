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
          borderRadius: theme.spacing(0.5),
          minWidth: '213px',
          '& .MuiTextField-root': {
            margin: 0,
            '& .MuiInputBase-root': {
              padding: theme.spacing(1, 2, 1, 2)
            }
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
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        '& .SCCourses-student-empty-view': {
          alignItems: 'center',
          justifyContent: 'center',
          gap: '10px',
          padding: theme.spacing(3),
          marginTop: '9px',
          '& h5': {
            fontWeight: theme.typography.fontWeightBold,
            marginBottom: theme.spacing(0.5)
          },
          '& .SCCourses-skeleton-item': {
            minWidth: '250px',
            [theme.breakpoints.down('md')]: {
              width: '100%'
            }
          },
          '& .SCCourses-empty-box': {
            width: '130px',
            height: '130px',
            border: `2px solid ${theme.palette.grey[300]}`,
            borderRadius: '20px',
            marginBottom: '10px',

            '& .SCCourses-empty-rotated-box': {
              width: 'inherit',
              height: 'inherit',
              border: 'inherit',
              borderRadius: 'inherit',
              transform: 'rotate(-25deg)',
              alignItems: 'center',
              justifyContent: 'center',

              '& .SCCourses-empty-icon': {
                transform: 'rotate(25deg)',
                fontSize: theme.spacing(8),
                color: theme.palette.grey[400]
              }
            }
          }
        },
        '& .SCCourses-teacher-empty-view': {
          width: '100%',
          '& .SCCourses-skeleton-item': {
            minWidth: '250px',
            [theme.breakpoints.down('md')]: {
              width: '100%'
            }
          }
        }
      },
      '& .SCCourses-end-message': {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        '& .MuiButtonBase-root': {
          paddingLeft: theme.spacing(1),
          '&.Mui-selected, &:hover': {
            backgroundColor: 'transparent'
          }
        }
      }
    }),
    skeletonRoot: ({theme}: any) => ({
      '& .SCCourses-skeleton-courses': {
        marginTop: theme.spacing(2),
        '& .SCCourses-skeleton-item': {
          paddingTop: theme.spacing(2)
        }
      }
    }),
    coursesChipRoot: ({theme, showMine, showManagedCourses}: any) => ({
      height: theme.spacing(5.25),
      borderRadius: theme.spacing(0.5),
      color: showMine || showManagedCourses ? theme.palette.common.white : theme.palette.text.primary,
      '& .MuiIcon-root': {
        fontSize: '1rem',
        color: theme.palette.common.white
      }
    })
  }
};

export default Component;
