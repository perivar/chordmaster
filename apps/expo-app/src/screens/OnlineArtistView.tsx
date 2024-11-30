import { FunctionComponent, useEffect, useState } from "react";

import { RouteProp } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { FlashList } from "@shopify/flash-list";

import ListItem from "../components/ListItem";
import LoadingIndicator from "../components/LoadingIndicator";

import { RootStackParamList } from "../types/types";
import { getService } from "../services";
import { SongDoc } from "../services/BaseService";

type OnlineArtistViewScreenRouteProp = RouteProp<
  RootStackParamList,
  "OnlineArtistView"
>;
type OnlineArtistViewScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  "OnlineArtistView"
>;
type Props = {
  route: OnlineArtistViewScreenRouteProp;
  navigation: OnlineArtistViewScreenNavigationProp;
};

const OnlineArtistView: FunctionComponent<Props> = (props: Props) => {
  const { navigation } = props;

  const [songs, setSongs] = useState<SongDoc[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const serviceName = props.route.params.serviceName;
  const path = props.route.params.path;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const docs = await getService(serviceName)!.getArtistSongs(path);
        setSongs(docs);
        setIsLoading(false);
      } catch (e) {
        if (e instanceof Error) {
          setError(e.message);
          setIsLoading(false);
        } else {
          throw e;
        }
      }
    };
    fetchData();
  }, []);

  const onSelectSong = (p: string, name: string) => {
    navigation.navigate("SongPreview", { path: p, serviceName: name });
  };

  return (
    <FlashList
      keyExtractor={item => item.path}
      data={songs}
      estimatedItemSize={songs.length || 1}
      ListHeaderComponent={
        <LoadingIndicator error={error} loading={isLoading} />
      }
      renderItem={({ item }) => {
        return (
          <ListItem
            title={item.title}
            onPress={() => onSelectSong(item.path, serviceName)}
          />
        );
      }}
    />
  );
};

export default OnlineArtistView;
