import React, {useContext} from 'react';
import {SCRoutingContext} from '../provider/SCRoutingProvider';
import {SCRoutingContextType} from '../../types/context';

/**
 *
 * Import these components:
 * import {SCRoutingContextType, useSCRouting, Link, SCRoutes} from '@selfcommunity/react-core';
 *
 * Example:
 *    const scRoutingContext: SCRoutingContextType = useSCRouting();
 *    `<Button component={Link} to={scRoutingContext.url(SCRoutes.USER_PROFILE_ROUTE_NAME, {id: user.id})}>Go to profile</Button>`
 * or
 *    const scRoutingContext: SCRoutingContextType = useSCRouting();
 *    `<Link to={scRoutingContext.url('profile', {id: user.id})}>Go to profile</Link>`
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

/**
 :::info
 This component is used to navigate through the application.
 :::

 ## Usage

 In order to use router you need to import this components first:

 ```jsx
 import {SCRoutingContextType, useSCRouting, Link, SCRoutes} from '@selfcommunity/react-core';
 ````
 :::tipUsage Example:

 ```jsx
 const scRoutingContext: SCRoutingContextType = useSCRouting();
 <Button component={Link} to={scRoutingContext.url(SCRoutes.USER_PROFILE_ROUTE_NAME, {id: user.id})>Go to profile</Button>
````
 **or**

```jsx
const scRoutingContext: SCRoutingContextType = useSCRouting();
<Link to={scRoutingContext.url('profile', {id: user.id})}>Go to profile</Link>
````

:::
 */
export default React.forwardRef(Link);
