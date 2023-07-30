import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";

// Styles
import "./assets/css/style.css";
import 'bootstrap/dist/css/bootstrap.css';

//Packages
import _, { result } from "lodash";
import moment from "moment";
import Toast from "vue-toastification";
import "vue-toastification/dist/index.css";

// Components
import Loading from "./components/Loading.vue";
import Menu from "./components/Menu.vue";
import Icn from "./components/Icn.vue";

Vue.component("Loading", Loading);
Vue.component("Menu", Menu);
Vue.component("Icn", Icn);

//Plugins
import axios from "./plugins/axios.js";
Vue.prototype.$http = axios;

Object.defineProperty(Vue.prototype, "$_", { value: _ });
Object.defineProperty(Vue.prototype, "$moment", { value: moment });

const toastOptions = {
  type: "success",
  position: "top-center",
  timeout: 4000,
  hideProgressBar: true,
};
Vue.use(Toast, toastOptions);

Vue.config.productionTip = false;

async function init() {
  try {
    const { data } = await axios.get("/users/me");
    store.dispatch('setUser', data.user);
  } catch (error) { 
    console.log(error, '-----> Error init /api/users/me <-----'); 
  }

  new Vue({
    router,
    store,
    render: (h) => h(App),
    created() {},
  }).$mount("#app");
}

init();
