import Storage from './Storage.js';
import Color from './Color.js';

let themeInstance = null;
class Theme {
    constructor() {
        this.local = Storage.getLocalStorage('THEME');
        this.DEFAULT_THEMES = [
            { name: 'default', key: 'default', value: '#409EFF' },
            { name: 'scientific', key: 'scientific', value: '#303540' },
            { name: 'orange', key: 'orange', value: '#FF7100' },
            { name: 'industry', key: 'industry', value: '#5A597C' }
        ];
        this.cdn = '//vendors.91wuliu.com'; // element's cdn address, back to source
        this.elementVersion = require('element-ui/package.json').version; // element-ui version from node_modules
        this.elementOrigin = '';
        this.defaultColor = '#409EFF'; // #408ED6, #409EFF
        this.currentColor = '#409EFF';
    }

    static getInstance() {
        if (!themeInstance) themeInstance = new Theme();
        return themeInstance;
    }

    getDefaultThemes() {
        return this.DEFAULT_THEMES;
    }

    setRatio(ratio) {
        this.local.set('ratio', ratio);
        this.updateRatio(ratio);
    }

    setTheme(theme = 'default', color) {
        // if (!theme) theme = 'default';
        // console.info('[Theme] setTheme: ', theme, color);
        this.local.set('themeName', theme);
        document.body.className = theme;

        if (theme !== 'default' && color) {
            document.body.className += ' ' + Color.lightOrDark(color);
        }
        this.update(color); // TODO:
        // this.updateCustom(color, theme);
    }

    async update(color = this.defaultColor, themeName = 'default') {
        // console.info('[Theme] update: 1 -> ', color, !!this.elementOrigin);
        let oldVal = this.elementOrigin ? this.currentColor : this.defaultColor;
        this.currentColor = color;
        if (!this.elementOrigin) this.elementOrigin = await this.getElementCss();
        let chalkHandler = this.getHandler('chalk', 'chalk-style');
        chalkHandler();

        // console.info('[Theme] updateStyle: ', this.elementVersion, origin);
        const styles = [].slice.call(document.querySelectorAll('style')).filter(style => {
            const text = style.innerText;
            return new RegExp(oldVal, 'i').test(text) && !/Chalk Variables/.test(text);
        });
        // console.info('[Theme] update: 2 -> ', oldVal, styles);
        const themeCluster = this.getThemeCluster(this.currentColor.replace('#', ''));
        const originalCluster = this.getThemeCluster(oldVal.replace('#', ''));

        // let str = '';
        styles.forEach(style => {
            const { innerText } = style;
            if (typeof innerText !== 'string') return;
            style.innerText = this.updateStyle(innerText, originalCluster, themeCluster);
            // str += style.innerText;
        });
        this.updateCustom(color, themeName);
    }
    async getElementCss() {
        let url = this.cdn + '/element-ui/' + this.elementVersion + '/theme-chalk/index.css';
        // let url = `https://unpkg.com/element-ui@${this.elementVersion}/lib/theme-chalk/index.css`;
        return new Promise(resolve => {
            const xhr = new XMLHttpRequest();
            xhr.onreadystatechange = () => {
                if (xhr.readyState === 4 && xhr.status === 200) {
                    let rtn = xhr.responseText.replace(/@font-face{[^}]+}/, '');
                    resolve(rtn);
                }
            };
            xhr.open('GET', url);
            xhr.send();
        });
    }
    getHandler(variable, id) {
        return () => {
            const originalCluster = this.getThemeCluster(this.defaultColor.replace('#', ''));
            const themeCluster = this.getThemeCluster(this.currentColor.replace('#', ''));
            const newStyle = this.updateStyle(this.elementOrigin, originalCluster, themeCluster);

            let styleTag = document.getElementById(id);
            if (!styleTag) {
                styleTag = document.createElement('style');
                styleTag.setAttribute('id', id);
                document.head.appendChild(styleTag);
            }
            styleTag.innerText = newStyle;
        };
    }
    getThemeCluster(theme) {
        const tintColor = (color, tint) => {
            let red = parseInt(color.slice(0, 2), 16);
            let green = parseInt(color.slice(2, 4), 16);
            let blue = parseInt(color.slice(4, 6), 16);

            if (tint === 0) {
                // when primary color is in its rgb space
                return [red, green, blue].join(',');
            } else {
                red += Math.round(tint * (255 - red));
                green += Math.round(tint * (255 - green));
                blue += Math.round(tint * (255 - blue));

                red = red.toString(16);
                green = green.toString(16);
                blue = blue.toString(16);

                return `#${red}${green}${blue}`;
            }
        };

        const shadeColor = (color, shade) => {
            let red = parseInt(color.slice(0, 2), 16);
            let green = parseInt(color.slice(2, 4), 16);
            let blue = parseInt(color.slice(4, 6), 16);

            red = Math.round((1 - shade) * red);
            green = Math.round((1 - shade) * green);
            blue = Math.round((1 - shade) * blue);

            red = red.toString(16);
            green = green.toString(16);
            blue = blue.toString(16);

            return `#${red}${green}${blue}`;
        };

        const clusters = [theme];
        for (let i = 0; i <= 9; i++) {
            clusters.push(tintColor(theme, Number((i / 10).toFixed(2))));
        }
        clusters.push(shadeColor(theme, 0.1));
        return clusters;
    }
    updateStyle(style, oldCluster, newCluster) {
        let newStyle = style;
        oldCluster.forEach((color, index) => {
            newStyle = newStyle.replace(new RegExp(color, 'ig'), newCluster[index]);
        });
        return newStyle;
    }

    updateCustom(color = this.defaultColor, themeName = 'default') {
        // this.reload
        // let nod = document.createElement('style');
        // console.info('[Theme] updateCustom: 1 => ', color, themeName);
        if (themeName === 'default' || !themeName) return;
        let themeType = Color.lightOrDark(color),
            isDark = themeType === 'dark',
            lighten01 = Color.lightenDarkenColor(color, 0.01),
            lighten1 = Color.lightenDarkenColor(color, 0.1),
            lighten2 = Color.lightenDarkenColor(color, 0.2),
            lighten4 = Color.lightenDarkenColor(color, 0.4),
            lighten6 = Color.lightenDarkenColor(color, 0.6),
            lighten8 = Color.lightenDarkenColor(color, 0.8),
            lighten9 = Color.lightenDarkenColor(color, 0.9),
            textColor = isDark ? '#f2f2f4' : '#606266',
            // textColor = isDark ? lighten2 : lighten8,
            // textColor1 = Color.lightenDarkenColor(textColor, 0.1),
            // textColor2 = Color.lightenDarkenColor(textColor, 0.2),
            textColor4 = Color.lightenDarkenColor(textColor, 0.4),
            // textColor6 = Color.lightenDarkenColor(textColor, 0.6),
            textColor8 = Color.lightenDarkenColor(textColor, 0.8);
        console.info(
            '[Theme] updateCustom: 2 => ',
            themeType,
            isDark,
            lighten1,
            lighten2,
            lighten4,
            lighten6,
            textColor
        );

        let str = `
            body.${themeName} { background: ${lighten01}; }
            body.${themeName} .p-sidebar .scrollbar-wrapper { background: ${lighten8}; }
            body.${themeName} .el-menu { background: ${lighten8}; }
            body.${themeName} .el-menu .el-menu-item { color: ${textColor8}; }
            body.${themeName} .el-menu .el-menu-item i { color: ${textColor4}; }
            body.${themeName} .el-menu .el-menu-item.is-active { background: ${lighten6}; }
            body.${themeName} .el-menu .el-menu-item.is-active { color: ${textColor8}; }
            body.${themeName} .el-menu .el-menu-item.is-active i { color: ${textColor4}; }
            body.${themeName} .el-menu .el-menu-item:hover { background: ${lighten4}; }
            body.${themeName} .el-submenu .el-menu { background: ${lighten9}; box-shadow: 0 0 5px ${textColor} inset;}
            body.${themeName} .v-table-wrapper__header-wrapper { background: ${lighten1};}
            body.${themeName} .v-table-body__record:hover { background: ${lighten1};}
            body.${themeName} .v-table-body__record.selected { background: ${lighten1};}
            body.${themeName} .detail-header { background: ${lighten1};}
        `;

        let r = this.local.get('ratio');
        this.updateRatio(r);

        let id = 'themeCustom',
            nod = document.getElementById(id);
        if (!nod) {
            nod = document.createElement('style');
            nod.setAttribute('id', id);
            document.head.appendChild(nod);
        }
        nod.innerText = str;
    }
    // Recaculate font size by ratio. Dio Zhu. on 2020.4.10
    updateRatio(ratio) {
        let r = ratio,
            rs = Math.round((r / 100) * 6);
        // themeName = this.local.get('themeName');
        // console.warn('[Theme] updateRatio: ', themeName, r, rs);
        let str = `
            .el-menu .el-menu-item { font-size: ${14 + rs}px; }
            .meta-title { font-size: ${14 + rs}px; }
            .v-table-wrapper .v-table-header-column { font-size: ${12 + rs}px; }
            .v-table-wrapper .v-table-body-column { font-size: ${12 + rs}px; }
            .el-collapse-item__header { font-size: ${13 + rs}px; }
            .el-form-item__label { font-size: ${14 + rs}px; }
            .el-form-item__content { font-size: ${14 + rs}px; line-height: ${14 + rs}px; }
            .p-panel .v-text, .details .v-text { margin: ${6 + rs}px 0; }
        `;

        let id = 'themeRatio',
            nod = document.getElementById(id);
        if (!nod) {
            nod = document.createElement('style');
            nod.setAttribute('id', id);
            document.head.appendChild(nod);
        }
        nod.innerText = str;
    }
}

export default Theme;
