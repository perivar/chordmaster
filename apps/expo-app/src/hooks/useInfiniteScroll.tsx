import React, { useCallback, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  ListRenderItem,
  View,
} from "react-native";

import { DocumentData, QueryDocumentSnapshot } from "firebase/firestore";

import { useTheme } from "../hooks/useTheme";
import { ListEmptyComponent as DefaultListEmptyComponent } from "../components/ListEmptyComponent";

import { SIZES } from "../constants/theme";

export interface InfiniteListProps<ItemT> {
  loadData: () => void;
  refreshData: () => void;

  // The following properties are all taken from FlatListProps

  /**
   * For simplicity, data is just a plain array. If you want to use something else,
   * like an immutable list, use the underlying VirtualizedList directly.
   */
  data: readonly ItemT[] | null | undefined;

  /**
   * Renderer for every item in every section. Can be over-ridden on a per-section basis.
   */
  renderItem: ListRenderItem<ItemT> | null | undefined;

  /**
   * Used to extract a unique key for a given item at the specified index. Key is used for caching
   * and as the react key to track item re-ordering. The default extractor checks `item.key`, then
   * falls back to using the index, like React does.
   */
  keyExtractor?: ((item: ItemT, index: number) => string) | undefined;

  /**
   * Rendered when the list is empty.
   */
  ListEmptyComponent?:
    | React.ComponentType<unknown>
    | React.ReactElement
    | null
    | undefined;

  /**
   * Rendered at the very end of the list.
   */
  ListFooterComponent?:
    | React.ComponentType<unknown>
    | React.ReactElement
    | null
    | undefined;

  /**
   * Rendered at the very beginning of the list.
   */
  ListHeaderComponent?:
    | React.ComponentType<unknown>
    | React.ReactElement
    | null
    | undefined;
}

export type UseInfiniteScrollHookResult<ItemT> = {
  isLoading: boolean;
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>;
  isRefreshing: boolean;
  setIsRefreshing: React.Dispatch<React.SetStateAction<boolean>>;
  lastVisible: QueryDocumentSnapshot<DocumentData> | undefined;
  setLastVisible: React.Dispatch<
    React.SetStateAction<QueryDocumentSnapshot<DocumentData> | undefined>
  >;
  InfiniteList: (props: InfiniteListProps<ItemT>) => JSX.Element;
};

export type UseInfiniteScrollHookArgs = {
  emptyMessage?: string;
  initialNumToRender?: number;
  limitCount?: number;
};

const useInfiniteScroll = <ItemT extends {}>({
  // to force using objects with id use this: extends { id?: string }
  emptyMessage = "Nothing found ...",
  initialNumToRender = 10,
  limitCount = 20,
}: Partial<UseInfiniteScrollHookArgs> = {}): UseInfiniteScrollHookResult<ItemT> => {
  const { theme } = useTheme();
  const { colors } = theme;

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);
  const [lastVisible, setLastVisible] = useState<
    QueryDocumentSnapshot<DocumentData> | undefined
  >();

  // to avoid onEndReached being called multiple times
  const [
    onEndReachedCalledDuringMomentum,
    setOnEndReachedCalledDuringMomentum,
  ] = useState(false);

  const renderFooter = () => {
    if (!isLoading || !isRefreshing) return null;

    return (
      <View className="flex-1 items-center justify-center">
        <ActivityIndicator size="large" />
      </View>
    );
  };

  const InfiniteList = useCallback(
    function InfiniteList({
      data,
      loadData,
      refreshData,
      renderItem,
      keyExtractor,
      ListEmptyComponent,
      ListFooterComponent,
      ListHeaderComponent,
    }: InfiniteListProps<ItemT>): JSX.Element {
      return (
        <View
          style={{
            flex: 1,
            backgroundColor: colors.background,
          }}>
          <FlatList
            // padding below the list to make sure the last item is shown
            contentContainerStyle={{ paddingBottom: 60 }}
            data={data}
            renderItem={renderItem}
            keyExtractor={keyExtractor}
            ListEmptyComponent={
              ListEmptyComponent
                ? ListEmptyComponent
                : DefaultListEmptyComponent({
                    emptyMessage: emptyMessage,
                    containerStyle: { paddingTop: SIZES.padding },
                  })
            }
            ListHeaderComponent={ListHeaderComponent}
            ListFooterComponent={
              ListFooterComponent ? ListFooterComponent : renderFooter
            }
            onRefresh={loadData}
            onMomentumScrollBegin={() =>
              setOnEndReachedCalledDuringMomentum(false)
            }
            onEndReached={(
              {
                // distanceFromEnd
              }
            ) => {
              // console.log(
              //   `On end reached distance: ${distanceFromEnd}, onMomentumScrollBegin: ${onEndReachedCalledDuringMomentum}`
              // );
              // console.log('listData length', listData.length);
              // if (distanceFromEnd < 0) return;
              // if (!lastVisible) return;
              // to avoid onEndReached being called multiple times
              if (!onEndReachedCalledDuringMomentum) {
                refreshData();
                setOnEndReachedCalledDuringMomentum(true);
              }
            }}
            // How Close To The End Of List Until Next Data Request Is Made
            onEndReachedThreshold={0.5}
            // Refreshing (Set To True When End Reached)
            refreshing={isRefreshing}
            initialNumToRender={initialNumToRender}
            maxToRenderPerBatch={limitCount}
          />
        </View>
      );
    },
    [theme]
  );

  return {
    /**
     * Render the InfiniteList.
     * Can be added everywhere you like including into portals.
     */
    InfiniteList,

    // the underlying state variables can also be used
    isLoading,
    setIsLoading,
    isRefreshing,
    setIsRefreshing,
    lastVisible,
    setLastVisible,
  };
};

export default useInfiniteScroll;
