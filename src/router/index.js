import { createRouter, createWebHistory } from 'vue-router'
import AnnouncementDetail from '../views/announcement/AnnouncementDetail.vue'
import createapp from '../views/announcement/create.vue'
import indexinit from '../views/announcement/indexinit.vue'
import EditAnnouncement from '../views/announcement/EditAnnouncement.vue'
import AnnouncementTable from '../views/announcement/AnnouncementTable.vue'
import AddAnnouncement from '../views/announcement/AddAnnouncement.vue'
import userview from '../views/announcement/userview.vue'
import adminnewui from '../views/announcement/announcementManagement.vue'
import UserViewDetail from '../views/announcement/UserViewDetail.vue'
import show from '../views/announcement/paginashow.vue'
import PageNotFound from '../views/announcement/PageNotFound.vue'
import UserManagement from '../views/usermanage/UserManagement.vue'

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
        }
    ]
})
export default router