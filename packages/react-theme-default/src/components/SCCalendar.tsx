const Component = {
  styleOverrides: {
    root: ({ theme }) => ({
      gap: '7px',
      position: 'absolute',
      bottom: '-36px',
      left: '24px',
      width: '60px',
      height: '60px',
      borderRadius: '5px',
      boxShadow: '0px 3px 8px #00000040',
      backgroundColor: theme.palette.common.white,
      overflow: 'hidden',

      '& .SCCalendar-header': {
        width: '100%',
        height: '16px',
        backgroundColor: theme.palette.error.dark
      }
    })
  }
};

export default Component;
