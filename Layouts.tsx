import React from 'react';
import { FlexStyle, View } from 'react-native';
import Animated, { useAnimatedStyle } from 'react-native-reanimated';
import { IComputedAnimResult } from './useComputedAnim';
import { useOffsetX } from './useOffsetX';

export const Layouts: React.FC<{
  index: number;
  width: number;
  height?: FlexStyle['height'];
  offsetX: Animated.SharedValue<number>;
  computedAnimResult: IComputedAnimResult;
}> = (props) => {
  const {
    index,
    width,
    children,
    height = '100%',
    offsetX,
    computedAnimResult,
  } = props;

  /*
   * 1. 这里是让CarouselItem元素正确移动的核心逻辑，我们会在下面讲到这里
   */
  const x = useOffsetX({
    offsetX,
    index,
    width,
    computedAnimResult,
  });

  /*
   * 2. Reanimated 需要使用 useAnimatedStyle来生成style
   * 因为它将在sharedValue变化时控制生成变化后的样式
   * 同样他生成的样式也允许与Reanimated.View进行关联
   */
  const offsetXStyle = useAnimatedStyle(() => {
    return {
      /*
       * 3. 这里我们需要使用`index * width`让元素都回到原点（即他们都是叠在一起的）
       * 然后完全使用我们通过`useOffsetX `计算的值`x.value`来控制他的位置
      */
      transform: [{ translateX: x.value - index * width }],
    };
  }, []);

  return (
    // 4. 设置样式
    <Animated.View style={offsetXStyle}>
      <View style={{ width, height }}>{children}</View>
    </Animated.View>
  );
}

export default Layouts;