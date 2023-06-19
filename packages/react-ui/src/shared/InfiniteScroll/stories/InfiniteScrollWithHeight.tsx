import InfiniteScroll from '../index';
import {useState} from 'react';

const style = {
  height: 30,
  border: '1px solid green',
  margin: 6,
  padding: 8
};

export default function InfiniteScrollWithHeight() {
  const [hasMore, setHasMore] = useState(true);
  const [items, setItems] = useState(Array.from({length: 20}));

  const fetchMoreData = () => {
    if (items.length >= 500) {
      setHasMore(false);
      return;
    }
    // a fake async api call like which sends
    // 20 more records in .5 secs
    setTimeout(() => {
      setItems(items.concat(Array.from({length: 20})));
    }, 500);
  };

    return (
      <div>
        <h1>demo: Infinite Scroll with fixed height</h1>
        <hr />
        <InfiniteScroll
          dataLength={items.length}
          next={fetchMoreData}
          hasMoreNext={hasMore}
          loaderNext={<h4>Loading...</h4>}
          height={400}
          endMessage={
            <p style={{textAlign: 'center'}}>
              <b>Yay! You have seen it all</b>
            </p>
          }>
          {items.map((_, index) => (
            <div style={style} key={index}>
              div - #{index}
            </div>
          ))}
        </InfiniteScroll>
      </div>
    );

}