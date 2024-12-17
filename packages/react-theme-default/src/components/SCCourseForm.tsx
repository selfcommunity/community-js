import {alpha} from '@mui/system';

const Component = {
  styleOverrides: {
    root: ({theme}: any) => ({
      '& .SCCourseForm-cover': {
        position: 'relative',
        height: 103,
        minHeight: 103,
        '& .SCCourseForm-upload-course-cover-root': {
          position: 'absolute',
          right: theme.spacing(2),
          bottom: theme.spacing(1),
          padding: theme.spacing(1),
          minWidth: 'auto'
        }
      },
      '& .SCCourseForm-header': {
        marginTop: theme.spacing(4.5),
        color: theme.palette.text.secondary
      },
      '& .SCCourseForm-form': {
        '& h5': {
          padding: theme.spacing(1)
        },
        '& .SCCourseForm-date-time': {
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: theme.spacing(1),
          marginTop: theme.spacing(2),
          marginBottom: theme.spacing(1.5),
          '& .MuiInputBase-root': {
            paddingLeft: theme.spacing(0.5)
          }
        },
        '& .SCCourseForm-edit-root': {
          marginTop: theme.spacing(1),
          '& .SCCourseForm-edit-card': {
            display: 'flex',
            alignItems: 'flex-start',
            borderRadius: '10px',
            padding: theme.spacing(2),
            '& h5': {
              paddingTop: 0,
              paddingBottom: 0
            },
            '& .MuiTypography-body1': {
              paddingLeft: theme.spacing(1)
            },
            '& .SCCourseForm-edit-access-info': {
              marginTop: theme.spacing(2),
              marginBottom: theme.spacing(2),
              '& > p:first-of-type': {
                marginBottom: theme.spacing(1)
              },
              '& .MuiIcon-root': {
                marginRight: theme.spacing(1)
              }
            }
          },
          '& .SCCourseForm-edit-publish': {
            marginTop: theme.spacing(3),
            '& h5': {
              paddingTop: 0,
              paddingBottom: 0
            },
            '& .SCCourseForm-edit-publish-info': {
              paddingLeft: theme.spacing(1),
              marginBottom: theme.spacing(1)
            },
            '& .SCCourseForm-edit-privacy-item': {
              paddingLeft: theme.spacing(1.5),
              marginBottom: theme.spacing(2),
              '& .MuiTypography-body1': {
                display: 'flex',
                alignItems: 'center',
                '& .MuiIcon-root': {
                  marginRight: theme.spacing(0.5)
                }
              }
            }
          }
        }
      },
      '& .SCCourseForm-step-one': {
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        gap: theme.spacing(2.5),
        marginTop: theme.spacing(1.5),
        '& .MuiCard-root': {
          boxShadow: 'none',
          border: `1px solid ${theme.palette.grey[300]}`,
          borderRadius: '10px',
          '& .MuiCardContent-root': {
            '& .MuiTypography-h5': {
              fontWeight: theme.typography.fontWeightBold
            },
            '& .MuiTypography-body2': {
              whiteSpace: 'pre-line'
            }
          }
        }
      },
      '& .SCCourseForm-error': {
        color: theme.palette.error.main
      },
      '& .SCCourseForm-actions': {
        marginTop: theme.spacing(2),
        display: 'flex',
        justifyContent: 'flex-end',
        gap: theme.spacing(2),
        '& button': {
          width: 'fit-content'
        }
      },
      '& .MuiDivider-root': {
        marginTop: theme.spacing(2),
        border: `1px solid ${alpha(theme.palette.primary.main, theme.palette.action.activatedOpacity)}`
      },
      '& .MuiDialogTitle-root': {
        '& span': {
          flexGrow: 1,
          textAlign: 'center'
        }
      }
    })
  }
};

export default Component;
