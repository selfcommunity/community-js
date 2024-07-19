import {useEffect, useLayoutEffect} from 'react';
import {isClientSideRendering} from '@selfcommunity/utils';

// Ensure that the SSR uses React.useEffect instead of React.useLayoutEffect
// because document is undefined on the server-side.
const useIsomorphicLayoutEffect = isClientSideRendering() ? useLayoutEffect : useEffect;

export default useIsomorphicLayoutEffect;
