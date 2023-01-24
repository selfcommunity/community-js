import {Box, IconButton, TextField, styled, useTheme, useMediaQuery, Autocomplete, Avatar, Typography} from '@mui/material';
import Icon from '@mui/material/Icon';
import React, {FormEvent, useEffect, useState} from 'react';
import classNames from 'classnames';
import {useThemeProps} from '@mui/system';
import {defineMessages, FormattedMessage, useIntl} from 'react-intl';
import {SuggestionType} from '@selfcommunity/types';
import {SuggestionService} from '@selfcommunity/api-services';
import {SCRoutes, SCRoutingContextType, SCThemeType, useSCRouting} from '@selfcommunity/react-core';

const messages = defineMessages({
  placeholder: {
    id: 'ui.header.searchBar.search',
    defaultMessage: 'ui.header.searchBar.search'
  }
});

const PREFIX = 'SCHeaderSearchBar';

const classes = {
  root: `${PREFIX}-root`,
  autocomplete: `${PREFIX}-autocomplete`,
  searchInput: `${PREFIX}-search-input`
};

const Root = styled(Box, {
  name: PREFIX,
  slot: 'Root'
})(({theme}) => ({
  width: '100%',
  maxWidth: '25ch',
  marginLeft: theme.spacing(1),
  [`& .${classes.searchInput}`]: {
    paddingRight: '2px !important'
  },
  [`& .${classes.autocomplete}`]: {
    [theme.breakpoints.up('sm')]: {
      width: '18ch',
      '& .Mui-focused': {
        width: '25ch'
      }
    }
  }
}));

const MobileRoot = styled(Box, {
  slot: 'Root',
  overridesResolver: (props, styles) => styles.root
})(({theme}) => ({
  position: 'absolute',
  marginLeft: '40px',
  width: '100%',
  [theme.breakpoints.down('sm')]: {
    width: '85%'
  },
  [`& .${classes.searchInput}`]: {
    [theme.breakpoints.down('sm')]: {
      width: '95%'
    },
    paddingRight: '2px !important'
  }
}));

export interface HeaderSearchBarProps {
  /**
   * Overrides or extends the styles applied to the component.
   * @default null
   */
  className?: string;
  /**
   * onSearch callback
   */
  onSearch?: (query) => void;

  /**
   * onClick callback
   */
  onClick?: (clicked) => void;
  /**
   * Other props
   */
  [p: string]: any;
}

export default function HeaderSearchBar(inProps: HeaderSearchBarProps) {
  // PROPS
  const props: HeaderSearchBarProps = useThemeProps({
    props: inProps,
    name: PREFIX
  });
  const {className, onSearch, onClick, ...rest} = props;
  // CONTEXT
  const scRoutingContext: SCRoutingContextType = useSCRouting();
  // STATE
  const [query, setQuery] = useState('');
  const [clicked, setClicked] = useState(false);
  const theme = useTheme<SCThemeType>();
  const isDesktop = useMediaQuery(theme.breakpoints.up('sm'));
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [results, setResults] = useState([]);
  const [isSearching, setIsSearching] = useState<boolean>(false);

  // INTL
  const intl = useIntl();

  const handleChange = (event, value) => {
    setQuery(value);
    setIsSearching(true);
  };

  const handleSearch = (option) => {
    setIsSearching(false);
    if (typeof window !== 'undefined') {
      switch (option.type) {
        case SuggestionType.USER:
          window.location.href = scRoutingContext.url(SCRoutes.USER_PROFILE_ROUTE_NAME, option[SuggestionType.USER]);
          break;
        case SuggestionType.CATEGORY:
          window.location.href = scRoutingContext.url(SCRoutes.CATEGORY_ROUTE_NAME, option[SuggestionType.CATEGORY]);
          break;
      }
    }
  };

  const handleFormSearch = (event: FormEvent) => {
    setIsSearching(false);
    event.preventDefault();
    event.stopPropagation();
    onSearch && onSearch(query);
  };

  const handleClick = () => {
    setClicked(!clicked);
    onClick(clicked);
  };

  function fetchResults() {
    setIsLoading(true);
    SuggestionService.getSearchSuggestion(query)
      .then((data) => {
        setIsLoading(false);
        const r = data.results;
        setResults(r);
      })
      .catch((error) => {
        setIsLoading(false);
        console.log(error);
      });
  }
  useEffect(() => {
    if (query) {
      fetchResults();
    }
  }, [query]);

  const renderAutocomplete = () => {
    return (
      <form onSubmit={handleFormSearch}>
        <Autocomplete
          autoComplete={true}
          className={classes.autocomplete}
          id={`${PREFIX}-autocomplete`}
          size="small"
          inputValue={query}
          loading={isLoading}
          forcePopupIcon={false}
          clearOnEscape={true}
          clearOnBlur={true}
          open={query !== '' && isSearching}
          loadingText={<FormattedMessage id="ui.header.searchBar.loading" defaultMessage="ui.header.searchBar.loading" />}
          noOptionsText={<FormattedMessage id="ui.header.searchBar.noOptions" defaultMessage="ui.header.searchBar.noOptions" />}
          options={results}
          getOptionLabel={(option) => option[option.type]['username'] ?? option[option.type]['name']}
          onInputChange={handleChange}
          renderOption={(props, option) => (
            <Box component="li" {...props} onClick={() => handleSearch(option)}>
              {option.type === SuggestionType.USER ? (
                <>
                  <Avatar alt={option[SuggestionType.USER]['username']} src={option[SuggestionType.USER]['avatar']} />
                  <Typography ml={1}>{option[SuggestionType.USER]['username']}</Typography>
                </>
              ) : (
                <>
                  <Avatar alt={option[SuggestionType.CATEGORY]['name']} src={option[SuggestionType.CATEGORY]['image_small']} variant="square" />
                  <Typography ml={1}>{option[SuggestionType.CATEGORY]['name']}</Typography>
                </>
              )}
            </Box>
          )}
          renderInput={(params) => (
            <TextField
              {...params}
              placeholder={`${intl.formatMessage(messages.placeholder)}`}
              InputProps={{
                ...params.InputProps,
                className: classes.searchInput,
                startAdornment: <>{!query && isDesktop && <Icon color="primary">search</Icon>}</>
              }}
            />
          )}
        />
      </form>
    );
  };

  return (
    <>
      {isDesktop ? (
        <Root className={classNames(classes.root, className)} {...rest}>
          {renderAutocomplete()}
        </Root>
      ) : (
        <>
          {clicked && (
            <>
              <IconButton onClick={handleClick} sx={{position: 'absolute'}}>
                <Icon>arrow_back</Icon>
              </IconButton>
              <MobileRoot>{renderAutocomplete()}</MobileRoot>
            </>
          )}
          {!clicked && (
            <IconButton onClick={handleClick}>
              <Icon>search</Icon>
            </IconButton>
          )}
        </>
      )}
    </>
  );
}
