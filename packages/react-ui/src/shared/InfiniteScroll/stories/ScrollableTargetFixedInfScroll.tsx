import React, {useState} from 'react';
import InfiniteScroll from '../index';

const style = {
  height: 30,
  border: '1px solid green',
  margin: 6,
  padding: 8
};

export default function ScrollableTargetFixedInfScroll() {
  const [items, setItems] = useState(Array.from({length: 20}));

  const fetchMoreData = () => {
    // a fake async api call like which sends
    // 20 more records in 1.5 secs
    setTimeout(() => {
      setItems(items.concat(Array.from({length: 20})));
    }, 1500);
  };

  return (
    <div>
      <h1>demo: Infinite Scroll with scrollable target FIXED</h1>
      <hr />
      <div
        id="scrollableDiv"
        style={{
          position: 'fixed',
          bottom: 0,
          left: 0,
          right: 0,
          top: 170,
          zIndex: 1000,
          maxWidth: '100% !important',
          height: '50vh',
          overflowY: 'scroll'
        }}>
        <InfiniteScroll
          dataLength={items.length}
          hasMoreNext={true}
          next={fetchMoreData}
          loaderNext={<h4>Loading...</h4>}
          scrollableTarget="scrollableDiv">
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
