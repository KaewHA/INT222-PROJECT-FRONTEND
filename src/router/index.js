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
import test from "../views/test.vue";
import jwtDecode from "jwt-decode";
import MatchPassword from "../views/usermanage/MatchPassword.vue"
import Unsubcribe from "../views/Unsubcribe.vue"

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
    },
    {
      path: "/admin/announcement/add",
      name: "AddAnnouncement",
      component: AddAnnouncement,
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
    },
    {
      path: "/admin/announcement/:id/edit",
      name: "EditAnnouncement",
      component: EditAnnouncement,
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
    },
    {
      path: "/admin/user/add",
      name: "AddUser",
      component: AddUser,
    },
    {
      path: "/admin/user/:id/edit",
      name: "EditUser",
      component: EditUser,
    },
    {
      path: "/login",
      name: "login",
      component: login,
    },
    {
      path: "/admin/user/match",
      name: "MatchPassword",
      component: MatchPassword
    },
    {
      path: "/unsub",
      name: "Unsubcribe",
      component: Unsubcribe
    },
    {
      path: "/test",
      name: "test",
      component: test
    }
  ],
});

router.beforeEach(async (to, from, next) => {
  const token = localStorage.getItem("token");
  const refreshToken = localStorage.getItem("refreshtoken");
  const role = token ? jwtDecode(token).roles : "user";
  const isAuthenticated = () => {
    return token || refreshToken;
  };
  if (!isAuthenticated() && to.name !== "login" && to.name !== "userview" && to.name !== "UserViewDetail" && to.name!== "Start" && to.name !== "Unsubcribe" && to.name!=="PageNotFound" && to.name!=="test" ) {
    next("/login");
  } else if (isAuthenticated()) {
    if (role !== 'admin' && to.path.startsWith('/admin/user')) {
      next('/admin/announcement')
    } else {
      next()
    }
  } else next()
});

export default router;
