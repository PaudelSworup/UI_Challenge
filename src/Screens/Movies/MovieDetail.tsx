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
  recommended_movies,
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
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';
import navigationStrings from '../../Contstants/navigationStrings';

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
  const [recommended, setRecommended] = useState<any>();

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

  const recommendedMovies = useQuery(
    ['recommended', movieId],
    async () => recommended_movies(movieId as number),
    {
      onSettled: data => setRecommended(data?.movies),
    },
  );

  // console.log(movies);

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
        className="rounded-full"
        style={{height: hp(10), width: wp(20)}}
      />
      <View className="p-4">
        <Text className="text-[#cbc9c9]" style={{fontSize: hp(2)}}>
          Actor
        </Text>
        <Text
          className="text-[#cbc9c9]  font-bold tracking-wider"
          style={{fontSize: hp(2.5)}}>
          {item?.name}
        </Text>
      </View>
    </View>
  ));

  const RecommendedItems = React.memo(({item}: any) => (
    <View
      className="relative"
      style={{
        borderRadius: 20,
        marginRight: 10,
      }}>
      <TouchableOpacity
        onPress={() =>
          navigation.replace(navigationStrings.DETAIL, {movieId: item?.id})
        }>
        <Image
          source={{
            uri: item
              ? `${IMAGE_URL}/${item.backdrop_path}`
              : 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ8JrNcJV0PaRPCm3vBRGmxdAE1B993db_Xig',
          }}
          // style={{height: 160, width: 250, borderRadius: 20}}
          style={{height: hp(20), borderRadius: 10, marginTop: 10}}
        />
      </TouchableOpacity>
      <View
        className="absolute bottom-0 h-[70px] p-2  w-full "
        style={{
          backgroundColor: 'rgba(255,255,255,0.2)',
          borderBottomLeftRadius: 20,
        }}>
        <Text className="text-white font-bold text-base tracking-wide ">
          {overFlow(item?.title, 25)}
        </Text>
        <View className="flex-row items-center space-x-1">
          <StarIcon size={22} color="yellow" />
          <Text className="text-white text-base">
            {item?.vote_average.toFixed(1)}
          </Text>
        </View>
      </View>
    </View>
  ));

  if (moviesVideos?.isLoading) {
    return (
      <View
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          justifyContent: 'center',
          alignItems: 'center',
        }}>
        <ActivityIndicator size="large" animating={true} color="#0000ff" />
      </View>
    );
  }

  return (
    <SafeAreaView>
      <StatusBar
        translucent
        backgroundColor="transparent"
        barStyle="light-content"
      />
      {showVideo ? (
        <View className="relative bg-[#272728]" style={{height: hp(100)}}>
          {/* {loading ? (
              <ActivityIndicator
                className="absolute top-[40%] left-[50%]"
                size="large"
                animating={true}
                color="red"
              />
            ) : ( */}
          <View className="h-screen">
            <View className=" h-screen ">
              <StatusBar />

              <YoutubePlayer
                height={250}
                play={playing}
                videoId={videos?.trailer?.youtube_video_id}
                onFullScreenChange={handleOrientationChange}
                onChangeState={onStateChange}
              />

              <Text
                className="p-2 text-white font-bold"
                style={{fontSize: hp(3)}}>
                Recommended for you
              </Text>

              <FlatList
                showsVerticalScrollIndicator
                data={recommended}
                keyExtractor={item => item.id.toString()}
                renderItem={({item}) => <RecommendedItems item={item} />}
                contentContainerStyle={{marginTop: 5, marginLeft: 2}} // Adjust spacing as needed
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
          </View>
          {/* )} */}
        </View>
      ) : (
        <ScrollView className="bg-[#272728]  h-full">
          <View className="h-full">
            <View className="relative" style={{height: hp(60)}}>
              <Image
                source={{uri: `${IMAGE_URL}/${movies?.poster_path}`}}
                style={{opacity: 0.7, height: hp(60)}}
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
              <Text
                className="text-[#cbc9c9] font-light"
                style={{fontSize: hp(1.8)}}>
                {names}
              </Text>
              <Text
                className="text-[#cbc9c9] font-light"
                style={{fontSize: hp(1.8)}}>
                {movies?.runtime} m
              </Text>
            </View>

            <View className="mt-1 p-2">
              <Text
                className="text-[#cbc9c9] font-bold  tracking-widest"
                style={{fontSize: hp(3)}}>
                Story Line
              </Text>
              <Text
                className="text-[#cbc9c9] font-light mt-2 tracking-wide text-sm text-justify leading-[22px]"
                style={{fontSize: hp(1.69)}}>
                {overFlow(movies?.overview, 350)}
              </Text>
              <View className="mt-1 p-2">
                <Text
                  className="text-[#cbc9c9] font-bold  tracking-widest"
                  style={{fontSize: hp(3)}}>
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
        </ScrollView>
      )}
    </SafeAreaView>
  );
};

export default MovieDetail;
