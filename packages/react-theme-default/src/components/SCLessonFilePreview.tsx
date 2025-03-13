const Component = {
  styleOverrides: {
    root: ({theme}: any) => ({
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      position: 'relative',
      borderRadius: theme.shape.borderRadius * 0.5,
      margin: theme.spacing(0.5),
      width: '100%',
      height: '60px',
      flexBasis: 120,
      flexGrow: 0,
      flexShrink: 0,
      '& .SCLessonFilePreview-title': {
        position: 'absolute',
        left: theme.spacing(1),
        top: theme.spacing(1),
        borderRadius: theme.shape.borderRadius,
        background: '#33333380 0% 0% no-repeat padding-box',
        color: theme.palette.common.white,
        fontSize: '0.875rem',
        padding: theme.spacing(0.5, 1),
        maxWidth: 80,
        textOverflow: 'ellipsis',
        overflow: 'hidden',
        whiteSpace: 'nowrap'
      }
    })
  }
};

export default Component;
