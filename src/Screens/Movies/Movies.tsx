import {View, Text} from 'react-native';
import React from 'react';
import Movie from '../../Components/Movies/Movie';
import {useQuery} from 'react-query';
import {upcoming_movies} from '../../APIS/API/MoviesApi';

const Movies = () => {
  return <Movie />;
};

export default Movies;
