import { Icon, IconButton } from '@mui/material';
import { Dispatch, HTMLAttributes, SetStateAction, useCallback, useEffect, useState } from 'react';
import { useSwiper } from 'swiper/react';

export interface ArrowProps {
  type: 'prev' | 'next';
  currentItem: number;
  setCurrentItem: Dispatch<SetStateAction<number>>;
  className?: HTMLAttributes<HTMLButtonElement>['className'];
}

export default function Arrow(props: ArrowProps) {
  const { type, currentItem, setCurrentItem, className } = props;

  // STATE
  const [itemsLength, setItemsLength] = useState(0);

  // HOOKS
  const swiper = useSwiper();

  useEffect(() => {
    setItemsLength(swiper.slides.length);
  }, []);

  const handleChange = useCallback(
    (type: 'prev' | 'next') => {
      if (type === 'prev') {
        swiper.slidePrev();
      } else {
        swiper.slideNext();
      }

      setCurrentItem(swiper.snapIndex);
    },
    [type]
  );

  if (type === 'prev') {
    return (
      currentItem > 0 && (
        <IconButton className={className} size="medium" onClick={() => handleChange('prev')}>
          <Icon>chevron_left</Icon>
        </IconButton>
      )
    );
  }

  return (
    currentItem < itemsLength - 1 && (
      <IconButton className={className} size="medium" onClick={() => handleChange('next')}>
        <Icon>chevron_right</Icon>
      </IconButton>
    )
  );
}
