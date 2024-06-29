import {
  View,
  Text,
  SafeAreaView,
  Image,
  ScrollView,
  useWindowDimensions,
  ImageBackground,
  TouchableOpacity,
  StatusBar,
} from 'react-native';
import React, {useEffect, useRef, useState} from 'react';
import {Searchbar} from 'react-native-paper';
import Row from './Row';
import {
  comedy_movies,
  horror_movies,
  romance_movies,
  scifi_movies,
  upcoming_movies,
} from '../../APIS/API/MoviesApi';
import {useQuery} from 'react-query';
import MovieBanner from './MovieBanner';
import SkeletonLoading from '../../ReusableComponents/SkeletonLoading';

const Movie = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [upcoming, setUpcoming] = useState([]);
  const [scifi, setScifi] = useState([]);
  const [comedy, setComedy] = useState([]);
  const [horror, setHorror] = useState([]);
  const [romance, setRomance] = useState([]);
  const [loading, setLoading] = useState(false);

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
    <SafeAreaView className="h-full px-2 pb-2 bg-[#272728]">
      <StatusBar
        translucent
        backgroundColor="transparent"
        // barStyle="light-content"
      />
      {loading ? (
        <SkeletonLoading />
      ) : (
        <>
          <View className="justify-between py-6  flex-row">
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
              className="h-[53px]"
              placeholder="Search"
              onChangeText={setSearchQuery}
              value={searchQuery}
            />
          </View>
        </>
      )}

      <View className="py-3">
        <MovieBanner />
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
