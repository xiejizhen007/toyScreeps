/**
 * 原文
 * <https://blog.csdn.net/SeriousLose/article/details/121999097>
 */

export class MinHeap {
    private heap: any[];

    constructor() {
        this.heap = []; // 堆以数组表示
    }

    /**
     * @description: 插入操作
     */
    push(value: any) {
        this.heap.push(value);
        this.moveUp(this.heap.length - 1);
    }

    /**
     * @description: 删除堆顶
     */
    pop() {
        debugger;
        this.heap[0] = this.heap.pop();
        this.moveDown(0);
    }

    /**
     * @description: 获取堆顶
     */
    top() {
        return this.heap[0];
    }

    /**
     * @description: 获取堆的大小
     */
    size() {
        return this.heap.length;
    }

    /**
     * @description: 获取当前元素的父元素的index
     */
    private getParentIndex(index: number) {
        return (index - 1) >> 1;
        // return Math.floor((index - 1) / 2)
    }

    /**
     * @description: 获取当前元素的左子元素的index
     */
    private getLeftIndex(index: number) {
        return index * 2 + 1;
    }

    /**
     * @description: 获取当前元素的右子元素的index
     */
    private getRightIndex(index: number) {
        return index * 2 + 2;
    }

    /**
     * @description: 将当前元素与他的父元素的大小进行比较，当父元素值大于子元素时，交换两个元素，
     *               递归操作
     */
    private moveUp(index: number) {
        const parentIndex = this.getParentIndex(index);
        if (this.heap[index] < this.heap[parentIndex]) {
        this.change(index, parentIndex);
        this.moveUp(parentIndex);
        }
    }
    /**
     * @description: 将当前元素与他的左右子元素的大小进行比较，当父元素值大于左子元素时，交换两个元素，
     *               递归操作；右子元素操作相同
     */
    private moveDown(index: number) {
        let leftIndex = this.getLeftIndex(index);
        let rightIndex = this.getRightIndex(index);
        if (this.heap[index] > this.heap[leftIndex]) {
        this.change(index, leftIndex);
        this.moveDown(leftIndex);
        }
        if (this.heap[index] > this.heap[rightIndex]) {
        this.change(index, rightIndex);
        this.moveDown(rightIndex);
        }
    }

    /**
     * 交换两个元素的封装方法
     */
    private change(index1: number, index2: number) {
        let temp = this.heap[index1];
        this.heap[index1] = this.heap[index2];
        this.heap[index2] = temp;
    }
};