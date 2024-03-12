import {View, Text, SafeAreaView, ScrollView, Image} from 'react-native';
import React from 'react';
import {
  CalendarIcon,
  DocumentTextIcon,
  StarIcon,
} from 'react-native-heroicons/outline';
import {Divider} from 'react-native-paper';

const Home = () => {
  return (
    <SafeAreaView>
      <View className="bg-orange-400 h-full ">
        <View className="justify-between p-2 flex-row items-center">
          <View>
            <Text className="text-white tracking-wider text-[18px]">
              Welcome <Text className="font-bold tracking-wider">Sworup!</Text>
            </Text>
            <Text className="text-white text-sm tracking-wider">
              Good Night
            </Text>
          </View>

          <View className="flex-row space-x-1 items-center">
            <Text className="text-white text-sm">65.96</Text>
            <StarIcon color="white" size={30} />
          </View>
        </View>

        <View className="mt-20 flex-1  bg-slate-100 rounded-tl-[50px] rounded-tr-[50px]">
          <View
            className="mx-5 h-[200px]  mt-[-65px] rounded-xl"
            style={{elevation: 10}}>
            <Image
              source={{
                uri: 'https://media-cldnry.s-nbcnews.com/image/upload/t_fit-1500w,f_auto,q_auto:best/newscms/2017_26/2053956/170627-better-grocery-store-main-se-539p.jpg',
              }}
              className="w-full h-full rounded-xl"
            />
          </View>
          <ScrollView>
            <View className="mt-3 mx-5 flex-row justify-between">
              <Text className="tracking-wider font-bold text-[#222] text-[18px]">
                Recent Invoices
              </Text>
              <Text className="text-sm font-bold text-orange-400 tracking-tighter">
                View all
              </Text>
            </View>
            <View
              className="bg-white p-2  rounded-md mt-4 mx-5"
              style={{elevation: 10}}>
              {[1, 2, 3, 4, 5, 6, 7, 8].map(num => {
                return (
                  <View key={num}>
                    <View className="flex-row py-5 justify-between items-center">
                      <View className="flex-row items-center space-x-3">
                        <View className="bg-orange-400 p-[3px] rounded-full">
                          <DocumentTextIcon color="white" size={30} />
                        </View>

                        <View>
                          <Text className="font-bold text-orange-400 text-base">
                            S1BHG9887-BKT-080/81
                          </Text>
                          <View className="flex-row items-center">
                            <CalendarIcon size={20} color="gray" />
                            <Text className="text-gray-600 font-bold text-sm">
                              3/4/2024
                            </Text>
                          </View>
                        </View>
                      </View>
                      <View>
                        <Text className="text-green-800 font-bold text-sm">
                          Rs.1395.00
                        </Text>
                      </View>
                    </View>
                    <Divider className="mt-2 border-[0.5px]" />
                  </View>
                );
              })}
            </View>
          </ScrollView>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default Home;
