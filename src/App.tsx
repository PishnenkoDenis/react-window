import axios from "axios";
import React from "react";
import AutoSizer from "react-virtualized-auto-sizer";
import { FixedSizeList as List } from "react-window";
import InfiniteLoader from "react-window-infinite-loader";
import "./App.css";

interface IPhoto {
  albumId: number;
  id: number;
  title: string;
  url: string;
  thumbnailUrl: string;
}

type Props = {
  height: number;
  width: number;
};

const photos: IPhoto[] | [] = [];
const requestCache: Record<string, any> = {};
const BASE_URL = "https://jsonplaceholder.typicode.com/photos";

const isItemLoaded = (id: number) => !!photos[id];

//ф-ия для отображения эл-ов при скролле.Принимет индекс первого и последнего
//видимых эл-ов
const loadMoreItems = async (startIndex: number, stopIndex: number) => {
  console.log("load");
  const key = [startIndex, stopIndex].join(":"); //0:10

  if (requestCache[key]) {
    return;
  }

  const length = stopIndex - startIndex;
  const visibleRange = [...Array(length).keys()].map((x) => x + startIndex);
  const itemsLoaded = visibleRange.every((index) => !!photos[index]);

  if (itemsLoaded) {
    requestCache[key] = key;
    return;
  }

  try {
    const res = (await axios.get<IPhoto[]>(BASE_URL)).data;
    res.forEach((photo, index) => (photos[index + startIndex] = photo));
    console.log(res);
  } catch (error) {
    console.log(error);
  }
};

const Photo = ({ index, style }: { index: any; style: any }) => {
  console.log("photo");
  const item = photos[index];
  const { title, url } = item;
  return (
    <div style={style}>
      <h3>{item ? title : ""}</h3>
      <a href={url}>Photo ref</a>
    </div>
  );
};

function App() {
  return (
    <AutoSizer>
      {({ height, width }: Props) => (
        <InfiniteLoader
          isItemLoaded={isItemLoaded}
          loadMoreItems={loadMoreItems}
          itemCount={2000}
        >
          {({ onItemsRendered, ref }) => (
            <List
              className="list-container"
              itemCount={2000}
              itemSize={35}
              width={width}
              height={height}
              ref={ref}
              onItemsRendered={onItemsRendered}
            >
              {Photo}
            </List>
          )}
        </InfiniteLoader>
      )}
    </AutoSizer>
  );
}

export default App;
