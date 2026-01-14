const Component = {
  styleOverrides: {
    root: ({theme}) => ({
      alignItems: 'center',
      justifyContent: 'center',
      gap: '10px',
      padding: theme.spacing(3),
      marginTop: '9px',
      backgroundColor: theme.palette.common.white,

      '& .SCEmptyStatus-box': {
        width: '130px',
        height: '130px',
        border: `2px solid ${theme.palette.grey[300]}`,
        borderRadius: '20px',
        marginBottom: '10px',

        '& .SCEmptyStatus-rotated-box': {
          width: 'inherit',
          height: 'inherit',
          border: 'inherit',
          borderRadius: 'inherit',
          transform: 'rotate(-25deg)',
          alignItems: 'center',
          justifyContent: 'center',

          '& .SCEmptyStatus-icon': {
            transform: 'rotate(25deg)'
          }
        }
      }
    })
  }
};

export default Component;
