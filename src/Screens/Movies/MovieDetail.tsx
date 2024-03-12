import {
  View,
  Text,
  ScrollView,
  Image,
  StatusBar,
  TouchableOpacity,
} from 'react-native';
import React, {useState} from 'react';
import {RouteProp, useRoute} from '@react-navigation/native';
import {useQuery} from 'react-query';
import {single_movies} from '../../APIS/API/MoviesApi';
import {IMAGE_URL} from '../../../config';
import {HeartIcon} from 'react-native-heroicons/outline';
import {Button} from 'react-native-paper';
import {
  ArchiveBoxIcon,
  PlayIcon,
  XMarkIcon,
} from 'react-native-heroicons/outline';
import Video from 'react-native-video';
import Orientation from 'react-native-orientation-locker';

type RootStackParamList = {
  movieDetailID: {movieId?: number};
};
const MovieDetail = () => {
  const [fullScreen, setFullScreen] = useState<boolean>(false);
  const [movies, setMovies] = useState<any>();
  const [showVideo, setShowVideo] = useState(false);
  const route = useRoute<RouteProp<RootStackParamList, 'movieDetailID'>>();
  const {movieId} = route.params;

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

  const handleOrientationChange = () => {
    if (fullScreen) {
      Orientation.lockToPortrait();
    } else {
      Orientation.lockToLandscape();
    }
    setFullScreen(!fullScreen);
  };

  const handleVideo = () => {
    Orientation.lockToPortrait();
    setShowVideo(false);
  };

  return (
    <ScrollView className="bg-black">
      <View className="h-80 ">
        <StatusBar hidden />
        {showVideo ? ( // Render video player if showVideo state is true
          <View
            style={{
              height: fullScreen ? '100%' : 300,
              width: '100%',
              padding: 10,
            }}>
            <Video
              style={{height: fullScreen ? '100%' : 300}}
              source={{
                uri: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
              }}
              resizeMode="contain"
              controls
            />
            <TouchableOpacity
              onPress={() => setShowVideo(false)}
              style={{position: 'absolute', top: 20, right: 20}}>
              <XMarkIcon size={25} color="white" onPress={handleVideo} />
              <ArchiveBoxIcon
                size={25}
                color="white"
                onPress={handleOrientationChange}
              />
            </TouchableOpacity>
          </View>
        ) : (
          <>
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
              className="rounded-l-full bottom-40 p-2 absolute  right-0">
              <View className="flex-row items-center space-x-1">
                <View className="bg-white rounded-full p-1">
                  <PlayIcon size={22} color="red" />
                </View>
                <Text className="text-white">Watch Trailer</Text>
              </View>
            </TouchableOpacity>

            <View
              className="bottom-24 p-4 w-full h-full "
              style={{backgroundColor: 'rgba(255,255,255,0.2)'}}>
              <Text className="font-bold text-center text-white text-lg tracking-widest">
                {movies?.title}
              </Text>
              <Text className="font-light text-center text-white text-base tracking-widest">
                {`${movies?.original_language} | ${names} | ${movies?.runtime} m`}
              </Text>
            </View>
          </>
        )}
      </View>
    </ScrollView>
  );
};

export default MovieDetail;
