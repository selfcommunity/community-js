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
        '& .focused': {
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
    })
  }
};

export default Component;
