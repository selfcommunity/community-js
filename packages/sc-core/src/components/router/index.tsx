import React, {useContext} from 'react';
import {SCRoutingContext} from '../provider/SCRoutingProvider';
import {SCRoutingContextType} from '@selfcommunity/core';

/**
 *
 * Import:
 * import {Link, url} from '@selfcommunity/core';
 * import {SCRoutingContextType, SCRoutingContext} from '@selfcommunity/core';
 *
 * Example:
 * const scRoutingContext: SCRoutingContextType = useContext(SCRoutingContext);
 * <Button component={Link} to={url(scRoutingContext.routes['profile'], {id: user.id})}>Go to profile</Button>
 *
 */
const Link = ({children, ...other}, ref) => {
  const scRoutingContext: SCRoutingContextType = useContext(SCRoutingContext);
  if (scRoutingContext.routerLink) {
    const ComponentLink: React.ComponentClass<any> = scRoutingContext.routerLink;
    return (
      <ComponentLink {...other} ref={ref}>
        {children}
      </ComponentLink>
    );
  }
  const {to, ...rest} = other;
  return (
    <a href={to} {...rest} ref={ref}>
      {children}
    </a>
  );
};

export default React.forwardRef(Link);
