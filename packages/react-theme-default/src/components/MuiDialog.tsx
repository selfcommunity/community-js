const Component = {
  styleOverrides: {
    root: {
      '& .MuiDialog-paperFullScreen': {
        display: 'inline-flex',
        flexDirection: 'column'
      },
      '& .MuiDialog-paperScrollBody': {
        overflowY: 'hidden'
      }
    }
  }
};

export default Component;
