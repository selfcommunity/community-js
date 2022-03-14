import React, {useCallback, useEffect, useRef, useState} from 'react';
import {styled} from '@mui/material/styles';
import {Box} from '@mui/material';
import classNames from 'classnames';

const PREFIX = 'SCScrollContainer';

const classes = {
  root: `${PREFIX}-root`,
  scrollhost: `${PREFIX}-scrollhost`,
  scrollhostContainer: `${PREFIX}-scrollhost-container`,
  scrollbar: `${PREFIX}-scrollbar`,
  scrollThumb: `${PREFIX}-scroll-thumb`
};

const Root = styled(Box, {
  name: PREFIX,
  slot: 'Root',
  overridesResolver: (props, styles) => [styles.root]
})(() => ({
  position: 'relative',
  height: '100%',
  [`& .${classes.scrollhost}`]: {
    position: 'relative',
    overflow: 'auto',
    height: '100%',
    scrollbarWidth: 'none',
    msOverflowStyle: 'none',
    '&::-webkit-scrollbar': {
      display: 'none'
    }
  },
  [`& .${classes.scrollbar}`]: {
    width: 10,
    height: '100%',
    right: 0,
    top: 0,
    position: 'absolute',
    borderRadius: 7,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.20)'
  },
  [`& .${classes.scrollThumb}`]: {
    width: 8,
    height: 20,
    marginLeft: 1,
    position: 'absolute',
    borderRadius: 7,
    opacity: 1,
    top: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.35)'
  }
}));

const SCROLL_BOX_MIN_HEIGHT = 20;

export interface ScrollContainerProps {
  /**
   * Overrides or extends the styles applied to the component.
   * @default null
   */
  className?: string;

  /**
   * Children
   * @default ''
   */
  children: any;

  /**
   * Other props
   */
  [p: string]: any;
}

export default function ScrollContainer(props: ScrollContainerProps): JSX.Element {
  // PROPS
  const {children, className, ...restProps} = props;

  // STATE
  const [hovering, setHovering] = useState(false);
  const [scrollBoxHeight, setScrollBoxHeight] = useState(SCROLL_BOX_MIN_HEIGHT);
  const [scrollBoxTop, setScrollBoxTop] = useState(0);
  const [lastScrollThumbPosition, setScrollThumbPosition] = useState(0);
  const [isDragging, setDragging] = useState(false);

  // HANDLERS
  const handleMouseOver = useCallback(() => {
    !hovering && setHovering(true);
  }, [hovering]);

  const handleMouseOut = useCallback(() => {
    !!hovering && setHovering(false);
  }, [hovering]);

  const handleDocumentMouseUp = useCallback(
    (e) => {
      if (isDragging) {
        e.preventDefault();
        setDragging(false);
      }
    },
    [isDragging]
  );

  const handleDocumentMouseMove = useCallback(
    (e) => {
      if (isDragging) {
        e.preventDefault();
        e.stopPropagation();
        const scrollHostElement: any = scrollHostRef.current;
        const {scrollHeight, offsetHeight} = scrollHostElement;

        let deltaY = e.clientY - lastScrollThumbPosition;
        let percentage = deltaY * (scrollHeight / offsetHeight);

        setScrollThumbPosition(e.clientY);
        setScrollBoxTop(Math.min(Math.max(0, scrollBoxTop + deltaY), offsetHeight - scrollBoxHeight));
        scrollHostElement.scrollTop = Math.min(scrollHostElement.scrollTop + percentage, scrollHeight - offsetHeight);
      }
    },
    [isDragging, lastScrollThumbPosition, scrollBoxHeight, scrollBoxTop]
  );

  const handleScrollThumbMouseDown = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    setScrollThumbPosition(e.clientY);
    setDragging(true);
  }, []);

  const handleScroll = useCallback(() => {
    if (!scrollHostRef) {
      return;
    }
    const scrollHostElement: any = scrollHostRef.current;
    const {scrollTop, scrollHeight, offsetHeight} = scrollHostElement;
    let newTop = (parseInt(scrollTop, 10) / parseInt(scrollHeight, 10)) * parseInt(offsetHeight, 10);
    newTop = Math.min(newTop, offsetHeight - scrollBoxHeight);
    setScrollBoxTop(newTop);
  }, []);

  const scrollHostRef = useRef();

  useEffect(() => {
    const scrollHostElement: any = scrollHostRef.current;
    const {clientHeight, scrollHeight} = scrollHostElement;
    const scrollThumbPercentage = clientHeight / scrollHeight;
    const scrollThumbHeight = Math.max(scrollThumbPercentage * clientHeight, SCROLL_BOX_MIN_HEIGHT);
    setScrollBoxHeight(scrollThumbHeight);
    scrollHostElement.addEventListener('scroll', handleScroll, true);
    return function cleanup() {
      scrollHostElement.removeEventListener('scroll', handleScroll, true);
    };
  }, []);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      //this is handle the dragging on scroll-thumb
      document.addEventListener('mousemove', handleDocumentMouseMove);
      document.addEventListener('mouseup', handleDocumentMouseUp);
      document.addEventListener('mouseleave', handleDocumentMouseUp);
    }
    return function cleanup() {
      if (typeof window !== 'undefined') {
        document.removeEventListener('mousemove', handleDocumentMouseMove);
        document.removeEventListener('mouseup', handleDocumentMouseUp);
        document.removeEventListener('mouseleave', handleDocumentMouseUp);
      }
    };
  }, [handleDocumentMouseMove, handleDocumentMouseUp]);

  return (
    <Root onMouseOver={handleMouseOver} onMouseOut={handleMouseOut}>
      <div ref={scrollHostRef} className={classNames(classes.scrollhost, className)} {...restProps}>
        {children}
      </div>
      <div className={classes.scrollbar} style={{opacity: hovering ? 1 : 0}}>
        <div className={classes.scrollThumb} style={{height: scrollBoxHeight, top: scrollBoxTop}} onMouseDown={handleScrollThumbMouseDown} />
      </div>
    </Root>
  );
}
