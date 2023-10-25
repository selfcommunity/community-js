import {alpha} from '@mui/system';

const Component = {
  styleOverrides: {
    root: ({theme}: any) => ({
      width: '100%',
      '& .SCFeedObject-title-section': {
        '& a': {
          textDecoration: 'none'
        },
        '& a:hover': {
          textDecoration: 'underline'
        }
      },
      '& .SCFeedObject-username': {
        textDecoration: 'none',
        color: theme.palette.text.primary
      },
      '& .SCFeedObject-avatar': {
        width: theme.selfcommunity.user.avatar.sizeMedium,
        height: theme.selfcommunity.user.avatar.sizeMedium
      },
      '& .SCFeedObject-header': {
        paddingTop: theme.spacing(1),
        paddingBottom: 0,
        '& .MuiCardHeader-subheader': {
          display: 'flex',
          alignItems: 'center'
        }
      },
      '& .SCFeedObject-category': {
        color: theme.palette.primary.main,
        textAlign: 'center',
        borderBottom: '1px solid rgba(0, 0, 0, 0.12)',
        maxHeight: 30,
        display: 'flex',
        flexDirection: 'row',
        overflowY: 'hidden',
        overflowX: 'auto',
        justifyContent: 'center',
        'MsOverflowStyle': 'none',  /* IE and Edge */
        scrollbarWidth: 'none',  /* Firefox */
        '&::-webkit-scrollbar': {
          display: 'none'
        },
        '& a': {
          color: 'inherit',
          textDecoration: 'none',
          '&::after': {
            content: '"\\2022"',
            padding: theme.spacing()
          },
          '&:last-child::after': {
            display: 'none'
          },
          '&:hover': {
            color: theme.palette.secondary.main
          },
          '& span': {
            textTransform: 'initial',
            fontWeight: theme.typography.fontWeightBold
          }
        }
      },
      '& .SCFeedObject-content': {
        padding: theme.spacing(1, 0, 0, 0),
        '&.SCFeedObject-error': {
          padding: theme.spacing(2),
          textAlign: 'center'
        }
      },
      '& .SCFeedObject-snippet': {
        '& > div': {
          alignItems: 'flex-start'
        },
        '& .SCBaseItem-text': {
          marginTop: 0
        }
      },
      '& .SCFeedObject-snippet-content a': {
        textDecoration: 'none',
        color: theme.palette.text.secondary
      },
      '& .SCFeedObject-tag': {
        display: 'inline-flex'
      },
      '& .SCFeedObject-location': {
        display: 'inline-flex'
      },
      '& .SCFeedObject-actions-section': {
        padding: 0,
        display: 'flex',
        flexDirection: 'column'
      },
      '& .SCFeedObject-reply-content': {
        width: '100%',
        boxSizing: 'border-box',
        margin: 0,
        padding: theme.spacing(0.2, 2)
      },
      '& .SCFeedObject-info-section': {
        padding: theme.spacing(0, 2)
      },
      '& .SCFeedObject-activity-at': {
        textDecoration: 'none',
        color: 'inherit',
        marginTop: 0
      },
      '& .SCFeedObject-deleted': {
        opacity: 0.3,
        '&:hover': {
          opacity: 1
        }
      },
      '&.SCFeedObject-preview, &.SCFeedObject-detail, &.SCFeedObject-search, &.SCFeedObject-share': {
        border: `0 none`,
        boxShadow: '0px 0px 10px rgba(0, 0, 0, 0.1)',
        borderRadius: 0,
        [theme.breakpoints.up('sm')]: {
          borderRadius: theme.shape.borderRadius
        },
        '& .SCFeedObject-category': {
          borderBottom: '1px solid rgba(221, 221, 221, 1)',
          margin: theme.spacing(0, 2)
        },
        '& .SCFeedObject-header': {
          '& .MuiCardHeader-avatar': {
            marginRight: theme.spacing(1.5),
            '.MuiBadge-badge': {
              right: theme.spacing(0.25)
            }
          },
          '& .SCFeedObject-username': {
            fontWeight: theme.typography.fontWeightBold
          },
          '& .MuiCardHeader-subheader': {
            fontSize: '0.857rem',
            color: theme.palette.primary.main,
            '& .SCFeedObject-activity-at': {
              display: 'inline-flex',
              '&:hover': {
                color: 'inherit',
                textDecoration: 'underline'
              }
            },
            '& .SCFeedObject-tag, & .SCFeedObject-location': {
              '& .MuiIcon-root': {
                fontSize: '1rem',
                color: 'inherit'
              }
            }
          }
        },
        '& .SCFeedObject-content': {
          '& .SCFeedObject-title-section': {
            '& .SCFeedObject-title': {
              fontWeight: theme.typography.fontWeightBold,
              marginBottom: theme.spacing(1),
              padding: theme.spacing(0, 2)
            },
            '& a': {
              color: 'inherit'
            }
          },
          '& .SCFeedObject-text-section': {
            overflowWrap: 'anywhere',
            '& > :first-of-type': {
              marginBottom: 0,
              padding: theme.spacing(0, 2, 0.5),
              display: 'block'
            },
            '& hr': {
              margin: '1em 0'
            },
            '& a': {
              color: theme.palette.text.secondary,
              textDecoration: 'underline',
              '&:hover': {
                textDecoration: 'none',
                cursor: 'pointer'
              }
            },
            '& img': {
              maxWidth: '100%'
            },
            '& blockquote': {
              margin: 0,
              marginLeft: theme.spacing(2),
              marginBottom: theme.spacing(1),
              color: theme.palette.text.secondary,
              borderLeftColor: theme.palette.primary.main,
              borderLeftWidth: theme.spacing(0.25),
              borderLeftStyle: 'solid',
              paddingLeft: theme.spacing(2)
            },
            '& h1': {
              fontSize: '1.429rem',
              color: theme.palette.text.primary,
              fontWeight: theme.typography.fontWeightBold,
              margin: theme.spacing(0, 0, 1, 0)
            },
            '& h2': {
              fontSize: '1.143rem',
              color: theme.palette.text.primary,
              fontWeight: theme.typography.fontWeightBold,
              margin: theme.spacing(0, 0, 0.8, 0)
            },
            '& h3': {
              fontSize: '1rem',
              color: theme.palette.text.primary,
              fontWeight: theme.typography.fontWeightBold,
              margin: theme.spacing(0, 0, 0.5, 0)
            },
            '& p': {
              margin: 0
            },
            '& b': {
              fontWeight: 'bold'
            },
            '& i': {
              fontStyle: 'italic'
            },
            '& u': {
              textDecoration: 'underline'
            },
            '& s': {
              textDecoration: 'line-through'
            },
            '& sub': {
              fontSize: '0.8em',
              verticalAlign: 'sub !important'
            },
            '& sup': {
              fontSize: '0.8em',
              verticalAlign: 'super'
            },
            '& ol': {
              padding: 0,
              margin: 0
            },
            '& ol ol': {
              padding: 0,
              margin: 0,
              listStyleType: 'upper-alpha'
            },
            '& ol ol ol': {
              padding: 0,
              margin: 0,
              listStyleType: 'lower-alpha'
            },
            '& ol ol ol ol': {
              padding: 0,
              margin: 0,
              listStyleType: 'upper-roman'
            },
            '& ol ol ol ol ol': {
              padding: 0,
              margin: 0,
              listStyleType: 'lower-roman'
            },
            '& ul': {
              padding: 0,
              margin: 0
            },
            '& li': {
              margin: '0 32px'
            }
          },
          '& .SCFeedObject-medias-section': {
            '& .SCFeedObjectMediaPreview-root': {
              margin: theme.spacing(0, 1)
            }
          },
          '& .SCFeedObject-show-more': {
            padding: theme.spacing(0.5),
            marginTop: theme.spacing(-0.5)
          }
        },
        '& .SCFeedObject-actions-section': {
          '&:last-of-type': {
            marginBottom: 0
          },
          '& .SCFeedObjectActions-root': {
            margin: 0,
            padding: theme.spacing(0.2, 2, 0, 2),
            '& .SCFeedObjectActions-action': {
              marginTop: 0,
              '& .SCVoteAction-view-audience-button, & .SCCommentAction-view-audience-button, & .SCShareAction-view-audience-button, & .SCReactionAction-view-audience-button':
                {
                  fontSize: '0.857rem',
                  fontWeight: theme.typography.fontWeightRegular,
                  marginTop: theme.spacing(0),
                  marginBottom: 0,
                  color: theme.palette.primary.main,
                  '&:hover': {
                    color: 'inherit'
                  }
                },
              '& .MuiDivider-root': {
                borderColor: theme.palette.grey[300]
              },
              '& .SCVoteAction-button, & .SCCommentAction-button, & .SCShareAction-button, & .SCReactionAction-button': {
                color: theme.palette.primary.main,
                marginTop: theme.spacing(-0.5),
                marginBottom: theme.spacing(0.5),
                borderRadius: '50%',
                padding: theme.spacing(1),
                minWidth: 0,
                '& .MuiIcon-root': {
                  fontSize: '1.57rem'
                },
                '& > img': {
                  width: '1.57rem',
                  height: '1.57rem'
                }
              }
            }
          },
          '& .SCFeedObject-reply-content': {
            marginLeft: 0,
            background: alpha(theme.palette.primary.main, theme.palette.action.hoverOpacity),
            '& .SCCommentObjectReply-root': {
              background: 'transparent',
              marginBottom: 0,
              '& .SCCommentObjectReply-comment': {
                background: 'transparent',
                border: '0 none',
                '& .SCEditor-root': {
                  '& .SCEditor-placeholder': {
                    fontWeight: theme.typography.fontWeightMedium
                  },
                  '& .SCEditor-content': {
                    paddingBottom: 0,
                    minHeight: 0
                  },
                  '& .SCEditor-actions': {
                    bottom: 0
                  }
                },
                '&.SCCommentObjectReply-has-value .SCEditor-root .SCEditor-actions': {
                  bottom: theme.spacing(-4)
                }
              }
            }
          }
        },
        '& .SCFeedObject-activities-section': {
          '& .SCFeedObject-activities-content': {
            paddingTop: 0,
            paddingBottom: 0,
            '& .SCActivitiesMenu-selector': {
              '& .MuiButton-root': {
                marginTop: theme.spacing(0.2),
                fontSize: '0.857rem',
                fontWeight: theme.typography.fontWeightRegular,
                padding: theme.spacing(1)
              }
            },
            '& .SCCommentObject-root': {
              marginTop: 0,
              marginBottom: 0,
              paddingTop: 0,
              paddingBottom: 0
            }
          },
          '& .SCCommentObjectSkeleton-root': {
            background: 'transparent',
            marginTop: 5,
            marginBottom: '7px !important',
            '& .SCBaseItem-text': {
              '& .SCWidget-root': {
                '& .MuiCardContent-root': {
                  padding: theme.spacing()
                }
              }
            }
          },
          '& .SCCommentObjectReply-root': {
            '& .SCCommentObjectReply-comment': {
              marginBottom: '0 !important',
              border: `1px solid ${theme.palette.grey[300]}`,
              '& .SCEditor-root': {
                minHeight: theme.spacing(4),
                marginTop: 0,
                '& .SCEditor-content': {
                  minHeight: 0
                },
                '& .SCEditor-actions': {
                  bottom: theme.spacing(-4)
                }
              }
            }
          }
        }
      },
      '&.SCFeedObject-snippet': {
        '& .SCFeedObject-username': {
          fontSize: '1rem',
          fontWeight: theme.typography.fontWeightBold,
          display: 'block',
          marginBottom: theme.spacing(1)
        },
        '& .SCFeedObject-snippet-content': {
          fontSize: '1rem',
          marginBottom: theme.spacing(1)
        },
        '& .SCFeedObject-activity-at': {
          display: 'inline-flex',
          '&:hover': {
            color: 'inherit',
            textDecoration: 'underline'
          }
        }
      },
      '&.SCFeedObject-detail .SCFeedObject-reply-content': {
        borderBottom: '0 none'
      },
      '&.SCFeedObject-share': {
        boxShadow: 'none',
        border: '1px solid rgba(0, 0, 0, 0.12)'
      }
    })
  }
};

export default Component;
