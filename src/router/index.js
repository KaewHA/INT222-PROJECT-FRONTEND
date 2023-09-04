import { createRouter, createWebHistory } from 'vue-router'
import AnnouncementDetail from '../views/announcement/newUI/ann_admindetail.vue'
import createapp from '../views/announcement/create.vue'
import indexinit from '../views/announcement/indexinit.vue'
import EditAnnouncement from '../views/announcement/newUI/ann_edit.vue'//new
import AddAnnouncement from '../views/announcement/newUI/ann_add.vue'//new
import adminnewui from '../views/announcement/newUI/ann_adminview.vue'//new
import UserViewDetail from '../views/announcement/oldUI/UserViewDetail.vue'
import show from '../views/announcement/paginashow.vue'
import PageNotFound from '../views/announcement/PageNotFound.vue'
import UserManagement from '../views/usermanage/UserManagement.vue'
import AddUser from '../views/usermanage/AddUser.vue'
import EditUser from '../views/usermanage/EditUser.vue'
import PasswordMatch from '../views/usermanage/PasswordMatch.vue'
import Dashboard from '../views/announcement/newUI/Dashboard.vue'

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes: [
        {
            path: '/',
            name: 'Start',
            component: createapp
        },
        {
            path: '/index.html',
            name: 'Startwithindex',
            component: indexinit
        },
        {
            path: '/admin/announcement',
            name: 'Announcement',
            component: adminnewui
        },
        {
            path: '/admin/announcement/:id',
            name: 'AnnouncementDetail',
            component: AnnouncementDetail
        },
        {
            path: '/admin/announcement/add',
            name: 'AddAnnouncement',
            component: AddAnnouncement
        },
        {
            path: '/announcement',
            name: 'userview',
            component: show
        },
        {
            path: '/announcement/:id',
            name: 'UserViewDetail',
            component: UserViewDetail
        },
        {
            path: '/ui/announcement/',
            name: 'userview PAGE',
            component: show
        },
        {
            path: '/admin/announcement/:id/edit',
            name: 'EditAnnouncement',
            component: EditAnnouncement
        },        
        {
            path: '/:notfoundpath(.*)',
            name: 'PageNotFound',
            component: PageNotFound        
        },
        {
            path: '/admin/user',
            name: 'UserManagement',
            component: UserManagement
        },
        {
            path: '/admin/user/add',
            name: 'AddUser',
            component: AddUser
        },
        {
            path: '/admin/user/:id/edit',
            name: 'EditUser',
            component: EditUser
        },
        {
            path: '/admin/user/match',
            name: 'PasswordMatch',
            component: PasswordMatch
        },
        {
            path: '/admin/announcement/dashboard',
            name: 'AnnouncementDashboard',
            component: Dashboard
        }
    ]
})
export default router