import { createRouter, createWebHistory } from "vue-router";
import AnnouncementDetail from "../views/announcement/newUI/ann_admindetail.vue";
import createapp from "../views/create.vue";
import indexinit from "../views/indexinit.vue";
import EditAnnouncement from "../views/announcement/newUI/ann_edit.vue"; //new
import AddAnnouncement from "../views/announcement/newUI/ann_add.vue"; //new
import adminnewui from "../views/announcement/newUI/ann_adminview.vue"; //new
import UserViewDetail from "../views/announcement/newUI/UserViewDetail.vue";
import show from "../views/announcement/oldUI/paginashow.vue";
import showui from "../views/announcement/newUI/newui.vue";
import PageNotFound from "../views/PageNotFound.vue";
import UserManagement from "../views/usermanage/UserManagement.vue";
import AddUser from "../views/usermanage/AddUser.vue";
import EditUser from "../views/usermanage/EditUser.vue";
import login from "../views/login.vue";
import { getToken, checkToken } from "../composable/Auth.js";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      name: "Start",
      component: createapp,
    },
    {
      path: "/index.html",
      name: "Startwithindex",
      component: indexinit,
    },
    {
      path: "/admin/announcement",
      name: "Announcement",
      component: adminnewui,
    },
    {
      path: "/admin/announcement/:id",
      name: "AnnouncementDetail",
      component: AnnouncementDetail,
      beforeEnter: async (to, from, next) => {
        if (
          localStorage.getItem("token") != null ||
          localStorage.getItem("token") != undefined
        ) {
          let result = await checkToken(localStorage.getItem("token"));
          if (result == 200) {
            next();
          } else {
            let newtoken = await getToken();
            if (newtoken == 401) {
              next("/login");
            } else {
              localStorage.setItem("token", newtoken);
              next();
            }
          }
        } else {
          next("/login");
        }
      },
    },
    {
      path: "/admin/announcement/add",
      name: "AddAnnouncement",
      component: AddAnnouncement,
      beforeEnter: async (to, from, next) => {
        if (
          localStorage.getItem("token") != null ||
          localStorage.getItem("token") != undefined
        ) {
          let result = await checkToken(localStorage.getItem("token"));
          if (result == 200) {
            next();
          } else {
            let newtoken = await getToken();
            if (newtoken == 401) {
              next("/login");
            } else {
              localStorage.setItem("token", newtoken);
              next();
            }
          }
        } else {
          next("/login");
        }
      },
    },
    {
      path: "/announcement",
      name: "userview",
      component: showui,
    },
    {
      path: "/announcement/:id",
      name: "UserViewDetail",
      component: UserViewDetail,
    },
    {
      path: "/ui/announcement/",
      name: "userview PAGE",
      component: show,
      beforeEnter: async (to, from, next) => {
        if ((localStorage.getItem("token") != null ||localStorage.getItem("token") != undefined)&&(localStorage.getItem("refreshtoken") != null ||localStorage.getItem("refreshtoken") != undefined)){
            next()
        }else{
          next('/login')
        }
      }
    },
    {
      path: "/admin/announcement/:id/edit",
      name: "EditAnnouncement",
      component: EditAnnouncement,
      beforeEnter: async (to, from, next) => {
        if (
          localStorage.getItem("token") != null ||
          localStorage.getItem("token") != undefined
        ) {
          let result = await checkToken(localStorage.getItem("token"));
          if (result == 200) {
            next();
          } else {
            let newtoken = await getToken();
            if (newtoken == 401) {
              next("/login");
            } else {
              localStorage.setItem("token", newtoken);
              next();
            }
          }
        } else {
          next("/login");
        }
      },
    },
    {
      path: "/:notfoundpath(.*)",
      name: "PageNotFound",
      component: PageNotFound,
    },
    {
      path: "/admin/user",
      name: "UserManagement",
      component: UserManagement,
      beforeEnter: async (to, from, next) => {
        if ((localStorage.getItem("token") != null ||localStorage.getItem("token") != undefined)&&(localStorage.getItem("refreshtoken") != null ||localStorage.getItem("refreshtoken") != undefined)){
            next()
        }else{
          next('/login')
        }
      }
    },
    {
      path: "/admin/user/add",
      name: "AddUser",
      component: AddUser,
      beforeEnter: async (to, from, next) => {
        if (
          localStorage.getItem("token") != null ||
          localStorage.getItem("token") != undefined
        ) {
          let result = await checkToken(localStorage.getItem("token"));
          if (result == 200) {
            next();
          } else {
            let newtoken = await getToken();
            if (newtoken == 401) {
              next("/login");
            } else {
              localStorage.setItem("token", newtoken);
              next();
            }
          }
        } else {
          next("/login");
        }
      },
    },
    {
      path: "/admin/user/:id/edit",
      name: "EditUser",
      component: EditUser,
      beforeEnter: async (to, from, next) => {
        if (
          localStorage.getItem("token") != null ||
          localStorage.getItem("token") != undefined
        ) {
          let result = await checkToken(localStorage.getItem("token"));
          if (result == 200) {
            next();
          } else {
            let newtoken = await getToken();
            if (newtoken == 401) {
              next("/login");
            } else {
              localStorage.setItem("token", newtoken);
              next();
            }
          }
        } else {
          next("/login");
        }
      },
    },
    {
      path: "/login",
      name: "login",
      component: login,
      beforeEnter: async (to, from, next) => {
        if (
          localStorage.getItem("token") != null ||
          localStorage.getItem("token") != undefined
        ) {
          let result = await checkToken(localStorage.getItem("token"));
          if (result == 200) {
            next("/admin/announcement");
          } else {
            let newtoken = await getToken();
            if (newtoken == 401) {
              next();
            } else {
              localStorage.setItem("token", newtoken);
              next("/admin/announcement");
            }
          }
        } else {
          next();
        }
      },
    },
  ],
});
export default router;
