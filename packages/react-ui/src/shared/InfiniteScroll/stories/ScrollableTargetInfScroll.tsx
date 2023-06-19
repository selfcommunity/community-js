import {useState} from 'react';
import InfiniteScroll from '../index';

const style = {
  height: 30,
  border: '1px solid green',
  margin: 6,
  padding: 8
};

export default function ScrollableTargetInfScroll() {
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
        <h1>demo: Infinite Scroll with scrollable target</h1>
        <hr />
        <div id="scrollableDiv" style={{height: 300, overflow: 'auto'}}>
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
