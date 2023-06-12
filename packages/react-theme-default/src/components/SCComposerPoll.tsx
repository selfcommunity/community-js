const Component = {
  styleOverrides: {
    root: ({theme}: any) => ({
      '& .SCComposerPoll-title': {
        marginBottom: theme.spacing(4)
      },
      '& .SCComposerPoll-choices': {
        marginBottom: 0,
        '& .MuiTextField-root .MuiInputAdornment-positionStart': {
          cursor: 'grab'
        }
      },
      '& .SCComposerPoll-choice-new': {
        color: theme.palette.secondary.main,
        marginLeft: theme.spacing(-3)
      },
      '& .SCComposerPoll-metadata': {
        margin: theme.spacing(2, 0),
        '& .MuiFormControlLabel-root': {
          marginBottom: theme.spacing(2)
        }
      }
    })
  }
};

export default Component;
