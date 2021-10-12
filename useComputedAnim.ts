export interface IComputedAnimResult {
    MAX: number;
    MIN: number;
    WL: number;
    LENGTH: number;
}

export function useComputedAnim(
    width: number,
    LENGTH: number
): IComputedAnimResult {
	  /* 
	   * 1. 去掉头、尾两个元素的宽度后，中间可以滑动的距离
	   * 因为临近头、尾时要将头、尾元素的位置反方向挪到另一侧
	   */
    const MAX = (LENGTH - 2) * width;
	  // 2. 反方向取反
    const MIN = -MAX;
	  // 3. 元素排列开的总长度
    const WL = width * LENGTH;

    return {
        MAX,
        MIN,
        WL,
        LENGTH,
    };
}