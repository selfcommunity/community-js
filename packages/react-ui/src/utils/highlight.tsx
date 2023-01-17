import React from 'react';
import {Typography} from '@mui/material';

export function highlight(text, searchQuery): JSX.Element {
  // Split on searchQuery term and include term into parts, ignore case
  const parts = text.split(new RegExp(`(${searchQuery})`, 'gi'));
  return (
    <>
      {parts.map((p, i) => (
        <Typography component={'span'} key={i} sx={{fontWeight: p.toLowerCase() === searchQuery.toLowerCase() ? 'bold' : ''}}>
          {p}
        </Typography>
      ))}
    </>
  );
}
