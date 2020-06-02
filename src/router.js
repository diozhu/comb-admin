import Vue from 'vue';
import Router from 'vue-router';
import bus from './vendors/eventbus.js';
import routes from './routes.js';
import store from './store/index.js';
import Storage from './vendors/Storage.js';
import * as enums from './store/modules/app.enums.js';

Vue.use(Router);

let router = new Router({
    mode: 'history',
    base: process.env.BASE_URL,
    routes
});
let removeEl = () => {
    if (document.querySelector('.v-modal')) {
        document.querySelector('.v-modal').parentNode.removeChild(document.querySelector('.v-modal'));
    }
};
router.beforeEach((to, from, next) => {
    removeEl();
    console.info('router.beforeEach: ------ BEFORE ------ ', ' from: ', from, ', to: ', to);
    // 路由跳转，显示菊花~ Dio Zhu. on 2017.2.17, 回退时不显示菊花。。。mod by Dio Zhu. on 2017.8.25
    if (store.state && !to.matched.some(v => v.meta.disableLoading) && router.direct(to, from) >= 0) {
        store.commit('OPEN_LOADING');
    }

    /**
     * 离开前记录当前页面滚动条位置
     *              -- Dio Zhu. on 2017.3.25
     * 方式一：由于滚动元素不固定，每次需要在$router.scrollTarget中保存滚动dom（如果没有，会默认.page），在此获取滚动位置，保存到vuex，路由跳转后再恢复。。。
     * 此方式需要每次去保存滚动dom，涉及回退以及动画+keep-alive之后，逻辑会异常复杂。
     * 方式二：通过v-scroll-position指令完成，原理是通过监听滚动事件，付给自定义属性Attribute：scroll-position，不牵扯保存dom和信息的问题，更直观些。。。
     * 比上面那个方便点儿，只需要在每个需要保留位置的元素上添加指令即可；
     */

    try {
        // 获取"有效"滚动条容器的滚动位置
        if (store.state) {
            /** 保存位置信息，用于判断路由的前进后退 */
            let key = from.query.timestamp,
                obj = Object.create(null);
            router.direction = router.direct(to, from); // 路由跳转时记录目标页面的打开方式：进入(1)、回退(-1)还是刷新(0). mod by Dio Zhu. on 2018.7.31
            store.commit('SET_POSITION', { key: key, val: obj });
            console.log('===>>> router.beforeEach.SET_POSITION: ', key);
        }
    } catch (e) {
        console.error('router.beforeEach: ', e);
    }

    let token = Storage.getSessionStorage('CREDENTIALS').get('authorHeader');
    if (to.meta && to.meta.requireAuth && (!token || !token.length) && to.path !== '/author') {
        // singin again ...
        router.push({ name: 'author' });
        return;
    }

    if (!to.matched.length) next({ path: '/404' });
    next();
});

// router.afterEach((to, from) => {
router.afterEach(to => {
    // console.info('[router.js] router.afterEach: ------ AFTER ------ ', ' from: ', from, ', to: ', to);
    /** set title */
    if (to.meta && to.meta.title) {
        router.setTitle(to.meta.title);
    } else {
        router.setTitle(process.env.VUE_APP_TITLE || '');
    }

    // let token = Storage.getSessionStorage('CREDENTIALS').get('authorHeader');
    // if (sets && vueIns && (!vueIns.settings || !vueIns.settings.length)) {
    //     vueIns.settings = sets;
    // }

    /**
     * 埋点
     *              -- Dio Zhu. on 2017.6.1
     */

    try {
        // 路由跳转，隐藏菊花~ Dio Zhu. on 2017.2.17
        // console.log('===>>> router.afterEach ===>>> ', router.app.$store);
        if (store && store.state) {
            store.commit('CLOSE_LOADING');
            // store.commit('CLOSE_LOADING');
        }
    } catch (e) {
        console.error('router.afterEach: ', e);
    }
});

router.setTitle = function(title) {
    document.title = title;
    try {
        setTitle(title); //eslint-disable-line
    } catch (e) {} //eslint-disable-line
};

router.direct = (to, from) => {
    if (from && to) {
        // 方式二、根据from和to里的时间戳大小判断前后顺序
        // console.log('router.direct: ------> ', from, to);
        // 如果刷新：path==='/' 或者首页：path相等
        if (from.path === '/' && !from.name) return 0; // 首页或刷新
        // 来源无时间戳，进入
        if (from.query && !from.query.timestamp) return 1;
        // to无时间戳，返回
        if (to.query && !to.query.timestamp) return -1;
        // 根据时间戳大小判断进入或是返回
        if (from.query && to.query && to.query.timestamp < from.query.timestamp) return -1;
        else return 1;
    }
    // 方式一、根据store存储的时间戳判断是否来过，有问题：在后续页面刷新后，再返回时，store会找不到时间戳，被判断为新页面。。。
    if (store.getters.position.hasOwnProperty(router.currentRoute.query.timestamp)) {
        return 0; // 回退
    }
    return 1; // 进入
};

router.goon = () => {
    let url = Storage.getSessionStorage('AUTH').get('beforeLoginUrl');
    url = decodeURIComponent(url);
    if (!url || url.indexOf('/auth') !== -1) router.go(-1);
    else router.replace({ path: url });
};

/**
 * 复写vue的push和replace，在query中添加时间戳，以此保存各页面的滚动条位置信息，用于回退时的滚动条复位，需与keep-alive配合使用。
 *              -- Hao Chai. on 2016.12.20, copy from the project of 'answer'
 * 原打算不使用这种方式，直接使用scrollBehavior复位
 * 但是页面keep-alive后，scrollBehavior由于transition或渲染原因使得滚动条无法准确复位。。。
 *              -- Mod by Dio Zhu. on 2017.3.15
 */
let p = router.push,
    r = router.replace;
router.push = function(params) {
    let tag = Date.now();
    if (params.query) params.query.timestamp = tag;
    else params.query = { timestamp: tag };

    // if slide routes. Dio Zhu. on 2019.3.19
    let toTag = '',
        toIdx = this.currentRoute.matched.findIndex(v => v.components && Object.keys(v.components).length > 1);
    //  if: !mobild && go detail && multi route components, then slide next page, not route id. Dio Zhu. on 2019.3.19
    // console.warn('[router] push: ', store.state.app.device, /-detail/.test(params.name), toIdx);
    if (store.state.app.device !== 'mobile' && /-detail/.test(params.name) && toIdx >= 0) {
        let to = this.currentRoute.matched[toIdx];
        // console.warn('-----> ', to.components, params.name);
        if (!to.components.details || to.components.details.name !== params.name) {
            // if not default
            Object.keys(to.components).forEach(k => {
                if (to.components[k].name === params.name) toTag = k;
            });
        } else toTag = 'details';
    }
    if (toTag) {
        // console.warn('-----> ', toTag, params.name, params);
        store.commit(enums.OPEN_FLOATER, toTag);
        setTimeout(() => {
            bus.$emit(params.name + '.init', { args: params });
        }, 0);
        return;
    }

    // console.warn('[router] push: ', toTag, params.name, params);
    p.call(router, params);
};
router.replace = function(params) {
    let tag = Date.now();
    if (params.query) params.query.timestamp = tag;
    else params.query = { timestamp: tag };
    r.call(router, params);
};

export default router;
