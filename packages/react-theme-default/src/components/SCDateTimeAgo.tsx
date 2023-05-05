const Component = {
  styleOverrides: {
    root: ({theme}: any) => ({
      color: 'inherit',
      verticalAlign: 'middle',
      '& .MuiIcon-root': {
        fontSize: '1rem',
        marginRight: 2
      },
      '& .MuiTypography-root': {
        lineHeight: '1rem',
        fontSize: '0.857rem'
      }
    })
  }
};

export default Component;
