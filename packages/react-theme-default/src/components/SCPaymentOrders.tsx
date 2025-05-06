const Component = {
  styleOverrides: {
    root: ({theme}: any) => ({
      '& .SCPaymentOrders-content': {
        position: 'relative',
        margin: theme.spacing(1, 2),
        '& table': {
          '& tr': {
            '& th': {
              zIndex: 1
            }
          },
          '& .SCGroup-root, .SCCategory-root': {
            borderRadius: theme.shape.borderRadius,
            maxWidth: '96%'
          },
          '& .SCPaymentProduct-root': {
            borderRadius: `${theme.shape.borderRadius}px !important`,
            border: '1px solid #e5e5e5',
            boxShadow: 'none',
            color: theme.palette.text.primary,
            '& .MuiAccordionSummary-root': {
              backgroundColor: theme.palette.background.paper,
              opacity: 1,
              borderRadius: theme.shape.borderRadius
            }
          }
        },
        '& .MuiCircularProgress-root': {
          display: 'block',
          margin: `${theme.spacing(7)} auto`
        }
      },
      '& .SCPaymentOrders-filters': {
        alignItems: 'center',
        margin: theme.spacing(2),
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
