import Vue from 'vue'
import Router from 'vue-router'
import qs from 'qs'

import config from '@/config'
import store from '@/store'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'home',
      component: () => import(/* webpackChunkName: "home" */ '@/views/Home')
    },
    {
      path: '/registration',
      name: 'registration',
      component: () => import(/* webpackChunkName: "registration" */ '@/views/Registration'),
      meta: {
        noAuthenticationIsRequired: true
      },
      beforeEnter: (to, from, next) => {
        if (!config.registrationIsEnabled) {
          return next('/login')
        }

        next()
      }
    },
    {
      path: '/login',
      name: 'login',
      component: () => import(/* webpackChunkName: "login" */ '@/views/Login'),
      meta: {
        noAuthenticationIsRequired: true
      }
    },
    {
      path: '/logout',
      beforeEnter: async (to, from, next) => {
        if (to.query.everywhere) {
          await store.dispatch('auth/deauthorize', true)

          return
        }

        await store.dispatch('auth/deauthorize', false)
      }
    },
    {
      path: '/user',
      name: 'user',
      component: () => import(/* webpackChunkName: "user" */ '@/views/User'),
      meta: {
        authenticationIsRequired: true
      }
    },
    {
      path: '/settings',
      name: 'settings',
      component: () => import(/* webpackChunkName: "settings" */ '@/views/Settings'),
      meta: {
        authenticationIsRequired: config.authenticationIsRequired
      }
    },
    {
      path: '/tags',
      name: 'tags',
      component: () => import(/* webpackChunkName: "tags" */ '@/views/Tags'),
      meta: {
        authenticationIsRequired: config.authenticationIsRequired
      }
    },
    {
      path: '/files',
      name: 'files',
      component: () => import(/* webpackChunkName: "files" */ '@/views/Files'),
      meta: {
        authenticationIsRequired: config.authenticationIsRequired
      }
    },
    {
      path: '/files/:id',
      name: 'file',
      component: () => import(/* webpackChunkName: "file" */ '@/views/File'),
      meta: {
        authenticationIsRequired: config.authenticationIsRequired
      },
      beforeEnter: (to, from, next) => {
        if (isNaN(to.params.id)) {
          return next('/files')
        }

        next()
      }
    },
    { path: '*', redirect: '/' }
  ],
  scrollBehavior: (to, from, savedPosition) => {
    if (savedPosition) {
      return savedPosition
    }
  },
  parseQuery: query => {
    return qs.parse(query)
  },
  stringifyQuery: query => {
    const result = qs.stringify(query)

    return result ? `?${result}` : ''
  },
  linkActiveClass: 'is-active',
  linkExactActiveClass: 'is-active'
})
