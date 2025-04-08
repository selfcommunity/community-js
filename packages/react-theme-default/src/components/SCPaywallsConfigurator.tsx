import {grey} from '@mui/material/colors';

const Component = {
  styleOverrides: {
    root: ({theme}: any) => ({
      [`& .SCPaywallsConfigurator-new-product`]: {
        background: '#eeeeee',
        padding: theme.spacing(2),
        marginTop: theme.spacing(),
        borderRadius: theme.spacing(1)
      },
      [`& .SCPaywallsConfigurator-no-product`]: {
        textDecoration: 'italic',
        paddingLeft: 0,
        color: grey[400]
      },
      [`& .SCPaywallsConfigurator-content-access-type`]: {
				'& > p': {
					marginBottom: theme.spacing(2),
				},
				'& .MuiPaper-root': {
          borderColor: '#c6c6c6'
        },
        '& .MuiAccordion-root:first-of-type': {
          borderTopLeftRadius: 5,
          borderTopRightRadius: 5
        },
        '& .MuiAccordion-root:last-of-type': {
          borderBottomLeftRadius: 5,
          borderBottomRightRadius: 5
        },
        [`& .SCPaywallsConfigurator-selected-payment-products-list`]: {
          borderTop: '1px solid',
          marginTop: 10
        },
        [`& .SCPaywallsConfigurator-add-payment-product`]: {
          position: 'relative',
          left: -23,
          '& .MuiButton-startIcon': {
            fontSize: '15px'
          }
        }
      }
    }),
    paymentProductsAutocompletePopperRoot: ({theme}: any) => ({
      [`& .MuiAutocomplete-paper`]: {
        boxShadow: 'none',
        margin: 0,
        color: 'inherit',
        fontSize: 13
      },
      [`& .MuiAutocomplete-listbox`]: {
        backgroundColor: theme.palette.mode === 'light' ? '#fff' : '#1c2128',
        padding: 0,
        [`& .MuiAutocomplete-option`]: {
          minHeight: 'auto',
          alignItems: 'flex-start',
          padding: 8,
          borderBottom: `1px solid  ${theme.palette.mode === 'light' ? ' #eaecef' : '#30363d'}`,
          '&[aria-selected="true"]': {
            backgroundColor: 'transparent'
          },
          [`&.MuiAutocomplete-focused, &.MuiAutocomplete-focused[aria-selected="true"]`]: {
            backgroundColor: theme.palette.action.hover
          }
        }
      },
      [`&.MuiAutocomplete-popperDisablePortal`]: {
        position: 'relative'
      },
      [`& .SCPaywallsConfigurator-product-check-icon`]: {
        width: 17,
        height: 17,
        margin: '3px 5px 0px -1px'
      },
      [`& .SCPaywallsConfigurator-product-card-icon`]: {
        width: 14,
        height: 14,
        flexShrink: 0,
        borderRadius: '3px',
        marginRight: theme.spacing(),
        marginTop: '2px',
        padding: '3px',
        backgroundColor: 'red',
        color: 'white'
      },
      [`& .SCPaywallsConfigurator-product-content`]: {
        flexGrow: 1,
        '& span': {
          color: '#8b949e'
        }
      },
      [`& .SCPaywallsConfigurator-product-remove-icon`]: {
        opacity: 0.6,
        width: 18,
        height: 18
      },
      [`& .SCPaywallsConfigurator-autocomplete-footer`]: {
        backgroundColor: grey[400]
      }
    }),
    paymentProductsPopperRoot: ({theme}: any) => ({
      border: `1px solid ${theme.palette.mode === 'light' ? '#e1e4e8' : '#30363d'}`,
      boxShadow: `0 8px 24px ${theme.palette.mode === 'light' ? 'rgba(149, 157, 165, 0.2)' : 'rgb(1, 4, 9)'}`,
      borderRadius: 6,
      width: 300,
      zIndex: theme.zIndex.modal,
      fontSize: 13,
      color: theme.palette.mode === 'light' ? '#24292e' : '#c9d1d9',
      backgroundColor: theme.palette.mode === 'light' ? '#fff' : '#1c2128',
      '& .MuiPaper-root': {
        borderRadius: 0
      },
      [`& .SCPaywallsConfigurator-payment-products-popper-title`]: {
        borderBottom: `1px solid ${theme.palette.mode === 'light' ? '#eaecef' : '#30363d'}`,
        padding: '8px 10px',
        fontWeight: 600
      },
      [`& .SCPaywallsConfigurator-payment-products-popper-footer`]: {
        borderTop: '1px solid #eaecef',
        padding: '8px',
        display: 'flex',
        alignItems: 'flex-end',
        justifyContent: 'center',
        '& button': {
          padding: '2px 8px',
          '& .MuiIcon-root': {
            fontSize: 12
          }
        }
      }
    }),
    filterInputRoot: ({theme}: any) => ({
      padding: 10,
      width: '100%',
      borderBottom: `1px solid ${theme.palette.mode === 'light' ? '#eaecef' : '#30363d'}`,
      '& input': {
        borderRadius: 4,
        backgroundColor: theme.palette.mode === 'light' ? '#fff' : '#0d1117',
        padding: 8,
        transition: theme.transitions.create(['border-color', 'box-shadow']),
        border: `1px solid ${theme.palette.mode === 'light' ? '#eaecef' : '#30363d'}`,
        fontSize: 14,
        '&:focus': {
          boxShadow: `0px 0px 0px 3px ${theme.palette.mode === 'light' ? 'rgba(3, 102, 214, 0.3)' : 'rgb(12, 45, 107)'}`,
          borderColor: theme.palette.mode === 'light' ? '#0366d6' : '#388bfd'
        }
      }
    })
  }
};

export default Component;
