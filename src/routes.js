import layoutDefault from './layouts/default.vue';

let routes = [
    {
        name: 'home',
        path: '/',
        meta: { title: '首页', icon: 'home' },
        component: layoutDefault,
        children: [
            {
                name: 'index',
                path: '/index',
                meta: { title: '首页', icon: 'home' },
                component: () => import('./views/index.vue')
            }
        ]
    },
    {
        name: 'author',
        path: '/author',
        meta: { title: '登陆', icon: 'exit', hidden: true },
        component: () => import(/* webpackChunkName: "author" */ './views/author.vue')
    },
    {
        name: '404',
        path: '*',
        meta: { title: '404', group: '', hidden: true },
        component: () => import('./views/404.vue')
    }
];
// examples, only in local environment. Dio Zhu 2020.4.10
if (/172.20.|^localhost/g.test(window.location.host)) {
    routes.push({
        name: 'examples',
        path: '/examples',
        redirect: '/examples',
        meta: { title: 'test', icon: 'test' },
        component: layoutDefault,
        children: [
            {
                name: 't-table',
                path: '/t-table',
                meta: { title: 't-table' },
                component: () => import('./views/examples/t-table.vue')
            }
        ]
    });
}
export default routes;
