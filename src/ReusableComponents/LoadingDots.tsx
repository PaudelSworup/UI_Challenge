import React, {useEffect, useRef} from 'react';
import {View, Animated, StyleSheet} from 'react-native';

const LoadingDots: React.FC = () => {
  const dot1 = useRef(new Animated.Value(0)).current;
  const dot2 = useRef(new Animated.Value(0)).current;
  const dot3 = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const animateDot = (dot: Animated.Value, delay: number) => {
      Animated.loop(
        Animated.sequence([
          Animated.timing(dot, {
            toValue: 1,
            duration: 300,
            delay: delay,
            useNativeDriver: true,
          }),
          Animated.timing(dot, {
            toValue: 0,
            duration: 300,
            useNativeDriver: true,
          }),
        ]),
      ).start();
    };

    animateDot(dot1, 0);
    animateDot(dot2, 300);
    animateDot(dot3, 600);
  }, [dot1, dot2, dot3]);

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
      <Animated.View style={[styles.dot, {opacity: dot1}]} />
      <Animated.View style={[styles.dot, {opacity: dot2}]} />
      <Animated.View style={[styles.dot, {opacity: dot3}]} />
    </View>
    // <View style={styles.container}>

    // </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  dot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: 'black',
    marginHorizontal: 5,
  },
});

export default LoadingDots;
