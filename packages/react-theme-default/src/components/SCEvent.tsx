const Component = {
  styleOverrides: {
    root: ({theme}: any) => ({}),
    detailRoot: ({theme}: any) => ({
      '& .SCEvent-detail-image-wrapper': {
        position: 'relative',
        '& .SCEvent-detail-image': {
          height: '170px'
        },
        '& .SCEvent-detail-in-progress': {
          backgroundColor: theme.palette.secondary.main,
          position: 'absolute',
          top: 10,
          right: 10,
          color: theme.palette.common.white,
          boxShadow: 'rgba(0, 0, 0, 0.16) 0px 3px 6px, rgba(0, 0, 0, 0.23) 0px 3px 6px'
        }
      },
      '& .SCEvent-detail-content': {
        padding: `52px ${theme.spacing(3)} 0 !important`,
        '& .SCEvent-detail-user': {
          marginTop: '14px',
          '& .SCBaseItemButton-text': {
            margin: 0
          }
        },
        '& .SCEvent-detail-name-wrapper': {
          textDecoration: 'none',
          color: 'inherit',
          '& .SCEvent-detail-name': {
            marginBottom: '10px'
          }
        },
        '& .SCEvent-detail-first-divider': {
          marginTop: '18px',
          marginBottom: theme.spacing()
        },
        '& .SCEvent-detail-second-divider': {
          marginTop: theme.spacing(),
          marginBottom: '18px'
        }
      }
    }),
    previewRoot: ({theme}: any) => ({
      '& .SCEvent-preview-image-wrapper': {
        position: 'relative',
        '& .SCEvent-preview-image': {
          height: '80px'
        },
        '& .SCEvent-preview-in-progress': {
          backgroundColor: theme.palette.secondary.main,
          position: 'absolute',
          top: 7,
          right: 7,
          color: theme.palette.common.white,
          boxShadow: 'rgba(0, 0, 0, 0.16) 0px 3px 6px, rgba(0, 0, 0, 0.23) 0px 3px 6px'
        }
      },
      '& .SCEvent-preview-content': {
        padding: `${theme.spacing()} !important`,
        '& .SCEventInfoDetails-icon-text-wrapper': {
          '& .MuiTypography-root': {
            fontSize: '0.8rem'
          }
        },
        '& .SCEvent-detail-user': {
          marginTop: '14px',
          '& .SCBaseItemButton-text': {
            margin: 0
          }
        },
        '& .SCEvent-preview-name-wrapper': {
          marginTop: 3,
          textDecoration: 'none',
          color: 'inherit',
          '& h5': {
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis'
          }
        }
      }
    }),
    snippetRoot: ({theme}: any) => ({
      overflow: 'visible',
      boxSizing: 'border-box',
      paddingLeft: `${theme.spacing()} !important`,
      paddingRight: `${theme.spacing()} !important`,
      '& .SCBaseItem-image': {
        '& .MuiAvatar-root': {
          width: 100,
          height: 60,
          '& img': {
            borderRadius: '5px'
          }
        }
      },
      '& .SCEvent-snippet-image': {
        position: 'relative',
        '& .SCEvent-snippet-in-progress': {
          height: 18,
          backgroundColor: theme.palette.secondary.main,
          position: 'absolute',
          top: 5,
          right: 3,
          color: theme.palette.common.white,
          boxShadow: 'rgba(0, 0, 0, 0.16) 0px 3px 6px, rgba(0, 0, 0, 0.23) 0px 3px 6px',
          '& span': {
            fontSize: '0.8rem',
            padding: theme.spacing()
          }
        }
      },
      '& .SCBaseItem-text': {
        fontSize: theme.typography.fontSize,
        '& .SCEvent-snippet-primary': {
          color: theme.palette.text.primary,
          textDecoration: 'none',
          '&:hover': {
            textDecoration: 'none'
          },
          '& p': {
            fontWeight: theme.typography.fontWeightBold
          }
        },
        '& .SCEvent-snippet-secondary': {
          color: theme.palette.text.secondary
        }
      }
    }),
    skeletonRoot: ({theme}: any) => ({
      '& .SCEvent-skeleton-detail-root': {
        '& .SCEvent-skeleton-detail-calendar': {
          position: 'absolute',
          bottom: '-36px',
          left: '24px',
          boxShadow: '0px 3px 8px #00000040'
        },
        '& .SCEvent-skeleton-detail-content': {
          padding: `52px ${theme.spacing(3)} 0 !important`,
          '& .SCEvent-skeleton-detail-user': {
            marginTop: '14px',
            '& .SCBaseItemButton-text': {
              margin: 0
            }
          },
          '& .SCEvent-skeleton-detail-name-wrapper': {
            textDecoration: 'none',
            color: 'inherit',
            '& .SCEvent-skeleton-detail-name': {
              marginBottom: '10px'
            }
          },
          '& .SCEvent-skeleton-detail-first-divider': {
            marginTop: '18px',
            marginBottom: theme.spacing()
          },
          '& .SCEvent-skeleton-detail-second-divider': {
            marginTop: theme.spacing(),
            marginBottom: '18px'
          }
        }
      },
      '& .SCEvent-skeleton-preview-root': {
        '& .SCEvent-skeleton-preview-content': {
          padding: theme.spacing()
        },
        '& .SCEvent-skeleton-preview-image': {
          position: 'relative',
          '& .MuiSkeleton-root': {
            borderRadius: '5px'
          },
          '& .MuiIcon-root': {
            color: theme.palette.common.white,
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)'
          }
        },
        '& .SCBaseItem-actions': {
          maxWidth: 'none !important'
        }
      },
      '& .SCEvent-skeleton-snippet-root': {
        overflow: 'visible',
        boxSizing: 'border-box',
        paddingLeft: `${theme.spacing()} !important`,
        paddingRight: `${theme.spacing()} !important`,
        '& .SCEvent-skeleton-snippet-image': {
          position: 'relative',
          '& .MuiSkeleton-root': {
            borderRadius: '5px'
          },
          '& .MuiIcon-root': {
            color: theme.palette.common.white,
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)'
          }
        },
        '& .SCBaseItem-actions': {
          maxWidth: 'none !important'
        }
      }
    })
  }
};

export default Component;
