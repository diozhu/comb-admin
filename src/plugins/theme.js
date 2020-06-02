// import store from './store/index.js';
import Theme from '../vendors/Theme.js';
import Storage from '../vendors/Storage.js';

let t = Storage.getLocalStorage('THEME').get('themeName');
if (t) {
    // store.commit(enums.SET_THEME, t);
    Theme.getInstance().setTheme(t);
} else {
    // store.commit(enums.SET_THEME, 'default');
    Theme.getInstance().setTheme('default');
}
