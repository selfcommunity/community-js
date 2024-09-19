const Component = {
  styleOverrides: {
    root: ({theme}: any) => ({}),
    detailRoot: ({theme}: any) => ({
      '& .SCEvent-detail-image-wrapper': {
        position: 'relative',
        '& .SCEvent-detail-image': {
          height: '170px'
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
        }
      },
      '& .SCEvent-preview-content': {
        padding: `${theme.spacing()} !important`,
        '& .SCEventInfoDetails-icon-text-wrapper': {
          '& .MuiTypography-root': {
            fontSize: '0.75rem'
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
