const Component = {
  defaultProps: {
    // Replace the `material-icons` default value.
    baseClassName: 'community-icons'
  },
  styleOverrides: {
    root: ({theme}: any) => ({
      fontSize: 'inherit'
    })
  }
};

export default Component;
