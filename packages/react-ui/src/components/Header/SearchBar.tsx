import {alpha, Box, IconButton, TextField, styled, useTheme, useMediaQuery} from '@mui/material';
import Icon from "@mui/material/Icon";
import React, {useState} from 'react';
import classNames from 'classnames';
import {useThemeProps} from '@mui/system';
import {defineMessages, useIntl} from 'react-intl';

const messages = defineMessages({
  placeholder: {
    id: 'ui.header.searchBar.search',
    defaultMessage: 'ui.header.searchBar.search'
  }
});

const PREFIX = 'SCHeaderSearchBar';

const classes = {
  root: `${PREFIX}-root`,
  searchInput:`${PREFIX}-search-input`
};

const Root = styled(Box, {
  name: PREFIX,
  slot: 'Root',
})(({theme}) => ({
  position: 'relative',
  display: 'flex',
  justifyContent: 'right',
  borderRadius: theme.shape.borderRadius,
  backgroundColor: alpha(theme.palette.common.white, 0.15),
  '&:hover': {
    backgroundColor: alpha(theme.palette.common.white, 0.25),
  },
  marginLeft: 0,
  width: '100%',
  maxWidth: '25ch',
  [theme.breakpoints.up('sm')]: {
    marginLeft: theme.spacing(1),
    width: 'auto',
  },
  [`& .${classes.searchInput}`]: {
    color: 'inherit',
    '& .MuiInputBase-input': {
      padding: theme.spacing(1, 1, 1, 0),
      paddingLeft: theme.spacing(1),
      transition: theme.transitions.create('width'),
      width: '100%',
      [theme.breakpoints.up('sm')]: {
        width: '12ch',
        '&:focus': {
          width: '25ch',
        },
      },
    },
  }
}));

export interface HeaderSearchBarProps {
  /**
   * Overrides or extends the styles applied to the component.
   * @default null
   */
  className?: string;
  /**
   * handleSearch callback
   */
  handleSearch: (url) => void;
  /**
   * Other props
   */
  [p: string]: any;
}

export default function HeaderSearchBar(inProps: HeaderSearchBarProps){
  // PROPS
  const props: HeaderSearchBarProps = useThemeProps({
    props: inProps,
    name: PREFIX
  });
  const {className, handleSearch, ...rest} = props;
  const [query, setQuery] = useState('');
  const [clicked, setClicked]= useState(false);
  const theme = useTheme();
  const isDesktop = useMediaQuery(theme.breakpoints.up('sm'));

  // INTL
  const intl = useIntl();


  const handleChange=(event) => {
    setQuery(event.target.value);
  }


  return (
    <Root className={classNames(classes.root, className)}>
        {clicked || isDesktop ?
          <form onSubmit={handleSearch}>
          <TextField
            placeholder={`${intl.formatMessage(messages.placeholder)}`}
            className={classes.searchInput}
            value={query}
            onChange={handleChange}
            InputProps={{
              endAdornment: (
                <IconButton onClick={handleSearch}><Icon>search</Icon></IconButton>
              )
            }}
          />
          </form>
          :
          <IconButton onClick={() => setClicked(!clicked)}><Icon>search</Icon></IconButton>
        }
    </Root>
  )
}
