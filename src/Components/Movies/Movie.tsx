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
import MovieBanner from './MovieBanner';

const Movie = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [upcoming, setUpcoming] = useState([]);
  const [scifi, setScifi] = useState([]);
  const [comedy, setComedy] = useState([]);
  const [horror, setHorror] = useState([]);
  const [romance, setRomance] = useState([]);

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

      <MovieBanner />

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
