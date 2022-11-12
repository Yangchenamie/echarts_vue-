import Vue from 'vue'
import VueRouter from 'vue-router'
// import sellerPage from '../views/sellerPage.vue'
// import trendPage from '../views/trendPage.vue'
// import mapPage from '@/views/MapPage.vue'
// import rankPage from '@/views/RankPage.vue'
// import hotPage from '@/views/hotPage.vue'
// import stockPage from '@/views/StockPage.vue'
import screenPage from '@/views/ScreenPage.vue'
Vue.use(VueRouter)

const routes = [
    {
        path:'/',
        component:screenPage
    },
    {
        path:'/screenpage',
        component:screenPage
    }

    // {
    //     path:'/sellerpage',
    //     component:sellerPage
    // },
    // {
    //     path:'/trendpage',
    //     component:trendPage
    // },
    // {
    //     path:'/mappage',
    //     component:mapPage
    // },
    // {
    //     path:'/rankpage',
    //     component:rankPage
    // },
    // {
    //     path:'/hotpage',
    //     component:hotPage
    // },
    // {
    //     path:'/stockpage',
    //     component:stockPage
    // }
]
 
const router = new VueRouter({
    routes
})

export default router