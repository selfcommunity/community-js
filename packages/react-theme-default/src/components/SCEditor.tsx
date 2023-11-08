import {alpha} from '@mui/system';

const Component = {
  styleOverrides: {
    root: ({theme}: any) => ({
      boxSizing: 'borderBox',
      padding: theme.spacing(1, 2),
      position: 'relative',
      cursor: 'text',
      '& .SCEditor-content': {
        position: 'relative',
        outline: 'none',
        minHeight: 40,
        paddingBottom: 20,
        '& > p': {
          margin: 0
        },
        '& img': {
          margin: 0
        },
        '& mention': {
          backgroundColor: alpha(theme.palette.primary.main, theme.palette.action.activatedOpacity)
        },
        '& hashtag': {
          backgroundColor: alpha(theme.palette.secondary.main, theme.palette.action.activatedOpacity)
        }
      },
      '& .SCEditor-placeholder': {
        position: 'absolute',
        top: theme.spacing(1),
        left: theme.spacing(2),
        color: theme.palette.text.disabled
      },
      '& .SCEditor-actions': {
        position: 'absolute',
        bottom: 0,
        right: theme.spacing(),
        color: theme.palette.text.primary,
        zIndex: 1,
        '& .MuiIcon-root': {
          fontSize: '1.143rem'
        }
      },
      '& .SCEditor-image': {
        position: 'relative',
        display: 'block',
        '& .selected': {
          border: `2px solid ${theme.palette.secondary.main}`
        }
      },
      '& hr': {
        cursor: 'pointer',
        margin: '1em 0',
        '&.selected': {
          outline: `2px solid ${theme.palette.secondary.main}`,
          userSelect: 'none'
        }
      },
      '& .SCEditor-ltr': {
        textAlign: 'left'
      },
      '& .SCEditor-rtl': {
        textAlign: 'right'
      },
      '& .SCEditor-paragraph': {
        margin: 0,
        position: 'relative'
      },
      '& .SCEditor-quote': {
        margin: 0,
        marginLeft: theme.spacing(2),
        marginBottom: theme.spacing(1),
        color: theme.palette.text.secondary,
        borderLeftColor: theme.palette.primary.main,
        borderLeftWidth: theme.spacing(0.25),
        borderLeftStyle: 'solid',
        paddingLeft: theme.spacing(2)
      },
      '& .SCEditor-h1': {
        fontSize: '1.429rem',
        color: theme.palette.text.primary,
        fontWeight: theme.typography.fontWeightBold,
        margin: theme.spacing(0, 0, 1, 0)
      },
      '& .SCEditor-h2': {
        fontSize: '1.143rem',
        color: theme.palette.text.primary,
        fontWeight: theme.typography.fontWeightBold,
        margin: theme.spacing(0, 0, 0.8, 0)
      },
      '& .SCEditor-h3': {
        fontSize: '1rem',
        color: theme.palette.text.primary,
        fontWeight: theme.typography.fontWeightBold,
        margin: theme.spacing(0, 0, 0.5, 0)
      },
      '& .SCEditor-textBold': {
        fontWeight: 'bold'
      },
      '& .SCEditor-textItalic': {
        fontStyle: 'italic'
      },
      '& .SCEditor-textUnderline': {
        textDecoration: 'underline'
      },
      '& .SCEditor-textStrikethrough': {
        textDecoration: 'line-through'
      },
      '& .SCEditor-textUnderlineStrikethrough': {
        textDecoration: 'underline line-through'
      },
      '& .SCEditor-textSubscript': {
        fontSize: '0.8em',
        verticalAlign: 'sub !important'
      },
      '& .SCEditor-textSuperscript': {
        fontSize: '0.8em',
        verticalAlign: 'super'
      },
      '& .SCEditor-link': {
        color: theme.palette.text.secondary,
        textDecoration: 'underline'
      },
      '& .SCEditor-link:hover': {
        textDecoration: 'none',
        cursor: 'pointer'
      },
      '& .SCEditor-ol1': {
        padding: 0,
        margin: 0
      },
      '& .SCEditor-ol2': {
        padding: 0,
        margin: 0,
        listStyleType: 'upper-alpha'
      },
      '& .SCEditor-ol3': {
        padding: 0,
        margin: 0,
        listStyleType: 'lower-alpha'
      },
      '& .SCEditor-ol4': {
        padding: 0,
        margin: 0,
        listStyleType: 'upper-roman'
      },
      '& .SCEditor-ol5': {
        padding: 0,
        margin: 0,
        listStyleType: 'lower-roman'
      },
      '& .SCEditor-ul': {
        padding: 0,
        margin: 0
      },
      '& .SCEditor-listItem': {
        margin: '0 32px'
      }
    }),
    toolbar: ({theme}: any) => ({
      '& .SCEditor-placeholder': {
        top: theme.spacing(7),
        left: theme.spacing(2)
      }
    }),
    skeletonRoot: ({theme}: any) => ({}),
    emojiPluginRoot: ({theme}: any) => ({}),
    floatingLinkPluginRoot: ({theme}: any) => ({
      zIndex: 2000,
      '& .MuiPaper-root': {
        borderRadius: 5
      }
    }),
    hashtagPluginRoot: ({theme}: any) => ({
      position: 'absolute',
      background: theme.palette.background.paper,
      boxShadow: '0px 5px 10px rgba(0, 0, 0, 0.3)',
      borderRadius: 8,
      marginLeft: 7,
      marginTop: 18,
      zIndex: 3000,
      '& ul': {
        padding: 0,
        listStyle: 'none',
        margin: 0,
        borderRadius: 10,
        '& li': {
          padding: theme.spacing(1),
          margin: 0,
          minWidth: 180,
          fontSize: theme.typography.body2.fontSize,
          outline: 'none',
          cursor: 'pointer',
          display: 'flex',
          flexDirection: 'row',
          justifyContent: 'left',
          alignItems: 'center',
          '&.selected': {
            background: theme.palette.action.selected
          },
          '&.hovered': {
            background: theme.palette.action.hover
          },
          '& .MuiAvatar-root': {
            width: 20,
            height: 20,
            marginRight: theme.spacing()
          }
        }
      }
    }),
    imagePluginRoot: ({theme}: any) => ({}),
    mentionPluginRoot: ({theme}: any) => ({
      position: 'absolute',
      background: theme.palette.background.paper,
      boxShadow: '0px 5px 10px rgba(0, 0, 0, 0.3)',
      borderRadius: 8,
      marginLeft: 7,
      marginTop: 18,
      zIndex: 3000,
      '& ul': {
        padding: 0,
        listStyle: 'none',
        margin: 0,
        borderRadius: 10,
        '& li': {
          padding: theme.spacing(1),
          margin: 0,
          minWidth: 180,
          fontSize: theme.typography.body2.fontSize,
          outline: 'none',
          cursor: 'pointer',
          display: 'flex',
          flexDirection: 'row',
          justifyContent: 'left',
          alignItems: 'center',
          '&.selected': {
            background: theme.palette.action.selected
          },
          '&.hovered': {
            background: theme.palette.action.hover
          },
          '& .MuiAvatar-root': {
            width: 20,
            height: 20,
            marginRight: theme.spacing()
          }
        }
      }
    }),
    toolbarPluginRoot: ({theme}: any) => ({
      borderRadius: theme.shape.borderRadius * 0.2,
      borderColor: alpha(theme.palette.primary.main, theme.palette.action.activatedOpacity),
      borderWidth: 1,
      borderStyle: 'solid',
      display: 'flex',
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'left',
      marginBottom: theme.spacing(1),
      padding: 0,
      overflowX: 'scroll',
      MsOverflowStyle: 'none',
      scrollbarWidth: 'none',
      '&::-webkit-scrollbar': {
        display: 'none'
      },
      '& .MuiTextField-root': {
        minWidth: 100,
        margin: theme.spacing(0, 0.5)
      },
      '& .MuiButtonBase-root': {
        margin: theme.spacing(0.5),
        padding: theme.spacing(1),
        fontSize: '1rem',
        border: 0,
        borderRadius: theme.shape.borderRadius * 0.2,
        '&.Mui-disabled': {
          border: 0
        },
        '&.MuiToggleButtonGroup-grouped:not(:last-of-type)': {
          borderTopRightRadius: theme.shape.borderRadius * 0.2,
          borderBottomRightRadius: theme.shape.borderRadius * 0.2
        },
        '&.MuiToggleButtonGroup-grouped:not(:first-of-type)': {
          borderTopRightRadius: theme.shape.borderRadius * 0.2,
          borderBottomRightRadius: theme.shape.borderRadius * 0.2,
          borderTopLeftRadius: theme.shape.borderRadius * 0.2,
          borderBottomLeftRadius: theme.shape.borderRadius * 0.2
        }
      },
      '& .SCEditor-block-format .MuiIcon-root:first-of-type': {
        display: 'inline-block',
        marginRight: theme.spacing(1)
      }
    })
  }
};

export default Component;
