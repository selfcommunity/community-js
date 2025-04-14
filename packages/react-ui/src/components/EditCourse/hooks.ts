import {useEffect, useRef, useState} from 'react';
import PubSub from 'pubsub-js';
import {SCGroupEventType, SCTopicType} from '../../constants/PubSub';

export const useIsDisabled = () => {
  // STATES
  const [isDisabled, setIsDisabled] = useState(false);

  // REFS
  const updateDragStatus = useRef(null);

  // EFFECTS
  useEffect(() => {
    updateDragStatus.current = PubSub.subscribe(`${SCTopicType.COURSE}.${SCGroupEventType.UPDATE}`, (_msg: string, data: boolean) =>
      setIsDisabled(data)
    );

    return () => {
      updateDragStatus.current && PubSub.unsubscribe(updateDragStatus.current);
    };
  }, [setIsDisabled]);

  return {isDisabled};
};
