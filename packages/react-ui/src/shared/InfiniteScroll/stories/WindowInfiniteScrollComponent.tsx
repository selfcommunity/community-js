import React, {useState} from 'react';
import InfiniteScroll from '../index';

export default function WindowInfiniteScrollComponent() {
  const [data, setData] = useState<number[]>(Array.from({length: 30}, (_, i) => i));

  const next = () => {
    setTimeout(() => {
      const currentLength = data.length;
      const newData = [...data, ...Array.from({length: 5}, (_, i) => i).map((i) => i + currentLength)];
      setData(newData);
    }, 500);
  };

  const previous = () => {
    setTimeout(() => {
      const currentLength = data[0];
      const newData = [
        ...Array.from({length: 5}, (_, i) => i)
          .map((i) => i * -1 + currentLength - 1)
          .reverse(),
        ...data
      ];
      setData(newData);
    }, 500);
  };

  return (
    <>
      <InfiniteScroll
        hasMoreNext={true}
        next={next}
        hasMorePrevious={true}
        previous={previous}
        loaderNext={<h1>Loading next...</h1>}
        loaderPrevious={<h1>Loading prev...</h1>}
        dataLength={data.length}
        scrollThreshold={1}>
        {data.map((e) => (
          <div key={e} style={{height: 200, margin: 4, border: '1px solid hotpink'}}>
            #{e} row
          </div>
        ))}
      </InfiniteScroll>
    </>
  );

}
