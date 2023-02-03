/**
 * Sticky Boxes with sensible behaviour if the content is bigger than the viewport.
 *
 * Use as a Component:
 *
 * import StickyBox from "shared/StickyBox";
 *
 * const Page = () => (
 *   <div className="row">
 *     <StickyBox offsetTop={20} offsetBottom={20}>
 *       <div>Sidebar</div>
 *     </StickyBox>
 *     <div>Content</div>
 *   </div>
 * );
 *
 * Or via the useStickyBox hook
 * import {useStickyBox} from "shared/StickyBox";
 *
 * const Page = () => {
 * const stickyRef = useStickyBox({offsetTop: 20, offsetBottom: 20})
 *   <div className="row">
 *   <aside ref={stickyRef}>
 *   <div>Sidebar</div>
 * </aside>
 * <div>Content</div>
 * </div>
 * };
 *
 */

import React, {useEffect, useRef, useState} from 'react';
import ResizeObserver from 'resize-observer-polyfill';

/**
 * getScrollParent
 * @param node
 */
const getScrollParent = (node) => {
  let parent = node;
  while ((parent = parent.parentElement)) {
    const overflowYVal = getComputedStyle(parent, null).getPropertyValue('overflow-y');
    if (parent === document.body) return window;
    if (overflowYVal === 'auto' || overflowYVal === 'scroll') return parent;
  }
  return window;
};

/**
 * offsetTill
 * @param node
 * @param target
 */
const offsetTill = (node, target) => {
  let current = node;
  let offset = 0;
  // If target is not an offsetParent itself, subtract its offsetTop and set correct target
  if (target.firstChild && target.firstChild.offsetParent !== target) {
    offset += node.offsetTop - target.offsetTop;
    target = node.offsetParent;
    offset += -node.offsetTop;
  }
  do {
    offset += current.offsetTop;
    current = current.offsetParent;
  } while (current && current !== target);
  return offset;
};

/**
 * getParentNode
 * @param node
 */
const getParentNode = (node) => {
  let currentParent = node.parentNode;
  while (currentParent) {
    const style = getComputedStyle(currentParent, null);
    if (style.getPropertyValue('display') !== 'contents') break;
    currentParent = currentParent.parentNode;
  }
  return currentParent || window;
};

/**
 * Check CSS 'sticky' compatibility
 */
let stickyProp = null;
if (typeof CSS !== 'undefined' && CSS.supports) {
  if (CSS.supports('position', 'sticky')) stickyProp = 'sticky';
  else if (CSS.supports('position', '-webkit-sticky')) stickyProp = '-webkit-sticky';
}

/**
 * Inspired by https://github.com/WICG/EventListenerOptions/blob/gh-pages/explainer.md#feature-detection
 */
let passiveArg: any = false;
try {
  let opts = Object.defineProperty({}, 'passive', {
    // eslint-disable-next-line getter-return
    get() {
      passiveArg = {passive: true};
    }
  });
  window.addEventListener('testPassive', null, opts);
  window.removeEventListener('testPassive', null, opts);
  // eslint-disable-next-line no-empty
} catch (e) {}

/**
 * registerNode
 * @param node
 * @param offsetTop
 * @param offsetBottom
 * @param bottom
 */
const registerNode = (node, {offsetTop, offsetBottom, bottom}) => {
  const scrollPane = getScrollParent(node);
  let latestScrollY = scrollPane === window ? window.scrollY : scrollPane.scrollTop;

  const unsubs = [];
  let mode, offset, nodeHeight, naturalTop, parentHeight, scrollPaneOffset, viewPortHeight;

  const getCurrentOffset = () => {
    if (mode === 'relative') return offset;
    if (mode === 'stickyTop') {
      return Math.max(0, scrollPaneOffset + latestScrollY - naturalTop + offsetTop);
    }
    if (mode === 'stickyBottom') {
      return Math.max(0, scrollPaneOffset + latestScrollY + viewPortHeight - (naturalTop + nodeHeight + offsetBottom));
    }
  };

  const changeToStickyBottomIfBoxTooLow = (scrollY) => {
    if (scrollY + scrollPaneOffset + viewPortHeight >= naturalTop + nodeHeight + offset + offsetBottom) {
      changeMode('stickyBottom');
    }
  };

  const changeMode = (newMode) => {
    mode = newMode;
    if (newMode === 'relative') {
      node.style.position = 'relative';
      if (bottom) {
        const nextBottom = Math.max(0, parentHeight - nodeHeight - offset);
        node.style.bottom = `${nextBottom}px`;
      } else {
        node.style.top = `${offset}px`;
      }
    } else {
      node.style.position = stickyProp;
      if (newMode === 'stickyBottom') {
        if (bottom) {
          node.style.bottom = `${offsetBottom}px`;
        } else {
          node.style.top = `${viewPortHeight - nodeHeight - offsetBottom}px`;
        }
      } else {
        // stickyTop
        if (bottom) {
          node.style.bottom = `${viewPortHeight - nodeHeight - offsetBottom}px`;
        } else {
          node.style.top = `${offsetTop}px`;
        }
      }
    }
    offset = getCurrentOffset();
  };

  const initial = () => {
    if (bottom) {
      if (mode !== 'stickyBottom') changeMode('stickyBottom');
    } else {
      if (mode !== 'stickyTop') changeMode('stickyTop');
    }
  };

  const addListener = (element, event, handler, passive) => {
    element.addEventListener(event, handler, passive);
    unsubs.push(() => element.removeEventListener(event, handler));
  };

  const handleScroll = () => {
    const scrollY = scrollPane === window ? window.scrollY : scrollPane.scrollTop;
    if (scrollY === latestScrollY) return;
    if (nodeHeight + offsetTop + offsetBottom <= viewPortHeight) {
      // Just make it sticky if node smaller than viewport
      initial();
      latestScrollY = scrollY;
      return;
    }
    const scrollDelta = scrollY - latestScrollY;
    offset = getCurrentOffset();
    if (scrollDelta > 0) {
      // scroll down
      if (mode === 'stickyTop') {
        if (scrollY + scrollPaneOffset + offsetTop > naturalTop) {
          if (scrollY + scrollPaneOffset + viewPortHeight <= naturalTop + nodeHeight + offset + offsetBottom) {
            changeMode('relative');
          } else {
            changeMode('stickyBottom');
          }
        }
      } else if (mode === 'relative') {
        changeToStickyBottomIfBoxTooLow(scrollY);
      }
    } else {
      // scroll up
      if (mode === 'stickyBottom') {
        if (scrollPaneOffset + scrollY + viewPortHeight < naturalTop + parentHeight + offsetBottom) {
          if (scrollPaneOffset + scrollY + offsetTop >= naturalTop + offset) {
            changeMode('relative');
          } else {
            changeMode('stickyTop');
          }
        }
      } else if (mode === 'relative') {
        if (scrollPaneOffset + scrollY + offsetTop < naturalTop + offset) {
          changeMode('stickyTop');
        }
      }
    }

    latestScrollY = scrollY;
  };

  const handleWindowResize = () => {
    viewPortHeight = window.innerHeight;
    scrollPaneOffset = 0;
    handleScroll();
  };

  const handleScrollPaneResize = () => {
    viewPortHeight = scrollPane.offsetHeight;
    if (process.env.NODE_ENV !== 'production' && viewPortHeight === 0) {
      console.warn(`react-sticky-box's scroll pane has a height of 0. This seems odd. Please check this node:`, scrollPane);
    }
    // Only applicable if scrollPane is an offsetParent
    if (scrollPane.firstChild.offsetParent === scrollPane) {
      scrollPaneOffset = scrollPane.getBoundingClientRect().top;
    } else {
      scrollPaneOffset = 0;
    }
    handleScroll();
  };

  const handleParentNodeResize = () => {
    const parentNode = getParentNode(node);
    const computedParentStyle = getComputedStyle(parentNode, null);
    const parentPaddingTop = parseInt(computedParentStyle.getPropertyValue('padding-top'), 10);
    const parentPaddingBottom = parseInt(computedParentStyle.getPropertyValue('padding-bottom'), 10);
    const verticalParentPadding = parentPaddingTop + parentPaddingBottom;
    naturalTop = offsetTill(parentNode, scrollPane) + parentPaddingTop + scrollPaneOffset;
    const oldParentHeight = parentHeight;
    parentHeight = parentNode.getBoundingClientRect().height - verticalParentPadding;

    if (mode === 'relative') {
      if (bottom) {
        changeMode('relative');
      } else {
        // If parent height decreased...
        if (oldParentHeight > parentHeight) {
          changeToStickyBottomIfBoxTooLow(latestScrollY);
        }
      }
    }
    if (oldParentHeight !== parentHeight && mode === 'relative') {
      latestScrollY = Number.POSITIVE_INFINITY;
      handleScroll();
    }
  };

  // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
  // @ts-ignore
  const handleNodeResize = ({initial: initialArg} = {}) => {
    const prevHeight = nodeHeight;
    nodeHeight = node.getBoundingClientRect().height;
    if (!initialArg && prevHeight !== nodeHeight) {
      if (nodeHeight + offsetTop + offsetBottom <= viewPortHeight) {
        // Just make it sticky if node smaller than viewport
        mode = undefined;
        initial();
        return;
      } else {
        const diff = prevHeight - nodeHeight;
        const lowestPossible = parentHeight - nodeHeight;
        const nextOffset = Math.min(lowestPossible, getCurrentOffset() + (bottom ? diff : 0));
        offset = Math.max(0, nextOffset);
        if (!bottom || mode !== 'stickyBottom') changeMode('relative');
      }
    }
  };

  const addResizeObserver = (n, handler) => {
    const ro = new ResizeObserver(handler);
    ro.observe(n);
    unsubs.push(() => ro.disconnect());
  };

  addListener(scrollPane, 'scroll', handleScroll, passiveArg);
  addListener(scrollPane, 'mousewheel', handleScroll, passiveArg);
  if (scrollPane === window) {
    // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
    // @ts-ignore
    addListener(window, 'resize', handleWindowResize);
    handleWindowResize();
  } else {
    addResizeObserver(scrollPane, handleScrollPaneResize);
    handleScrollPaneResize();
  }
  addResizeObserver(getParentNode(node), handleParentNodeResize);
  handleParentNodeResize();

  addResizeObserver(node, handleNodeResize);
  handleNodeResize({initial: true});

  initial();

  return () => unsubs.forEach((fn) => fn());
};

/**
 * Types/interfaces
 */
export type UseStickyBoxProps = {
  offsetTop?: number;
  offsetBottom?: number;
  bottom?: boolean;
};

export type StickyBoxProps = UseStickyBoxProps & {
  style?: React.CSSProperties;
  className?: string;
  children: React.ReactNode;
};

export type useStickyBox = <T = any>(options?: UseStickyBoxProps) => React.RefCallback<T>;
export type StickyBoxComponent = React.FunctionComponent<StickyBoxProps>;

/**
 * useStickyBox
 * @param offsetTop
 * @param offsetBottom
 * @param bottom
 */
export const useStickyBox: useStickyBox = ({offsetTop = 0, offsetBottom = 0, bottom = false}: UseStickyBoxProps = {}) => {
  const [node, setNode] = useState(null);
  const argRef = useRef({offsetTop, offsetBottom, bottom});
  useEffect(() => {
    argRef.current = {offsetTop, offsetBottom, bottom};
  });
  useEffect(() => {
    if (!node) return;
    return registerNode(node, argRef.current);
  }, [node]);
  return setNode;
};

/**
 * StickyBox component
 * @param offsetTop
 * @param offsetBottom
 * @param bottom
 * @param children
 * @param className
 * @param style
 * @constructor
 */
const StickyBox: StickyBoxComponent = ({offsetTop, offsetBottom, bottom, children, className, style}: StickyBoxProps) => {
  const ref = useStickyBox({offsetTop, offsetBottom, bottom});
  return (
    <div className={className} style={style} ref={ref}>
      {children}
    </div>
  );
};

export default StickyBox;
