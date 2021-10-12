import Animated, {
    Extrapolate,
    interpolate,
    useDerivedValue,
} from 'react-native-reanimated';
import type { IComputedAnimResult } from './useComputedAnim';

interface IOpts {
    index: number;
    width: number;
    computedAnimResult: IComputedAnimResult;
    offsetX: Animated.SharedValue<number>;
}

export const useOffsetX = (opts: IOpts) => {
    const { offsetX, index, width, computedAnimResult } = opts;
    const { MAX, WL, MIN, LENGTH } = computedAnimResult;
    const x = useDerivedValue(() => {
			// 每个元素距离原点的偏移值
			const Wi = width * index;

			// 每个元素的起始值，如果越过边界则起始位置应该调转到另一侧
			const startPos = Wi > MAX ? MAX - Wi : Wi < MIN ? MIN - Wi : Wi;

			const inputRange = [
				// WL为去掉头、尾的可移动区域
				-WL,
				// 这里是越过边界前的位置条件
				-((LENGTH - 2) * width + width / 2) - startPos - 1,
				// 这里是越过边界后的位置条件
				-((LENGTH - 2) * width + width / 2) - startPos,
				// 原点
				0,
				// 反方向
				(LENGTH - 2) * width + width / 2 - startPos,
				// 反方向
				(LENGTH - 2) * width + width / 2 - startPos + 1,
				// 反方向
				WL,
			];

			const outputRange = [
			   // 对应WL循环了一周，所以回到起始位置
				startPos,
				1.5 * width - 1,
				// 越过后调转到另一侧
				-((LENGTH - 2) * width + width / 2),
			   // 回到起始位置
				startPos,
				// 越过后调转到另一侧
				(LENGTH - 2) * width + width / 2,
				-(1.5 * width - 1),
			   // 对应WL循环了一周，所以回到起始位置
				startPos,
			];

			// 返回计算后的X值，这个值是一个相对原点的绝对位置，但我们的元素是依次排开的，所以再减去 index*width ,把他们归置原点即可
			return interpolate(
				offsetX.value,
				inputRange,
				outputRange,
				Extrapolate.CLAMP
			);
    }, []);
    return x;
};
