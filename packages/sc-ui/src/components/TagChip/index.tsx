import React, {Fragment, useEffect, useState} from 'react';
import Chip from '@mui/material/Chip';
import classNames from 'classnames';
import {styled} from '@mui/material/styles';
import {Endpoints, http, Logger, SCTagType} from '@selfcommunity/core';
import {AxiosResponse} from 'axios';
import {SCOPE_SC_UI} from '../../constants/Errors';

const PREFIX = 'SCTagChip';

const Root = styled('span', {
  name: PREFIX,
  slot: 'Root',
  overridesResolver: (props, styles) => [styles.root]
})(({theme}) => ({
  mainChip: {
    marginTop: theme.spacing(1),
    marginRight: theme.spacing(1),
    '&:first-of-type': {
      marginLeft: 0
    }
  },
  chipEllipsis: {
    maxWidth: 120
  },
  label: {
    fontSize: '14px',
    paddingLeft: 12,
    paddingRight: 12,
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis'
  }
}));

export default function TagChip({
  id = null,
  tag = null,
  onClick = null,
  ellipsed = null,
  ...rest
}: {
  id?: number;
  tag?: SCTagType;
  onClick?: (res: any) => void;
  ellipsed?: boolean;
  [p: string]: any;
}): JSX.Element {
  const [scTag, setSCTag] = useState<SCTagType>(tag);
  const {classes} = rest;
  /**
   * If scTag not in props, attempt to get the tag by scTagId (in props) if exist
   */
  function fetchTag() {
    http
      .request({
        url: Endpoints.Tag.url({id: id}),
        method: Endpoints.Tag.method
      })
      .then((res: AxiosResponse<SCTagType>) => {
        const data: SCTagType = res.data;
        setSCTag(data);
      })
      .catch((error) => {
        Logger.error(SCOPE_SC_UI, error);
      });
  }

  useEffect(() => {
    if (id) {
      fetchTag();
    }
  }, []);

  /**
   * Handle click on tagChip
   */
  function handleClick(id) {
    onClick(id);
  }

  if (!tag) {
    return <></>;
  }

  return (
    <Fragment>
      <Chip
        ref={this.ref}
        size="small"
        classes={{labelSmall: classes.label, root: classNames(classes.mainChip, {[classes.chipEllipsis]: ellipsed})}}
        color="primary"
        style={{backgroundColor: `${tag.color}`}}
        onClick={this.handleClick ? () => this.handleClick(tag.id) : null}
        {...rest}
      />
    </Fragment>
  );
}
