import {Box, IconButton, TextField, styled, useTheme, useMediaQuery, Autocomplete} from '@mui/material';
import Icon from '@mui/material/Icon';
import React, {FormEvent, useEffect, useState} from 'react';
import classNames from 'classnames';
import {useThemeProps} from '@mui/system';
import {defineMessages, FormattedMessage, useIntl} from 'react-intl';
import {SuggestionType} from '@selfcommunity/types';
import {SuggestionService} from '@selfcommunity/api-services';

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
  maxWidth: '20ch',
  marginLeft: theme.spacing(1),
  [`& .${classes.searchInput}`]: {
    paddingRight: '2px !important'
  }
}));

const MobileRoot = styled(Box, {
  slot: 'Root',
  overridesResolver: (props, styles) => styles.root
})(({theme}) => ({
  position: 'absolute',
  marginLeft: theme.spacing(4),
  width: '85%',
  [`& .${classes.searchInput}`]: {
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
  const [query, setQuery] = useState('');
  const [clicked, setClicked] = useState(false);
  const theme = useTheme();
  const isDesktop = useMediaQuery(theme.breakpoints.up('sm'));
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [results, setResults] = useState([]);
  const [open, setOpen] = useState(false);

  // INTL
  const intl = useIntl();

  const handleChange = (event) => {
    setQuery(event.target.value);
  };

  const handleSearch = (event: FormEvent) => {
    event.preventDefault();
    event.stopPropagation();
    onSearch && onSearch(query);
    handleClear();
    return false;
  };

  const handleClear = () => {
    setOpen(false);
    setQuery('');
    setResults([]);
  };

  const handleClick = () => {
    setClicked(true);
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
      <form onSubmit={handleSearch}>
        <Autocomplete
          className={classes.autocomplete}
          id={`${PREFIX}-autocomplete`}
          size="small"
          inputValue={query}
          loading={isLoading}
          open={query !== ''}
          loadingText={<FormattedMessage id="ui.header.searchBar.loading" defaultMessage="ui.header.searchBar.loading" />}
          noOptionsText={<FormattedMessage id="ui.header.searchBar.noOptions" defaultMessage="ui.header.searchBar.noOptions" />}
          options={results.map((o) => (o.type === SuggestionType.USER ? o[SuggestionType.USER] : o[SuggestionType.CATEGORY]))}
          getOptionLabel={(option: any) => option['username'] ?? option['name']}
          onChange={handleSearch}
          onInputChange={(e, value) => {
            if (value.length === 0) {
              if (open) setOpen(false);
            } else {
              if (!open) setOpen(true);
            }
          }}
          onClose={() => setOpen(false)}
          renderInput={(params) => (
            <TextField
              {...params}
              onChange={handleChange}
              placeholder={`${intl.formatMessage(messages.placeholder)}`}
              InputProps={{
                ...params.InputProps,
                className: classes.searchInput,
                startAdornment: <>{!query && isDesktop && <Icon color="primary">search</Icon>}</>,
                endAdornment: (
                  <>
                    {query && (
                      <IconButton onClick={handleClear}>
                        <Icon color="primary">close</Icon>
                      </IconButton>
                    )}
                  </>
                )
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
        <Root className={classNames(classes.root, className)}>{renderAutocomplete()}</Root>
      ) : (
        <>
          {!clicked && (
            <IconButton onClick={handleClick}>
              <Icon>search</Icon>
            </IconButton>
          )}
        </>
      )}
      {clicked && !isDesktop && <MobileRoot>{renderAutocomplete()}</MobileRoot>}
    </>
  );
}
