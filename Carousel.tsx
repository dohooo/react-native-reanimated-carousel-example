import React from 'react';
import { Dimensions, Text, View } from 'react-native';
import Animated, {
  useAnimatedGestureHandler,
  useSharedValue,
  useDerivedValue
} from 'react-native-reanimated';
import { PanGestureHandler, PanGestureHandlerGestureEvent } from 'react-native-gesture-handler';
import { useComputedAnim } from './useComputedAnim';
import { Layouts } from './Layouts';

const data = [1, 2, 3];
const { width } = Dimensions.get('window');
const height = 300;

const Carousel: React.FC = () => {
  // 1.在这里我们需要获取一些计算要用到的`基础值`,只是一个封装逻辑。
  const computedAnimResult = useComputedAnim(width, data.length);
  // 1. 这是我们手势发生位置的偏移量
  const handlerOffsetX = useSharedValue<number>(0);

  // 2. 这里需要对偏移值做一次转换，让其循环一周后归0，这也是我们实际用到的值
  const offsetX = useDerivedValue(() => {
    const x = handlerOffsetX.value % computedAnimResult.WL;
    return isNaN(x) ? 0 : x;
  }, [computedAnimResult]);

  // 这个Hook会在手势发生时对所设置的方法进行调用，并返回一些参数，告知手势信息
  const animatedListScrollHandler = useAnimatedGestureHandler<PanGestureHandlerGestureEvent>({
    /**
    * 3. ctx是方法执行时所提供的临时上下文，我们可以记录一些临时用到的变量
    * 在这里我们拖动前把当前的偏移量添加到上下文中
    */
    onStart: (_, ctx: any) => {
      ctx.startContentOffsetX = handlerOffsetX.value;
    },
    /**
    * 4. 我们从上下文中取出初始位置，并与onActive返回的这次滑动的X偏移量相加，就可以使屏幕左右挪动了
    */
    onActive: (e, ctx: any) => {
      handlerOffsetX.value = ctx.startContentOffsetX + e.translationX;
    },
  }, [])


  return <PanGestureHandler onHandlerStateChange={animatedListScrollHandler}>
    {/* // 2. 手势容器规定内部需要嵌套Reanimated的布局元素 */}
    <Animated.View
      style={{
        // 3. 这里我们需要指定轮播图容器的宽高，因为内部我们会让元素以绝对定位的方式进行布局，所以无法撑开容器。
        width,
        height,
        flexDirection: 'row',
        position: 'relative',
      }}
    >
      {data.map((_, i) => {
        return (
          // 3. Layouts 是用来控制元素位置的容器，会在下面讲到
          <Layouts width={width} index={i} key={i} offsetX={offsetX} computedAnimResult={computedAnimResult}>
            <View style={{ flex: 1, backgroundColor: "red", justifyContent: "center", alignItems: "center", borderWidth: 1, borderColor: "black" }}>
              <Text style={{ fontSize: 100 }}>{i}</Text>
            </View>
          </Layouts>
        );
      })}
    </Animated.View>
  </PanGestureHandler>
}

export default Carousel;
