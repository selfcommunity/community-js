import React from 'react';
import InfiniteScroll from '../index';
type State = {
  data: number[];
};
export default class WindowInfiniteScrollComponent extends React.Component<{}, State> {
  state = {
    data: Array.from({length: 30}, (_, i) => i)
  };

  next = () => {
    setTimeout(() => {
      const currentLength = this.state.data.length;
      const newData = [...this.state.data, ...Array.from({length: 5}, (_, i) => i).map((i) => i + currentLength)];
      this.setState({data: newData});
    }, 500);
  };

  previous = () => {
    setTimeout(() => {
      const currentLength = this.state.data[0];
      const newData = [
        ...Array.from({length: 5}, (_, i) => i)
          .map((i) => i * -1 + currentLength - 1)
          .reverse(),
        ...this.state.data
      ];
      this.setState({data: newData});
    }, 500);
  };

  render() {
    return (
      <>
        <InfiniteScroll
          hasMoreNext={true}
          next={this.next}
          hasMorePrevious={true}
          previous={this.previous}
          loaderNext={<h1>Loading next...</h1>}
          loaderPrevious={<h1>Loading prev...</h1>}
          dataLength={this.state.data.length}
          scrollThreshold={1}>
          {this.state.data.map((e) => (
            <div key={e} style={{height: 200, margin: 4, border: '1px solid hotpink'}}>
              #{e} row
            </div>
          ))}
        </InfiniteScroll>
      </>
    );
  }
}
