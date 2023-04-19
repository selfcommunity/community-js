import {alpha} from '@mui/system';

const Component = {
  styleOverrides: {
    root: ({theme}: any) => ({
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
      '& .SCEditorToolbarPlugin-block-format .MuiIcon-root:first-of-type': {
        display: 'inline-block',
        marginRight: theme.spacing(1)
      }
    })
  }
};

export default Component;
