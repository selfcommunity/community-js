const Component = {
  variants: [
    {
      props: {variant: 'outlined'},
      style: {
        borderWidth: 2
      }
    },
    {
      props: {variant: 'contained'},
      style: {}
    },
    {
      props: {variant: 'text'},
      style: {
        borderWidth: 0,
        borderRadius: 0
      }
    }
  ],
  styleOverrides: {
    root: ({theme}: any) => ({
      textTransform: 'initial',
      fontWeight: theme.typography.fontWeightRegular,
      padding: '.4em .6em',
      lineHeight: 1.2,
      borderRadius: 25
    }),
    sizeSmall: {
      fontSize: '0.875rem',
      padding: '6px 16px'
    },
    sizeMedium: {
      fontSize: '0.975',
      padding: '10px 24px'
    },
    sizeLarge: {
      fontSize: '1.286rem',
      padding: '10px 60px'
    }
  }
};

export default Component;
