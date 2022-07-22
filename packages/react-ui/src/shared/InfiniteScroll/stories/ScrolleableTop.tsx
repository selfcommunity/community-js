import React from 'react';
import {render} from 'react-dom';
import InfiniteScroll from '../index';

const style = {
  height: 30,
  border: '1px solid green',
  margin: 6,
  padding: 8
};

export default class App extends React.Component {
  state = {
    items: Array.from({length: 20})
  };

  fetchMoreData = () => {
    // a fake async api call like which sends
    // 20 more records in 1.5 secs
    setTimeout(() => {
      this.setState({
        items: this.state.items.concat(Array.from({length: 20}))
      });
    }, 500);
  };

  render() {
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
            dataLength={this.state.items.length}
            previous={this.fetchMoreData}
            hasMorePrevious={true}
            loaderPrevious={<h4>Loading prev...</h4>}
            scrollableTarget="scrollableDiv"
            scrollThreshold={'0px'}>
            {this.state.items.map((_, index) => (
              <div style={style} key={index}>
                div - #{index}
              </div>
            ))}
          </InfiniteScroll>
        </div>
      </div>
    );
  }
}

render(<App />, document.getElementById('root'));
