import {
  View,
  Text,
  SafeAreaView,
  Image,
  ScrollView,
  useWindowDimensions,
  ImageBackground,
  TouchableOpacity,
} from 'react-native';
import React, {useEffect, useRef, useState} from 'react';
import {Searchbar} from 'react-native-paper';
import Row from './Row';
import {
  comedy_movies,
  horror_movies,
  romance_movies,
  scifi_movies,
  trending_movies,
  upcoming_movies,
} from '../../APIS/API/MoviesApi';
import {useQuery} from 'react-query';
import Video from 'react-native-video';
import {IMAGE_URL} from '../../../config';
import {PlayIcon, StarIcon} from 'react-native-heroicons/solid';

const Movie = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [upcoming, setUpcoming] = useState([]);
  const [scifi, setScifi] = useState([]);
  const [comedy, setComedy] = useState([]);
  const [horror, setHorror] = useState([]);
  const [romance, setRomance] = useState([]);
  const [banner, setBanner] = useState<any>();

  //upcoming movies
  const movies = useQuery(['upcoming'], async () => upcoming_movies(), {
    onSettled: data => setUpcoming(data?.movies),
  });

  //scifi
  const scifiMovies = useQuery(['scifi'], async () => scifi_movies(), {
    onSettled: data => setScifi(data?.movies),
  });

  //comedy
  const comedyMovies = useQuery(['comedy'], async () => comedy_movies(), {
    onSettled: data => setComedy(data?.movies),
  });

  //horror
  const horrorMovies = useQuery(['horror'], async () => horror_movies(), {
    onSettled: data => setHorror(data?.movies),
  });

  //romance
  const romanceMovies = useQuery(['romance'], async () => romance_movies(), {
    onSettled: data => setRomance(data?.movies),
  });

  //set banner images
  const bannerMovies = useQuery(['romance'], async () => trending_movies(), {
    onSettled: data =>
      setBanner(
        data?.movies[Math.floor(Math.random() * data?.movies.length - 1)],
      ),
  });

  return (
    <SafeAreaView className="h-full px-2 pb-2 bg-[#0F111D]">
      <View className="justify-between py-3  flex-row">
        <View>
          <Text className="text-[20px] tracking-wider text-white font-bold">
            Hello Sworup
          </Text>
          <Text className="font-light text-white tracking-tight">
            What to Watch?
          </Text>
        </View>

        <View>
          <Image
            source={{
              uri: 'https://img.freepik.com/premium-vector/beard-man-logo_671039-606.jpg',
            }}
            style={{width: 50, height: 50, borderRadius: 50}}
          />
        </View>
      </View>

      <View className="py-3">
        <Searchbar
          placeholder="Search"
          onChangeText={setSearchQuery}
          value={searchQuery}
        />
      </View>

      <View
        className="relative"
        style={{height: 200, borderRadius: 20, overflow: 'hidden'}}>
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
          style={{flex: 1}}
        />
        <View className="bottom-4 p-3 absolute">
          <Text className="text-white  text-base ">
            {banner?.title || banner?.original_title}
          </Text>
          <View className="flex-row items-center space-x-1">
            <StarIcon size={25} color="yellow" />
            <Text className="text-white text-base">4.5</Text>
          </View>
        </View>

        <TouchableOpacity className="absolute bg-white bottom-5  rounded-full p-2  right-3">
          <PlayIcon
            size={25}
            color="red"
            style={{backgroundColor: 'white', borderRadius: 50}}
          />
        </TouchableOpacity>
      </View>

      <ScrollView>
        <Row title="Upcoming" movies={upcoming} />

        <Row title="Sci-Fi" movies={scifi} />

        <Row title="Horror" movies={horror} />

        <Row title="Comedy" movies={comedy} />

        <Row title="Animation" movies={romance} />
      </ScrollView>
    </SafeAreaView>
  );
};

export default Movie;
