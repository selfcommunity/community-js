const Component = {
  styleOverrides: {
    root: ({theme}: any) => ({
      [theme.breakpoints.up('md')]: {
        borderRadius: theme.shape.borderRadius
      },
      '& .SCOnBoardingWidget-step-content': {
        [theme.breakpoints.up('md')]: {
          width: '70%'
        },
        padding: theme.spacing(1, 2, 2, 2)
      },
      '& .SCOnBoardingWidget-logo': {
        width: 'auto'
      },
      '& .MuiCardContent-root': {
        '& .MuiList-root': {
          paddingTop: 0,
          borderRight: `1px solid ${theme.palette.grey[200]}`,
          '& .MuiListItem-root': {
            paddingBottom: 0
          }
        },
        [theme.breakpoints.up('md')]: {
          display: 'flex'
        },
        padding: 0,
        '& .SCOnBoardingWidget-steps-mobile': {
          width: '100%',
          display: 'flex',
          overflowX: 'auto',
          overflowY: 'hidden',
          '&::-webkit-scrollbar': {
            display: 'none'
          },
          '-webkit-overflow-scrolling': 'touch',
          '& .MuiButtonBase-root, .MuiListItem-root': {
            marginRight: theme.spacing(0.5),
            padding: 0,
            '& .MuiChip-root': {
              '&.MuiChip-filledDefault': {
                color: theme.palette.common.white,
                backgroundColor: theme.palette.common.black
              }
            }
          },
          padding: theme.spacing(2, 1, 2, 1)
        },
        '& .SCOnBoardingWidget-steps': {
          width: '30%',
          '& .Mui-selected': {
            backgroundColor: theme.palette.grey['A200']
          },
          '& .MuiButtonBase-root': {
            height: theme.spacing(5),
            '&:hover': {
              backgroundColor: theme.palette.grey['A200']
            },
            '& .MuiListItemIcon-root': {
              minWidth: 0
            }
          }
        }
      }
    }),
    accordionRoot: ({theme, expanded}: any) => ({
      boxShadow: 'none',
      '& .MuiAccordionDetails-root ': {
        padding: 0,
        '& .SCOnBoardingWidget-content': {
          '& .MuiCardContent-root': {
            padding: 0,
            '& .MuiList-root': {
              paddingTop: 0,
              paddingBottom: theme.spacing(1)
            },
            [theme.breakpoints.down('md')]: {
              '& .MuiListItem-root:first-of-type': {
                paddingTop: theme.spacing(1)
              }
            }
          }
        }
      },
      '& .MuiAccordionSummary-root': {
        borderBottom: `1px solid ${theme.palette.grey[200]}`,
        borderRadius: 0,
        [theme.breakpoints.up('md')]: {
          borderRadius: theme.shape.borderRadius,
          borderBottomLeftRadius: expanded ? 0 : theme.shape.borderRadius,
          borderBottomRightRadius: expanded ? 0 : theme.shape.borderRadius
        },
        '& .MuiAccordionSummary-content': {
          '& h4, & h5': {
            fontWeight: theme.typography.fontWeightBold
          },
          '& h4': {
            fontSize: '1.429rem',
            [theme.breakpoints.down('md')]: {
              marginLeft: theme.spacing(2),
              '& .MuiIcon-root': {
                position: 'absolute',
                left: theme.spacing(2)
              }
            }
          },
          '& h5': {
            fontSize: '1.143rem'
          },
          'p strong': {
            color: expanded ? theme.palette.secondary.main : 'inherit'
          },
          '& .SCOnBoardingWidget-intro': {
            marginLeft: theme.spacing(2),
            '& h5': {
              marginBottom: theme.spacing(0.5)
            }
          },
          [theme.breakpoints.down('md')]: {
            flexDirection: 'column',
            paddingLeft: expanded ? theme.spacing(2) : 0
          },
          '& .MuiTypography-body1': {
            display: expanded ? 'inherit' : 'flex',
            alignItems: 'center',
            fontSize: expanded ? '14px' : '16px',
            flexWrap: 'wrap',
            strong: {
              marginRight: expanded ? 'inherit' : theme.spacing(1),
              marginLeft: expanded ? 'inherit' : theme.spacing(1)
            },
            [theme.breakpoints.down('md')]: {
              justifyContent: 'center'
            }
          }
        },
        alignItems: 'flex-start',
        '& .MuiAccordionSummary-expandIconWrapper': {
          marginTop: theme.spacing(1.5),
          alignSelf: 'flex-start'
        }
      }
    }),
    skeletonRoot: ({theme}: any) => ({
      display: 'flex',
      flexDirection: 'column',
      [theme.breakpoints.up('md')]: {
        flexDirection: 'row'
      },
      '& .SCOnBoardingWidget-skeleton-content': {
        width: '100%',
        marginLeft: theme.spacing(1),
        [theme.breakpoints.down('md')]: {
          padding: theme.spacing(2)
        }
      },
      '& .SCOnBoardingWidget-skeleton-menu': {
        '& .MuiListItem-root': {
          padding: 0
        },
        [theme.breakpoints.up('md')]: {
          borderRight: `1px solid ${theme.palette.grey[200]}`
        }
      }
    }),
    contentRoot: ({theme}: any) => ({
      '& .SCOnBoardingWidget-content-title': {
        fontWeight: theme.typography.fontWeightBold
      },
      '& .SCOnBoardingWidget-content-summary': {
        whiteSpace: 'pre-line',
        marginTop: theme.spacing(1),
        marginBottom: theme.spacing(2)
      },
      '& .SCOnBoardingWidget-content-action': {
        display: 'flex',
        justifyContent: 'center'
      },
      '& .SCProgressBar-message': {
        marginBottom: theme.spacing(0.5)
      }
    }),
    categoryRoot: ({theme}: any) => ({
      '& .SCOnBoardingWidget-category-title': {
        fontWeight: theme.typography.fontWeightBold
      },
      '& .SCOnBoardingWidget-category-summary': {
        margin: theme.spacing(1, 0, 0.5, 0)
      },
      '& .SCOnBoardingWidget-category-action': {
        display: 'flex',
        justifyContent: 'center',
        marginTop: theme.spacing(5)
      },
      '& .SCProgressBar-message': {
        marginBottom: theme.spacing(0.5)
      }
    }),
    appearanceRoot: ({theme}: any) => ({
      display: 'flex',
      alignItems: 'center',
      flexDirection: 'column',
      '& .MuiButton-root': {
        marginTop: theme.spacing(4)
      },
      '& h4': {
        marginBottom: theme.spacing(1),
        fontWeight: theme.typography.fontWeightBold
      }
    }),
    appearanceDrawerRoot: ({theme}: any) => ({
      '& .MuiDrawer-paper': {
        width: '100%',
        [theme.breakpoints.up('sm')]: {
          width: 'fit-content',
          padding: theme.spacing(0, 2, 2, 2)
        }
      },
      '& .SCOnBoardingWidget-appearance-drawer-header': {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        '& h4': {
          fontWeight: theme.typography.fontWeightBold
        },
        padding: theme.spacing(1)
      },
      '& .MuiTabs-root': {
        [theme.breakpoints.down('md')]: {
          padding: theme.spacing(1)
        },
        marginBottom: theme.spacing(2),
        '& .MuiTab-root ': {
          textTransform: 'none'
        }
      },
      '& .SCOnBoardingWidget-appearance-drawer-content': {
        [theme.breakpoints.down('md')]: {
          padding: theme.spacing(1.5)
        },
        display: 'flex',
        flexDirection: 'column'
      },
      '& .SCOnBoardingWidget-appearance-color': {
        margin: theme.spacing(1, 0, 2, 0)
      },
      '& .SCOnBoardingWidget-appearance-logo-container': {
        position: 'relative',
        width: '100%',
        height: 'auto',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        '& .SCOnBoardingWidget-appearance-logo': {
          height: 120,
          width: 240,
          marginBottom: theme.spacing(2),
          objectFit: 'contain',
          '& img': {
            width: '100%',
            height: 'auto'
          }
        },
        '& .SCOnBoardingWidget-appearance-upload-button': {
          '& .MuiIcon-root': {
            fontSize: '1.143rem'
          }
        }
      }
    }),
    profileRoot: ({theme}: any) => ({
      display: 'flex',
      alignItems: 'center',
      flexDirection: 'column',
      '& .MuiButton-root': {
        marginTop: theme.spacing(4)
      },
      '& .SCOnBoardingWidget-profile-title': {
        fontWeight: theme.typography.fontWeightBold,
        marginBottom: theme.spacing(1)
      }
    }),
    profileDrawerRoot: ({theme}: any) => ({
      '& .MuiDrawer-paper': {
        width: '100%',
        [theme.breakpoints.up('sm')]: {
          width: '30%',
          padding: theme.spacing(0, 2, 2, 2)
        }
      },
      '& .SCOnBoardingWidget-profile-cover': {
        position: 'relative',
        height: 230,
        minHeight: 150,
        borderRadius: 0,
        background: 'linear-gradient(180deg, rgba(177,177,177,1) 0%, rgba(255,255,255,1) 90%)',
        boxShadow: 'unset',
        [theme.breakpoints.up('md')]: {
          borderRadius: theme.spacing(0, 0, 2.5, 2.5)
        }
      },
      '& .SCOnBoardingWidget-profile-icon': {
        alignSelf: 'end'
      },
      '& .SCOnBoardingWidget-profile-avatar': {
        top: 100,
        [theme.breakpoints.up('sm')]: {top: 150},
        display: 'block',
        position: 'absolute',
        marginLeft: theme.spacing(2),
        '& > .MuiBadge-root > img': {
          height: theme.selfcommunity.user.avatar.sizeXLarge,
          width: theme.selfcommunity.user.avatar.sizeXLarge,
          borderRadius: '50%',
          border: `#FFF solid ${theme.spacing(0.5)}`,
          objectFit: 'cover'
        },
        '& .MuiBadge-badge': {
          right: theme.spacing(1),
          top: theme.spacing(3),
          '& .SCUserAvatar-badge-content': {
            width: 32,
            height: 32
          }
        }
      },
      '& .SCOnBoardingWidget-profile-change-picture': {
        top: 140,
        [theme.breakpoints.up('sm')]: {top: 190},
        left: 80,
        position: 'relative',
        display: 'flex',
        marginLeft: theme.spacing(2)
      },
      '& .SCOnBoardingWidget-profile-change-cover': {
        position: 'absolute',
        right: 10,
        bottom: 10
      },
      '& .SCOnBoardingWidget-profile-public-info': {
        marginTop: theme.spacing(6),
        padding: theme.spacing(2),
        '& .SCUserProfileEdit-public-info-root': {
          display: 'flex',
          alignItems: 'center',
          flexDirection: 'column',
          '& .MuiButtonBase-root': {
            width: 'auto'
          }
        }
      }
    }),
    inviteRoot: ({theme}: any) => ({
      '& .MuiTypography-subtitle1': {
        marginLeft: theme.spacing(1.5)
      },
      '& .SCOnBoardingWidget-invite-title': {
        fontWeight: theme.typography.fontWeightBold
      },
      '& .SCOnBoardingWidget-invite-social': {
        margin: theme.spacing(2, 0, 2, 0),
        '& .SCOnBoardingWidget-invite-social-icon-container': {
          display: 'flex',
          justifyContent: 'center',
          marginTop: theme.spacing(2)
        },
        '& .SCOnBoardingWidget-invite-social-icon': {
          fontSize: '2rem',
          fontWeight: theme.typography.fontWeightBold
        },
        '& .SCOnBoardingWidget-invite-title': {
          fontSize: '14px'
        }
      },
      '& .SCOnBoardingWidget-invite-button': {
        marginTop: theme.spacing(8)
      },
      '& .SCOnBoardingWidget-invite-action': {
        display: 'flex',
        justifyContent: 'center',
        marginTop: theme.spacing(5)
      },
      '& .SCOnBoardingWidget-invite-email': {
        '& .SCOnBoardingWidget-invite-title': {
          fontSize: '14px'
        }
      }
    }),
    appRoot: ({theme}: any) => ({
      '& .SCOnBoardingWidget-app-title': {
        fontWeight: theme.typography.fontWeightBold
      },
      '& .SCOnBoardingWidget-app-summary': {
        whiteSpace: 'pre-line',
        margin: theme.spacing(2, 0, 2, 0)
      },
      '& .SCOnBoardingWidget-app-tabs': {
        padding: theme.spacing(0, 2, 0, 2),
        '& .MuiTab-root ': {
          textTransform: 'none'
        }
      },
      '& .SCOnBoardingWidget-app-tab-content': {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        '& .SCOnBoardingWidget-app-image': {
          width: 'auto'
        }
      },
      '& .SCOnBoardingWidget-app-step': {
        marginBottom: theme.spacing(2),
        display: 'flex',
        alignItems: 'center',
        strong: {
          display: 'flex',
          alignItems: 'center',
          marginRight: theme.spacing(0.5),
          '& .MuiIcon-root': {
            margin: theme.spacing(0, 0.5, 0, 0.5)
          }
        },
        flexWrap: 'wrap'
      }
    })
  }
};

export default Component;
