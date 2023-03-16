const Component = {
  styleOverrides: {
    root: ({theme}: any) => ({
      '& .SCUserCounters-button': {
        color: theme.palette.text.primary,
        padding: theme.spacing(0.5),
        borderRadius: theme.shape.borderRadius / 3,
        fontSize: '1.143rem',
        fontWeight: theme.typography.fontWeightMedium,
        '& strong': {
          display: 'inline-block',
          marginRight: theme.spacing(1),
          fontWeight: theme.typography.fontWeightBold
        },
        '&:hover, &:active': {
          color: theme.palette.secondary.main
        }
      }
    })
  }
};

export default Component;
