import {
  View,
  Text,
  ScrollView,
  Image,
  StatusBar,
  TouchableOpacity,
  Alert,
  BackHandler,
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
import {movies_videos, single_movies} from '../../APIS/API/MoviesApi';
import {IMAGE_URL} from '../../../config';
import {
  ArrowsPointingOutIcon,
  PlayIcon,
  XMarkIcon,
} from 'react-native-heroicons/solid';
import Video from 'react-native-video';
import Orientation from 'react-native-orientation-locker';
import {ActivityIndicator} from 'react-native-paper';
import {overFlow} from '../../utils/utils';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import YoutubePlayer from 'react-native-youtube-iframe';

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
    // Show alert dialog when back button is pressed
    Alert.alert(
      'Go back',
      'Are you sure you want to Exit?',
      [
        {text: 'Cancel', style: 'cancel'},
        {
          text: 'OK',
          onPress: () => {
            Orientation.lockToPortrait();
            navigation.goBack();
          },
        },
      ],
      {cancelable: false},
    );
    // Return true to prevent the default back button action
    return true;
  }, [navigation]);

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

  return (
    <ScrollView className="bg-black">
      <StatusBar hidden />
      {showVideo ? (
        <View className={`${fullScreen && 'h-full'} h-[500px] relative`}>
          {/* <Video
            style={{height: fullScreen ? '100%' : 400, width: '100%'}}
            source={{
              uri: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
            }}
            resizeMode="cover"
            onLoadStart={onLoadStart}
            onLoad={onLoad}
            onError={onError}
            controls
          /> */}

          {loading ? (
            <ActivityIndicator
              className="absolute top-[40%] left-[50%]"
              size="large"
              animating={true}
              color="red"
            />
          ) : (
            <YoutubePlayer
              height={500}
              play={playing}
              videoId={videos?.trailer?.youtube_video_id}
              onFullScreenChange={handleOrientationChange}
              onChangeState={onStateChange}
            />
          )}

          {/* <>
            <TouchableOpacity
              onPress={() => setShowVideo(false)}
              className="absolute right-0 p-2">
              <XMarkIcon size={25} color="red" onPress={handleVideo} />
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => setShowVideo(false)}
              className="absolute bottom-24 p-2 right-0">
              <ArrowsPointingOutIcon
                className="bg-red-200"
                size={25}
                color="white"
                onPress={handleOrientationChange}
              />
            </TouchableOpacity>
          </> */}
        </View>
      ) : (
        <View>
          <View className="h-80 relative ">
            <Image
              source={{uri: `${IMAGE_URL}/${movies?.backdrop_path}`}}
              className="h-80"
              style={{opacity: 0.7}}
            />

            <TouchableOpacity
              onPress={() => {
                setShowVideo(true);
              }} // Set showVideo state to true when button is clicked
              style={{backgroundColor: 'rgba(255,255,255,0.3)'}}
              className="rounded-l-full absolute bottom-32 p-2 right-0">
              <View className="flex-row items-center space-x-1">
                <View className="bg-white rounded-full p-1">
                  <PlayIcon size={22} color="red" />
                </View>
                <Text className="text-white">Watch Trailer</Text>
              </View>
            </TouchableOpacity>

            <View
              className=" absolute bottom-0 w-full p-4 "
              style={{backgroundColor: 'rgba(255,255,255,0.2)'}}>
              <Text className="font-bold text-center text-white text-lg tracking-widest">
                {movies?.title}
              </Text>
              <Text className="font-light text-center text-white text-base tracking-widest">
                {`${movies?.original_language} | ${names} | ${movies?.runtime} m`}
              </Text>
            </View>
          </View>
          <View className="mt-1 p-2">
            <Text className="text-white font-bold text-lg tracking-widest">
              Story Line
            </Text>
            <Text className="text-white tracking-wide text-base text-justify leading-[22px]">
              {overFlow(movies?.overview, 150)}
            </Text>
          </View>
        </View>
      )}
    </ScrollView>
  );
};

export default MovieDetail;
