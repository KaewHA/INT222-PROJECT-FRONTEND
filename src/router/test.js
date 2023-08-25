import { createRouter, createWebHistory } from 'vue-router'
import anno_add from "../views/announcement/newUI/ann_add.vue"
import anno_edit from "../views/announcement/newUI/ann_edit.vue"
import anno_admin from "../views/announcement/newUI/ann_adminview.vue"
const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes: [
        {
            path: '/',
            name: 'Start',
            component: anno_add
        },
        {
            path: '/:id/edit',
            name: 'Starts',
            component: anno_edit
        },
        {
            path: '/admin/anno',
            name: 'Startss',
            component: anno_admin
        }
    ]
})
export default router