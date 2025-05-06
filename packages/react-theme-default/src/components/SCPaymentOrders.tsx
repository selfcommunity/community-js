const Component = {
  styleOverrides: {
    root: ({theme}: any) => ({
      '& .SCPaymentOrders-content': {
        position: 'relative',
        padding: '30px 10px',
        '& table': {
          '& tr': {
            '& th': {
              zIndex: 1
            }
          }
        }
      },
      '& .SCPaymentOrders-filters': {
        alignItems: 'center',
        marginTop: theme.spacing(),
        marginBottom: theme.spacing(2),
        '& .SCPaymentOrders-search': {
          '& .MuiInputBase-root': {
            paddingRight: 0,
            '& .MuiButtonBase-root': {
              borderRadius: '0 5px 5px 0',
              height: '37px',
              '& .MuiButton-endIcon': {
                margin: 0
              }
            }
          }
        },
        '& .SCPaymentOrders-picker': {
          '& .MuiOutlinedInput-root': {
            paddingRight: theme.spacing(0.5)
          }
        }
      }
    })
  }
};

export default Component;
