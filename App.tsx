import React from 'react';
import { View } from 'react-native';
import Carousel from "./Carousel";

export default function App() {
  return (
    <View style={{ flex: 1, justifyContent: "center" }}>
      <Carousel />
    </View>
  );
}