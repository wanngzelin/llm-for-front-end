import routes from "./config/routes";
import { defineConfig } from "umi";

export default defineConfig({
  routes,
  npmClient: "pnpm",
  // 请求代理配置
  proxy: {
    "/api": {
      target: "http://127.0.0.1:9999", // 后端服务器地址
      changeOrigin: true, // 允许跨域
      pathRewrite: {
        "^/api": "", // 重写路径，去掉 /api 前缀
      },
    },
  },
  tailwindcss: {},
  antd:{},
  plugins: [
    "@umijs/plugins/dist/tailwindcss",
    "@umijs/plugins/dist/antd"
  ],
});
