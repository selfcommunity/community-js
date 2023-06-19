import {useState} from 'react';
import {render} from 'react-dom';
import InfiniteScroll from '../index';

const style = {
  height: 30,
  border: '1px solid green',
  margin: 6,
  padding: 8
};

export default function PullDownToRefreshInfScroll() {
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
      <h1>demo: Pull down to refresh</h1>
      <hr />
      <InfiniteScroll
        dataLength={items.length}
        hasMoreNext={true}
        next={fetchMoreData}
        loaderNext={<h4>Loading...</h4>}
        pullDownToRefresh
        pullDownToRefreshContent={<h3 style={{textAlign: 'center'}}>&#8595; Pull down to refresh</h3>}
        releaseToRefreshContent={<h3 style={{textAlign: 'center'}}>&#8593; Release to refresh</h3>}
        refreshFunction={fetchMoreData}>
        {items.map((_, index) => (
          <div style={style} key={index}>
            div - #{index}
          </div>
        ))}
      </InfiniteScroll>
    </div>
  );

}
