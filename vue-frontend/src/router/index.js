import Vue from "vue";
import VueRouter from "vue-router";
import store from '../store/index.js'

Vue.use(VueRouter);
const qs = require("qs");
const routes = [

  {
    path: "/",
    component: () => import("../layouts/main.vue"),
    beforeEnter: checkToken,
    children: [
      {
        path: "home",
        name: "home",
        component: () => import("../views/Home.vue"),
      },
    ],
  },
  //-----------------###########---------------------
  {
    path: "",
    component: () => import("../layouts/Fullscreen.vue"),
    children: [
      {
        path: "/login",
        name: "login",
        component: () => import("../views/Login.vue"),
      },
      {
        path: "/register",
        name: "register",
        component: () => import("../views/Register.vue"),
      },
    ],
  },
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

function checkToken(to, from, next){
  const token = localStorage.getItem("x-auth-token");
  !!token ? next() : next({ name: 'login' })
}

export default router;


