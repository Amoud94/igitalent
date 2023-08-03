import Vue from "vue";
import VueRouter from "vue-router";
import store from '../store/index.js'

Vue.use(VueRouter);
const qs = require("qs");
const routes = [
  //-----------------###########---------------------
  {
    path: "",
    component: () => import("../layouts/Fullscreen.vue"),
    children: [
      {
        path: "/",
        name: "login",
        beforeEnter: (to, from, next) => {
          if(localStorage.getItem("x-auth-token")) {
            next({ name: 'home' })
          } else {
            next()
          }
        },
        component: () => import("../views/Login.vue"),
      },
      {
        path: "/register",
        name: "register",
        component: () => import("../views/Register.vue"),
      },
    ],
  },
  {
    path: "/home",
    component: () => import("../layouts/main.vue"),
    beforeEnter: (to, from, next) => {
      if(localStorage.getItem("x-auth-token")) {
        next()
      } else {
        next({ name: 'login' })
      }
    },
    children: [
      {
        path: "/",
        name: "home",
        component: () => import("../views/Home.vue"),
      },
    ],
  }
];

const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes,
  parseQuery(query) {
    return qs.parse(query);
  },
  stringifyQuery(query) {
    let result = qs.stringify(query);
    return result ? "?" + result : "";
  },
});

export default router;


