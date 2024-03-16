import {
  View,
  Text,
  ScrollView,
  Image,
  StatusBar,
  TouchableOpacity,
  Alert,
  BackHandler,
  FlatList,
  SafeAreaView,
} from 'react-native';
import React, {useCallback, useState} from 'react';
import {
  ParamListBase,
  RouteProp,
  useFocusEffect,
  useNavigation,
  useRoute,
} from '@react-navigation/native';
import {useQuery} from 'react-query';
import {
  movies_cast,
  movies_videos,
  single_movies,
} from '../../APIS/API/MoviesApi';
import {IMAGE_URL} from '../../../config';
import {
  ArrowsPointingOutIcon,
  PlayIcon,
  XMarkIcon,
} from 'react-native-heroicons/solid';
import Video from 'react-native-video';
import Orientation from 'react-native-orientation-locker';
import {ActivityIndicator, Button, Snackbar} from 'react-native-paper';
import {overFlow} from '../../utils/utils';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import YoutubePlayer from 'react-native-youtube-iframe';
import {StarIcon} from 'react-native-heroicons/solid';

type RootStackParamList = {
  movieDetailID: {movieId?: number};
};
const MovieDetail = () => {
  const [fullScreen, setFullScreen] = useState<boolean>(false);
  const [movies, setMovies] = useState<any>();
  const [loading, setLoading] = useState(false);
  const [showVideo, setShowVideo] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [videos, setVideos] = useState<any>();
  const [cast, setCast] = useState<any>();
  const [snackbarVisible, setSnackbarVisible] = useState(false);
  const [backPressedOnce, setBackPressedOnce] = useState(false);

  const route = useRoute<RouteProp<RootStackParamList, 'movieDetailID'>>();
  const {movieId} = route.params;

  const navigation = useNavigation<NativeStackNavigationProp<ParamListBase>>();

  const singleMovies = useQuery(
    ['movieDetails', movieId],
    async () => single_movies(movieId as number),
    {
      onSettled: data => setMovies(data?.movies),
    },
  );

  const genres = movies?.genres?.map(
    (genre: {id: number; name: string}) => genre.name,
  );

  const names = genres?.slice(0, 3).join(', ');

  const moviesVideos = useQuery(
    ['movieVideo', movieId],
    async () => movies_videos(movieId as number),
    {
      onSettled: data => setVideos(data?.movies),
      // enabled: !movieId,
    },
  );

  const getCasts = useQuery(
    ['movieCasts', movieId],
    async () => movies_cast(movieId as number),
    {
      onSettled: data => setCast(data?.casts),
      // enabled: !movieId,
    },
  );

  console.log(cast?.profile_path);

  const handleOrientationChange = () => {
    if (fullScreen) {
      Orientation.lockToPortrait();
    } else {
      Orientation.lockToLandscape();
    }
    setFullScreen(!fullScreen);
  };

  const handleBackPress = useCallback(() => {
    if (backPressedOnce) {
      // If back button is pressed twice within a certain time frame, navigate back
      navigation.goBack();
      return true;
    }

    // Show Snackbar when back button is pressed
    setSnackbarVisible(true);

    setBackPressedOnce(true);
    setTimeout(() => setBackPressedOnce(false), 2000);

    // Return true to prevent the default back button action
    return true;
  }, [navigation, backPressedOnce]);

  useFocusEffect(
    useCallback(() => {
      BackHandler.addEventListener('hardwareBackPress', handleBackPress);
      return () => {
        BackHandler.removeEventListener('hardwareBackPress', handleBackPress);
      };
    }, [handleBackPress]),
  );

  const onStateChange = useCallback((state: any) => {
    if (state === 'ended') {
      setPlaying(false);
      Alert.alert('video has finished playing!');
    }
  }, []);

  //cast item for flat list
  const CastItem = React.memo(({item}: any) => (
    <View className="flex-row  space-x-1 mt-1 items-center">
      <Image
        source={{
          // uri: 'https://marketplace.canva.com/EAFltPVX5QA/1/0/800w/canva-cute-cartoon-anime-girl-avatar-D4brQth3b2I.jpg',
          uri: `${IMAGE_URL}${item?.profile_path}`,
        }}
        className="h-20 w-20 rounded-full"
      />
      <View className="p-4">
        <Text className="text-[#cbc9c9] text-base">Actor</Text>
        <Text className="text-[#cbc9c9] text-lg font-bold tracking-wider">
          {item?.name}
        </Text>
      </View>
    </View>
  ));

  return (
    <SafeAreaView>
      <ScrollView className="bg-[#272728]  h-full">
        <StatusBar hidden />
        {showVideo ? (
          <View className={`${fullScreen && 'h-full'} h-full relative`}>
            {loading ? (
              <ActivityIndicator
                className="absolute top-[40%] left-[50%]"
                size="large"
                animating={true}
                color="red"
              />
            ) : (
              <View className="h-screen">
                <StatusBar />
                <YoutubePlayer
                  height={500}
                  play={playing}
                  videoId={videos?.trailer?.youtube_video_id}
                  onFullScreenChange={handleOrientationChange}
                  onChangeState={onStateChange}
                />
                <View className="flex-1 justify-between">
                  <Snackbar
                    className="bg-[#cbc9c9]"
                    visible={snackbarVisible}
                    onDismiss={() => setSnackbarVisible(false)}
                    duration={3000} // 3 seconds
                    action={{
                      label: 'go back',
                      textColor: 'black',
                      onPress: () => {
                        setSnackbarVisible(false);
                        handleBackPress(); // Call handleBackPress again to navigate back
                      },
                    }}>
                    <Text className="text-black">Press again to go back</Text>
                  </Snackbar>
                </View>
              </View>
            )}
          </View>
        ) : (
          <View className="h-full">
            <View className="h-[410px] relative ">
              <Image
                source={{uri: `${IMAGE_URL}/${movies?.poster_path}`}}
                className="h-[410px]"
                style={{opacity: 0.7}}
              />

              <TouchableOpacity
                onPress={() => {
                  setShowVideo(true);
                }} // Set showVideo state to true when button is clicked
                style={{backgroundColor: 'rgba(0,0,0,0.3)'}}
                className="rounded-l-full absolute bottom-36 p-2 right-0">
                <View className="flex-row items-center space-x-1">
                  <View className="bg-white rounded-full p-1">
                    <PlayIcon size={22} color="red" />
                  </View>
                  <Text className="text-white">Watch Trailer</Text>
                </View>
              </TouchableOpacity>
            </View>

            <View className="flex-row items-center space-x-2 p-2 mt-1">
              <View className="flex-row space-x-1">
                <StarIcon size={22} color="yellow" />
                <Text className="text-white">8.3</Text>
              </View>
              <Button className="bg-[#E6AD18] rounded-md">
                <Text className="text-[#343333]">IMDB 7.5</Text>
              </Button>
            </View>

            <View className="p-2 flex-row space-x-5 mt-1">
              <Text className="text-[#cbc9c9] font-light">{names}</Text>
              <Text className="text-[#cbc9c9] font-light">
                {movies?.runtime} m
              </Text>
            </View>

            <View className="mt-1 p-2">
              <Text className="text-[#cbc9c9] font-bold text-lg tracking-widest">
                Story Line
              </Text>
              <Text className="text-[#cbc9c9] font-light mt-2 tracking-wide text-sm text-justify leading-[22px]">
                {overFlow(movies?.overview, 350)}
              </Text>
              <View className="mt-1 p-2">
                <Text className="text-[#cbc9c9] font-bold text-lg tracking-widest">
                  Star cast
                </Text>
                <FlatList
                  horizontal
                  data={cast}
                  keyExtractor={item => item.id.toString()}
                  renderItem={({item}) => <CastItem item={item} />}
                  contentContainerStyle={{marginTop: 5, marginLeft: 2}} // Adjust spacing as needed
                />
              </View>
            </View>
            <View className="flex-1 justify-between">
              <Snackbar
                className="bg-[#cbc9c9]"
                visible={snackbarVisible}
                onDismiss={() => setSnackbarVisible(false)}
                duration={1000} // 1 seconds
                action={{
                  label: 'go back',
                  textColor: 'black',
                  onPress: () => {
                    setSnackbarVisible(false);
                    handleBackPress(); // Call handleBackPress again to navigate back
                  },
                }}>
                <Text className="text-black">Press again to go back</Text>
              </Snackbar>
            </View>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

export default MovieDetail;
