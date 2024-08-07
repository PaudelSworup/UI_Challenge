import {View, Text, ImageBackground, TouchableOpacity} from 'react-native';
import React, {useState} from 'react';
import {IMAGE_URL} from '../../../config';
import {PlayIcon, StarIcon, XMarkIcon} from 'react-native-heroicons/solid';
import {useQuery} from 'react-query';
import {movies_videos, trending_movies} from '../../APIS/API/MoviesApi';
import YoutubePlayer from 'react-native-youtube-iframe';
import SkeletonBanner from '../../ReusableComponents/SkeletonBanner';
import {heightPercentageToDP as hp} from 'react-native-responsive-screen';

const MovieBanner = () => {
  const [banner, setBanner] = useState<any>();
  const [play, setPlay] = useState(false);
  const [videos, setVideos] = useState<any>();
  const [loading, setLoading] = useState(true);

  //set banner images
  const bannerMovies = useQuery(['romance'], async () => trending_movies(), {
    onSettled: data =>
      setBanner(
        data?.movies[Math.floor(Math.random() * data?.movies.length - 1)],
      ),
  });

  const moviesVideos = useQuery(
    ['movieVideo', banner?.id],
    async () => movies_videos(banner?.id as number),
    {
      onSettled: data => setVideos(data?.movies),
      enabled: !!banner?.id,
    },
  );

  const setBannerVideo = () => {
    setPlay(!play);
  };

  // console.log(banner);
  // console.log(videos?.trailer?.youtube_video_id);
  return (
    <>
      {!loading ? (
        <SkeletonBanner />
      ) : (
        <View
          className="relative"
          style={{
            height: hp(30),
            borderRadius: 20,
            overflow: 'hidden',
            // borderColor: 'white',
          }}>
          {play ? (
            <YoutubePlayer
              height={230}
              play={true}
              videoId={videos?.trailer?.youtube_video_id}
            />
          ) : (
            <ImageBackground
              source={{
                uri: `${IMAGE_URL}/${
                  banner && banner?.backdrop_path
                    ? banner?.backdrop_path
                    : banner?.poster_path
                }`,
              }}
              imageStyle={{opacity: 0.9}}
              blurRadius={2}
              style={{flex: 1, overflow: 'hidden'}}
            />
          )}

          {!play && (
            <View className="bottom-4 p-3 absolute">
              <Text className="text-white  text-base ">
                {banner?.title || banner?.original_title || banner?.name}
              </Text>
              <View className="flex-row items-center space-x-1">
                <StarIcon size={25} color="yellow" />
                <Text className="text-white text-base">4.5</Text>
              </View>
            </View>
          )}

          <TouchableOpacity
            onPress={setBannerVideo}
            className="absolute bg-white bottom-5  rounded-full p-2  right-3">
            {!play ? (
              <PlayIcon
                size={25}
                color="red"
                style={{backgroundColor: 'white', borderRadius: 50}}
              />
            ) : (
              <XMarkIcon
                size={25}
                color="red"
                style={{backgroundColor: 'white', borderRadius: 50}}
              />
            )}
          </TouchableOpacity>
        </View>
      )}
    </>
  );
};

export default MovieBanner;
