import InfiniteScroll from '../index';
import {useState} from 'react';

const style = {
  height: 30,
  border: '1px solid green',
  margin: 6,
  padding: 8
};

export default function ScrolleableTop() {
  const [items, setItems] = useState(Array.from({length: 20}));

  const fetchMoreData = () => {
    // a fake async api call like which sends
    // 20 more records in 1.5 secs
    setTimeout(() => {
      setItems(items.concat(Array.from({length: 20})));
    }, 500);
  };

  return (
    <div>
      <h1>demo: Infinite Scroll on top</h1>
      <hr />
      <div
        id="scrollableDiv"
        style={{
          height: 300,
          overflow: 'auto'
        }}>
        <InfiniteScroll
          dataLength={items.length}
          previous={fetchMoreData}
          hasMorePrevious={true}
          loaderPrevious={<h4>Loading prev...</h4>}
          scrollableTarget="scrollableDiv"
          scrollThreshold={'0px'}>
          {items.map((_, index) => (
            <div style={style} key={index}>
              div - #{index}
            </div>
          ))}
        </InfiniteScroll>
      </div>
    </div>
  );

}
