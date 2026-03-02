# LLM 聊天应用

基于 Ollama 的本地大模型聊天应用，支持实时流式对话、会话管理等功能。

## 技术栈

### 后端 (ollama-service)
- **框架**: NestJS 11.0.1
- **数据库**: MySQL + TypeORM
- **认证**: JWT + Passport
- **API 文档**: Swagger + Knife4j
- **其他**: LangChain, Axios, bcrypt, class-validator

### 前端 (ollama-web)
- **框架**: UmiJS 4.6.22
- **UI 组件库**: Ant Design 6.2.1
- **聊天组件**: @ant-design/x 2.1.3
- **Markdown 渲染**: @ant-design/x-markdown 2.3.0

## 项目结构

```
llm-for-front-end/
├── ollama-service/          # NestJS 后端服务
│   ├── src/
│   │   ├── common/          # 公共模块
│   │   ├── config/          # 配置文件
│   │   ├── constants/       # 常量定义
│   │   ├── modules/         # 业务模块
│   │   │   ├── auth/        # 认证模块
│   │   │   ├── chat-model/  # 聊天模型模块
│   │   │   ├── conversations/ # 会话管理模块
│   │   │   ├── ollama/      # Ollama 集成模块
│   │   │   └── user/        # 用户模块
│   │   ├── app.module.ts
│   │   └── main.ts
│   ├── config.development.yaml  # 开发环境配置
│   ├── config.production.yaml   # 生产环境配置
│   └── package.json
├── ollama-web/              # UmiJS 前端应用
│   ├── config/              # 配置文件
│   ├── src/
│   │   ├── assets/          # 静态资源
│   │   ├── layouts/         # 布局组件
│   │   ├── pages/           # 页面组件
│   │   │   ├── llmChat/     # 聊天页面
│   │   │   ├── login/       # 登录页面
│   │   │   └── model/       # 模型管理页面
│   │   ├── utils/           # 工具函数
│   │   ├── wrappers/        # 路由包装器
│   │   └── global.less
│   └── package.json
└── .gitignore
```

## 环境要求

- Node.js >= 18
- MySQL >= 8.0
- Ollama (本地运行)

## 快速开始

### 1. 克隆项目

```bash
git clone <repository-url>
cd llm-for-front-end
```

### 2. 配置数据库

创建 MySQL 数据库：

```sql
CREATE DATABASE `zero-cost-ai` DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

### 3. 配置 Ollama

确保 Ollama 已在本地运行（默认端口 11434）：

```bash
# 安装 Ollama 后，启动服务
ollama serve

# 下载模型（例如 qwen3）
ollama pull qwen3
```

### 4. 安装依赖并启动后端

```bash
cd ollama-service
npm install

# 修改配置文件 config.development.yaml 中的数据库连接信息

# 启动开发服务器
npm run start:dev
```

后端 API 文档访问地址：http://localhost:9999/doc.html

### 5. 安装依赖并启动前端

```bash
cd ollama-web
npm install

# 启动开发服务器
npm run dev
```

前端访问地址：http://localhost:8000

## 功能特性

### 后端功能
- ✅ 用户注册和登录
- ✅ JWT 身份认证
- ✅ Ollama 模型集成
- ✅ 会话管理
- ✅ 流式对话支持
- ✅ 消息历史记录
- ✅ Swagger API 文档

### 前端功能
- ✅ 用户登录界面
- ✅ 实时流式对话
- ✅ Markdown 渲染
- ✅ 会话历史管理
- ✅ AI 思考过程展示
- ✅ 响应式布局

## 配置说明

### 后端配置 (ollama-service/config.development.yaml)

```yaml
http:
  host: 'localhost'
  port: 9999
  prefix: 'api'

mysql:
  host: 'localhost'
  port: 3306
  database: 'zero-cost-ai'
  username: 'root'
  password: '123456'
  charset: 'utf8'
  timezone: '+08:00'

ollama:
  url: 'http://localhost:11434'
```

## 开发命令

### 后端
```bash
npm run start:dev      # 开发模式（热重载）
npm run build          # 构建
npm run start:prod     # 生产模式运行
npm run lint           # 代码检查
npm run test           # 单元测试
```

### 前端
```bash
npm run dev            # 开发模式
npm run build          # 构建
npm run start          # 生产模式启动
```

## License

MIT
