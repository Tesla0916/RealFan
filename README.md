## 介绍
react@17 + umijs@3 + antd@4 + recoil@0.3 + webpack@5 

## 开发前先阅读官网文档
https://umijs.org/zh-CN/docs/getting-started

## 目录结构
待补充

## 常用命令
* 开发

`
npm start
`
* 生产打包

`
npm run build
`

打包后输出到dist文件夹下面

* eslint验证

`
npm run lint
`

没有自带修复的命令，目前仅支持手动修改报错。

* 测试用例

### 使用了React Hooks Testing Library库
写测试单例时，可阅读使用文档: https://react-hooks-testing-library.com/usage/basic-hooks

测试单例都写在test文件夹下，已有几个官网参考用例。

```
1. 运行所有测试用例
npm run test
2. 输出测试覆盖率
npm run test:coverage

```

## 接口请求（仍需和后端同学进行参数对齐）
* axios封装 (可进一步完善)

utils/axios.tsx

* 不同环境配置方法

1. 本地测试环境 + mock数据 

可先不配置axios.tsx文件中的BASE_HOST，会默认转发到mock/index.js文件

2. 线上调用

配置axios.tsx文件中的BASE_HOST

* 不同环境使用方法相同
```javascript
import axios from 'utils/axios';

const res = await axios.get('/user/list') // get方法
const res = await axios.post('/user/3', { id: 3 }) // post方法
```

## 样式写法，支持css/less以及模块化

```javascript
import '/global.css';
import styles from 'home.module.css';
import '/varibles.less';
import styles from 'user.module.less';
```

支持以上四种引入方式，建议如下操作:
1. 将全局样式文件写在根目录下的styles文件夹中；
2. 最好是所有模块化的引入加上.module.命名，并且模块化文件建议使用.less文件

## 路由

###  请使用配置路由

https://umijs.org/zh-CN/docs/routing
```javascript
// 路由配置
1. 在根目录下的 .umirc.ts 进行路由配置
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

// 路由跳转
1. link标签跳转
import { Link } from 'umi';

export default () => (
  <Link to="/list">Go to list page</Link>
);

2. 路由跳转
import { history } from 'umi';

function goToListPage() {
  history.push('/list');
}
```

## 接口mock调用

阅读文档:
https://umijs.org/zh-CN/docs/mock

## 待完成
1. 与后端同学约定字段参数;