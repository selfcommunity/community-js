const Component = {
  styleOverrides: {
    root: ({theme}: any) => ({
      '& .SCPreviewMediaImage-title': {
        position: 'absolute',
        top: theme.spacing(3),
        left: theme.spacing(3),
        '& > h6': {
          padding: theme.spacing(1, 2),
          borderRadius: theme.shape.borderRadius,
          maxWidth: 220,
          textOverflow: 'ellipsis',
          whiteSpace: 'nowrap',
          overflow: 'hidden'
        }
      }
    })
  }
};

export default Component;
