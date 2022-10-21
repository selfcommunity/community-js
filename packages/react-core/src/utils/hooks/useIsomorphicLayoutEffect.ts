import {useEffect, useLayoutEffect} from 'react';

// Ensure that the SSR uses React.useEffect instead of React.useLayoutEffect
// because document is undefined on the server-side.
const useIsomorphicLayoutEffect = typeof window !== 'undefined' ? useLayoutEffect : useEffect;

export default useIsomorphicLayoutEffect;