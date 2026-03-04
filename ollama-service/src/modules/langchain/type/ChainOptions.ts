import { PromptTemplate } from "@langchain/core/prompts";
import { ChatOllama } from "@langchain/ollama";

export type ChainOptions = {
  model: ChatOllama;
  promptTemplate: PromptTemplate;
  outputParser?: any; // 支持后续扩展JSON解析器等
}