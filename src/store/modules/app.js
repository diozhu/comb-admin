import * as enums from './app.enums.js';
import Storage from '../../vendors/Storage.js';

const app = {
    state: {
        theme: '',
        language: 'zh',
        sidebar: { opened: true, withoutAnimation: false },
        device: 'desktop',
        floaterOpened: false,
        helperOpened: false,
        currentRouteName: '',
        loading: 0,
        position: Object.create({}) // 滚动元素的位置信息
    },
    getters: {
        position: state => state.position
    },
    mutations: {
        [enums.SET_THEME]: (state, theme) => {
            state.theme = theme;
        },
        [enums.TOGGLE_SIDEBAR]: state => {
            state.sidebar.opened = !state.sidebar.opened;
            state.sidebar.withoutAnimation = false;
        },
        [enums.CLOSE_SIDEBAR]: (state, withoutAnimation) => {
            state.sidebar.opened = false;
            state.sidebar.withoutAnimation = withoutAnimation;
        },
        [enums.OPEN_SIDEBAR]: (state, withoutAnimation) => {
            state.sidebar.opened = true;
            state.sidebar.withoutAnimation = withoutAnimation;
        },
        [enums.SET_LANGUAGE]: (state, lang) => {
            state.language = lang;
            // Cookies.set('language', lang);
            Storage.getLocalStorage('I18N').set('LOCALE', lang);
        },
        [enums.OPEN_FLOATER]: (state, crn) => {
            state.floaterOpened = true;
            state.currentRouteName = crn;
        },
        [enums.CLOSE_FLOATER]: state => {
            state.floaterOpened = false;
            state.currentRouteName = null;
        },
        [enums.OPEN_HELPER]: (state, crn) => {
            state.helperOpened = true;
            state.currentRouteName = crn;
        },
        [enums.CLOSE_HELPER]: state => {
            state.helperOpened = false;
            state.currentRouteName = null;
        },
        [enums.SET_POSITION]: (state, { key = '-1', val = { id: '', x: 0, y: 0 } } = {}) => {
            state.position[key] = val;
        },
        [enums.TOGGLE_DEVICE]: (state, device) => {
            state.device = device;
        },
        [enums.OPEN_LOADING]: state => {
            state.loading = state.loading + 1;
        },
        [enums.CLOSE_LOADING]: state => {
            state.loading = state.loading > 0 ? state.loading - 1 : 0;
        }
    },
    actions: {
        //
    }
};

export default app;
