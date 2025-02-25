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
 * constantRoutes
 * a base page that does not have permission requirements
 * all roles can be accessed
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
    path: '/notice',
    component: Layout,
    children: [
      {
        path: 'index',
        name: 'Notice',
        component: () => import('@/views/notice/index'),
        meta: { title: '信息公告', icon: 'el-icon-message' }
      }
    ]
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

  // 404 page must be placed at the end !!!
  { path: '*', redirect: '/404', hidden: true }
]

/**
 * asyncRoutes
 * 需要根据用户角色动态加载的路由
 */
export const asyncRoutes = [
  // 业主特有路由
  {
    path: '/parking',
    component: Layout,
    meta: {
      title: '车位管理',
      icon: 'el-icon-s-cooperation',
      roles: ['owner']
    },
    children: [
      {
        path: 'my-parking',
        name: 'MyParking',
        component: () => import('@/views/parking/my-parking'),
        meta: { title: '我的车位', icon: 'el-icon-s-order' }
      },
      {
        path: 'parking-apply',
        name: 'ParkingApply',
        component: () => import('@/views/parking/parking-apply'),
        meta: { title: '车位申请', icon: 'el-icon-s-claim' }
      }
    ]
  },
  {
    path: '/payment',
    component: Layout,
    meta: {
      title: '缴费信息',
      icon: 'el-icon-s-finance',
      roles: ['owner']
    },
    children: [
      {
        path: 'my-payment',
        name: 'MyPayment',
        component: () => import('@/views/payment/my-payment'),
        meta: { title: '我的缴费', icon: 'el-icon-s-order' }
      },
      {
        path: 'payment-history',
        name: 'PaymentHistory',
        component: () => import('@/views/payment/payment-history'),
        meta: { title: '缴费历史', icon: 'el-icon-s-data' }
      }
    ]
  },
  {
    path: '/repair',
    component: Layout,
    meta: {
      title: '报修信息',
      icon: 'el-icon-s-tools',
      roles: ['owner']
    },
    children: [
      {
        path: 'repair-apply',
        name: 'RepairApply',
        component: () => import('@/views/repair/repair-apply'),
        meta: { title: '报修申请', icon: 'el-icon-s-claim' }
      },
      {
        path: 'repair-history',
        name: 'RepairHistory',
        component: () => import('@/views/repair/repair-history'),
        meta: { title: '报修历史', icon: 'el-icon-s-order' }
      }
    ]
  },

  // 管理员特有路由
  {
    path: '/owner-manage',
    component: Layout,
    meta: {
      title: '业主信息管理',
      icon: 'el-icon-user',
      roles: ['admin']
    },
    children: [
      {
        path: 'owner-list',
        name: 'OwnerList',
        component: () => import('@/views/owner-manage/owner-list'),
        meta: { title: '业主列表', icon: 'el-icon-s-data' }
      },
      {
        path: 'owner-add',
        name: 'OwnerAdd',
        component: () => import('@/views/owner-manage/owner-add'),
        meta: { title: '添加业主', icon: 'el-icon-plus' }
      }
    ]
  },
  {
    path: '/notice-manage',
    component: Layout,
    meta: {
      title: '公告信息管理',
      icon: 'el-icon-s-comment',
      roles: ['admin']
    },
    children: [
      {
        path: 'notice-list',
        name: 'NoticeList',
        component: () => import('@/views/notice-manage/notice-list'),
        meta: { title: '公告列表', icon: 'el-icon-s-data' }
      },
      {
        path: 'notice-add',
        name: 'NoticeAdd',
        component: () => import('@/views/notice-manage/notice-add'),
        meta: { title: '添加公告', icon: 'el-icon-plus' }
      }
    ]
  },
  {
    path: '/parking-manage',
    component: Layout,
    meta: {
      title: '车位信息管理',
      icon: 'el-icon-s-cooperation',
      roles: ['admin']
    },
    children: [
      {
        path: 'parking-list',
        name: 'ParkingList',
        component: () => import('@/views/parking-manage/parking-list'),
        meta: { title: '车位列表', icon: 'el-icon-s-data' }
      },
      {
        path: 'parking-add',
        name: 'ParkingAdd',
        component: () => import('@/views/parking-manage/parking-add'),
        meta: { title: '添加车位', icon: 'el-icon-plus' }
      },
      {
        path: 'parking-apply-list',
        name: 'ParkingApplyList',
        component: () => import('@/views/parking-manage/parking-apply-list'),
        meta: { title: '车位申请列表', icon: 'el-icon-s-order' }
      }
    ]
  },
  {
    path: '/payment-manage',
    component: Layout,
    redirect: '/payment-manage/payment-list',
    name: 'PaymentManage',
    meta: {
      title: '缴费管理',
      icon: 'money'
    },
    children: [
      {
        path: 'payment-list',
        component: () => import('@/views/payment-manage/payment-list'),
        name: 'PaymentList',
        meta: { title: '缴费列表' }
      },
      {
        path: 'payment-add',
        component: () => import('@/views/payment-manage/payment-add'),
        name: 'PaymentAdd',
        meta: { title: '添加账单', activeMenu: '/payment-manage/payment-list' },
        hidden: true
      },
      {
        path: 'payment-statistics',
        component: () => import('@/views/payment-manage/payment-statistics'),
        name: 'PaymentStatistics',
        meta: { title: '缴费统计' }
      }
    ]
  },
  {
    path: '/repair-manage',
    component: Layout,
    redirect: '/repair-manage/repair-list',
    name: 'RepairManage',
    meta: {
      title: '报修管理',
      icon: 'tool'
    },
    children: [
      {
        path: 'repair-list',
        component: () => import('@/views/repair-manage/repair-list'),
        name: 'RepairList',
        meta: { title: '报修列表' }
      },
      {
        path: 'repair-add',
        component: () => import('@/views/repair-manage/repair-add'),
        name: 'RepairAdd',
        meta: { title: '添加报修', activeMenu: '/repair-manage/repair-list' },
        hidden: true
      }
    ]
  },
  {
    path: '/system',
    component: Layout,
    meta: {
      title: '系统管理',
      icon: 'el-icon-s-tools',
      roles: ['admin']
    },
    children: [
      {
        path: 'admin-list',
        name: 'AdminList',
        component: () => import('@/views/system/admin-list'),
        meta: { title: '管理员列表', icon: 'el-icon-user' }
      },
      {
        path: 'admin-add',
        name: 'AdminAdd',
        component: () => import('@/views/system/admin-add'),
        meta: { title: '添加管理员', icon: 'el-icon-plus' }
      },
      {
        path: 'log',
        name: 'Log',
        component: () => import('@/views/system/log'),
        meta: { title: '系统日志', icon: 'el-icon-document' }
      }
    ]
  },

  // 404 page must be placed at the end !!!
  { path: '*', redirect: '/404', hidden: true }
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
