import { type BubbleItemType } from "@ant-design/x";

/** 扩展对话框类型 */
export interface IExBubbleItemType extends BubbleItemType {
  /** 思考内容 */
  think?: string;
  /** 思考耗时 */
  thinkDuration?: string;
  /** 是否思考完成 */
  thinkDone?: boolean;
}