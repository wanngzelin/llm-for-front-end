import { AIROLE } from "@/constants/constant.enum";

export interface OllamaStreamEvent {
  message: { role: AIROLE; content: string };
  done: boolean;
}