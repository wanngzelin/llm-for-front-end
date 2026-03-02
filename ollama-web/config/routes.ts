import { defineConfig } from "umi";

type RoutesType = ReturnType<typeof defineConfig>['routes']

const routes: RoutesType = [
  { path: '/login', component: 'login', layout: false },
  {
    path: '/',
    component: '@/layouts/index',
    layout: false,
    wrappers: ['@/wrappers/authWrappers'],
    routes: [
      { path: '', component: './llmChat', meta: { title: 'Ai Chat' } },
      { path: '/llmChat', component: './llmChat', meta: { title: 'Ai Chat' } },
      { path: '/model', component: './model', meta: { title: '模型管理' } },
    ],
  },
]

export default routes