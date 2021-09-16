import { defineConfig } from 'umi';

export default defineConfig({
  nodeModulesTransform: {
    type: 'none',
  },
  // 定义页面路由
  routes: [
    { path: '/', component: '@/pages/index', exact: true },
    { path: '/user', component: '@/pages/user', exact: true },
    {
      path: '/shop',
      component: '@/layouts/index',
      routes: [
        {
          exact: true,
          path: '/shop/shops',
          component: '@/pages/user'
        },
        {
          exact: true,
          path: '/shop/shopItems',
          component: '@/pages/shop/shopItems'
        }
      ]
    }  
  ],
  fastRefresh: {},
});
