import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

/* Layout */
import Layout from '@/layout'

/**
 * Note: sub-menu only appear when route children.length >= 1
 * Detail see: https://panjiachen.github.io/vue-element-admin-site/guide/essentials/router-and-nav.html
 *
 * hidden: true                   if set true, item will not show in the sidebar(default is false)
 * alwaysShow: true               if set true, will always show the root menu
 *                                if not set alwaysShow, when item has more than one children route,
 *                                it will becomes nested mode, otherwise not show the root menu
 * redirect: noRedirect           if set noRedirect will no redirect in the breadcrumb
 * name:'router-name'             the name is used by <keep-alive> (must set!!!)
 * meta : {
    roles: ['admin','editor']    control the page roles (you can set multiple roles)
    title: 'title'               the name show in sidebar and breadcrumb (recommend set)
    icon: 'svg-name'/'el-icon-x' the icon show in the sidebar
    breadcrumb: false            if set false, the item will hidden in breadcrumb(default is true)
    activeMenu: '/example/list'  if set path, the sidebar will highlight the path you set
  }
 */

/**
 * 公共路由
 */
export const constantRoutes = [
  {
    path: '/login',
    component: () => import('@/views/login/index'),
    hidden: true
  },
  {
    path: '/404',
    component: () => import('@/views/404'),
    hidden: true
  },
  {
    path: '/',
    component: Layout,
    redirect: '/dashboard',
    children: [{
      path: 'dashboard',
      name: 'Dashboard',
      component: () => import('@/views/dashboard/index'),
      meta: { title: '首页', icon: 'dashboard' }
    }]
  },
  {
    path: '/profile',
    component: Layout,
    children: [
      {
        path: 'index',
        name: 'Profile',
        component: () => import('@/views/profile/index'),
        meta: { title: '个人中心', icon: 'user' }
      }
    ]
  },
  {
    path: '/notice',
    component: Layout,
    children: [
      {
        path: 'index',
        name: 'Notice',
        component: () => import('@/views/notice/index'),
        meta: { title: '信息公告', icon: 'form' }
      }
    ]
  },
  {
    path: '/example',
    component: Layout,
    redirect: '/example/table',
    name: 'Example',
    meta: { title: 'Example', icon: 'el-icon-s-help' },
    children: [
      {
        path: 'table',
        name: 'Table',
        component: () => import('@/views/table/index'),
        meta: { title: 'Table', icon: 'table' }
      },
      {
        path: 'tree',
        name: 'Tree',
        component: () => import('@/views/tree/index'),
        meta: { title: 'Tree', icon: 'tree' }
      }
    ]
  },
  {
    path: '/form',
    component: Layout,
    children: [
      {
        path: 'index',
        name: 'Form',
        component: () => import('@/views/form/index'),
        meta: { title: 'Form', icon: 'form' }
      }
    ]
  },
  {
    path: '/nested',
    component: Layout,
    redirect: '/nested/menu1',
    name: 'Nested',
    meta: {
      title: 'Nested',
      icon: 'nested'
    },
    children: [
      {
        path: 'menu1',
        component: () => import('@/views/nested/menu1/index'), // Parent router-view
        name: 'Menu1',
        meta: { title: 'Menu1' },
        children: [
          {
            path: 'menu1-1',
            component: () => import('@/views/nested/menu1/menu1-1'),
            name: 'Menu1-1',
            meta: { title: 'Menu1-1' }
          },
          {
            path: 'menu1-2',
            component: () => import('@/views/nested/menu1/menu1-2'),
            name: 'Menu1-2',
            meta: { title: 'Menu1-2' },
            children: [
              {
                path: 'menu1-2-1',
                component: () => import('@/views/nested/menu1/menu1-2/menu1-2-1'),
                name: 'Menu1-2-1',
                meta: { title: 'Menu1-2-1' }
              },
              {
                path: 'menu1-2-2',
                component: () => import('@/views/nested/menu1/menu1-2/menu1-2-2'),
                name: 'Menu1-2-2',
                meta: { title: 'Menu1-2-2' }
              }
            ]
          },
          {
            path: 'menu1-3',
            component: () => import('@/views/nested/menu1/menu1-3'),
            name: 'Menu1-3',
            meta: { title: 'Menu1-3' }
          }
        ]
      },
      {
        path: 'menu2',
        component: () => import('@/views/nested/menu2/index'),
        name: 'Menu2',
        meta: { title: 'menu2' }
      }
    ]
  },
  {
    path: 'external-link',
    component: Layout,
    children: [
      {
        path: 'https://panjiachen.github.io/vue-element-admin-site/#/',
        meta: { title: 'External Link', icon: 'link' }
      }
    ]
  },
  // 404 page must be placed at the end !!!
  { path: '*', redirect: '/404', hidden: true }
]

/**
 * 业主路由
 */
export const ownerRoutes = [
  {
    path: '/parking',
    component: Layout,
    children: [
      {
        path: 'buy',
        name: 'ParkingBuy',
        component: () => import('@/views/parking/buy'),
        meta: { title: '车位购买管理', icon: 'car' }
      }
    ]
  },
  {
    path: '/payment',
    component: Layout,
    children: [
      {
        path: 'index',
        name: 'Payment',
        component: () => import('@/views/payment/index'),
        meta: { title: '缴费信息管理', icon: 'money' }
      }
    ]
  },
  {
    path: '/repair',
    component: Layout,
    children: [
      {
        path: 'index',
        name: 'Repair',
        component: () => import('@/views/repair/index'),
        meta: { title: '报修信息管理', icon: 'tool' }
      }
    ]
  }
]

/**
 * 管理员路由
 */
export const adminRoutes = [
  {
    path: '/parking-manage',
    component: Layout,
    children: [
      {
        path: 'index',
        name: 'ParkingManage',
        component: () => import('@/views/parking-manage/index'),
        meta: { title: '车位信息管理', icon: 'car' }
      }
    ]
  },
  {
    path: '/payment-manage',
    component: Layout,
    meta: { title: '缴费信息管理', icon: 'money' },
    children: [
      {
        path: 'utility',
        name: 'UtilityFee',
        component: () => import('@/views/payment-manage/utility'),
        meta: { title: '水电费管理' }
      },
      {
        path: 'property',
        name: 'PropertyFee',
        component: () => import('@/views/payment-manage/property'),
        meta: { title: '物业费管理' }
      },
      {
        path: 'garbage',
        name: 'GarbageFee',
        component: () => import('@/views/payment-manage/garbage'),
        meta: { title: '垃圾费管理' }
      }
    ]
  },
  {
    path: '/repair-manage',
    component: Layout,
    meta: { title: '报修信息管理', icon: 'tool' },
    children: [
      {
        path: 'elevator',
        name: 'ElevatorRepair',
        component: () => import('@/views/repair-manage/elevator'),
        meta: { title: '电梯维修' }
      },
      {
        path: 'utility',
        name: 'UtilityRepair',
        component: () => import('@/views/repair-manage/utility'),
        meta: { title: '水电维修' }
      },
      {
        path: 'garden',
        name: 'GardenRepair',
        component: () => import('@/views/repair-manage/garden'),
        meta: { title: '绿化维修' }
      },
      {
        path: 'corridor',
        name: 'CorridorRepair',
        component: () => import('@/views/repair-manage/corridor'),
        meta: { title: '楼道维修' }
      }
    ]
  },
  {
    path: '/system',
    component: Layout,
    meta: { title: '系统管理', icon: 'setting' },
    children: [
      {
        path: 'admin',
        name: 'AdminManage',
        component: () => import('@/views/system/admin'),
        meta: { title: '管理员管理' }
      },
      {
        path: 'owner',
        name: 'OwnerManage',
        component: () => import('@/views/system/owner'),
        meta: { title: '业主管理' }
      }
    ]
  }
]

const createRouter = () => new Router({
  // mode: 'history', // require service support
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRoutes
})

const router = createRouter()

// Detail see: https://github.com/vuejs/vue-router/issues/1234#issuecomment-357941465
export function resetRouter() {
  const newRouter = createRouter()
  router.matcher = newRouter.matcher // reset router
}

export default router
