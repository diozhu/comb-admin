<template>
    <el-dropdown trigger="click" class="p-userinfo" @command="handleCommand">
        <div class="avatar">
            <el-avatar size="small" :src="avatar"></el-avatar>
        </div>
        <el-dropdown-menu class="p-userinfo__dropdown" slot="dropdown">
            <!-- theme -->
            <el-dropdown-item command="zh" class="p-userinfo__theme">
                <i class="icon icon-skin"></i>
                <div
                    class="bg-box"
                    v-for="item in themeOptions"
                    :key="item.key"
                    :style="{ backgroundColor: item.value }"
                    @click="handleThemeClick(item)"
                >
                    <i v-if="currentTheme == item.key" class="el-icon-check"></i>
                </div>
                <el-color-picker
                    v-model="currentThemeColor"
                    class="skin-picker"
                    size="mini"
                    @change="handleColorChange"
                ></el-color-picker>
            </el-dropdown-item>
            <!-- font size -->
            <el-dropdown-item>
                <i class="icon icon-textformat"></i>
                <el-slider class="p-userinfo__slider" v-model="ratio" :show-tooltip="false"></el-slider>
            </el-dropdown-item>

            <!-- logout -->
            <el-dropdown-item command="logout">
                <i class="icon icon-exit"></i>
                <p>{{ 'logout' }}</p>
            </el-dropdown-item>
        </el-dropdown-menu>
    </el-dropdown>
</template>

<script>
import * as enums from '../store/modules/app.enums.js';
import Theme from '../vendors/Theme.js';
import Storage from '../vendors/Storage.js';
const elementVersion = require('element-ui/package.json').version; // element-ui version from node_modules
/**
 * p-userinfo
 * @author Dio Zhu
 * @date 2019.7.30
 */
export default {
    name: 'p-userinfo',
    props: {},
    data() {
        return {
            ossUrl: process.env.VUE_APP_OSS_URL,
            avatar: process.env.VUE_APP_DEFAULT_AVATAR,
            themeOptions: Theme.getInstance().getDefaultThemes(),
            local: null,
            currentTheme: 'default',
            currentThemeColor: '#408ED6',
            ratio: 0
        };
    },
    computed: {
        language() {
            return this.$store.getters.language;
        }
    },
    watch: {
        ratio(val) {
            // let lo = Storage.getLocalStorage('THEME');
            // lo.set('ratio', val);
            Theme.getInstance().setRatio(val);
        }
    },
    created() {
        this.init();
    },
    methods: {
        init() {
            this.local = Storage.getLocalStorage('THEME');
            this.currentTheme = this.local.get('themeName') || 'default';
            this.currentThemeColor = this.local.get('themeColor') || '#408ED6';

            console.log('p-userinfo.init: elementVersion: ', elementVersion);
            this.currentThemeColor = this.currentThemeColor.toLocaleLowerCase();
            // // if (this.currentTheme !== 'default') Theme.addStyle(this.currentThemeColor, this.currentTheme);
            // Theme.updateCustom(this.currentThemeColor, this.currentTheme);
            Theme.getInstance().update(this.currentThemeColor, this.currentTheme);

            this.ratio = this.local.get('ratio');
        },
        handleThemeClick(item) {
            this.currentTheme = item.key;
            this.$store.commit(enums.SET_THEME, item.key);
            Theme.getInstance().setTheme(item.key, item.value);
            this.local.set('themeColor', item.value);
            if (item.key !== 'default') {
                // Theme.updateCustom(item.value, item.key);
                Theme.getInstance().update(item.value, item.key);
            }
        },
        handleColorChange(val) {
            console.log('p-userinfo.handleColorChange: ', ...arguments);
            if (!val) return;
            this.currentTheme = 'colorPicker';
            this.$store.commit(enums.SET_THEME, 'colorPicker');
            Theme.getInstance().setTheme('colorPicker', val);
            this.local.set('themeColor', val);
            // Theme.updateCustom(val, 'colorPicker');
            Theme.getInstance().update(val, 'colorPicker');
            // // this.dark = Theme.lightOrDark(val);
        },
        handleCommand(command) {
            console.log('p-userinfo.handleCommand: ', command);
            if (command === 'userCenter') this.$router.push({ name: 'user-center' });
            else if (command === 'logout') this.$router.push({ name: 'author' });
        }
    }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<!-- <style scoped lang="scss"> -->
<style rel="stylesheet/scss" lang="scss">
.p-userinfo {
    .avatar {
        width: 40px;
        height: 40px;
        margin: 0 10px;
        cursor: pointer;
        border: #999999 1px solid;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        box-shadow: 0 0 3px #999999;

        .el-avatar {
            width: 100%;
            height: initial;
            background: transparent;
        }

        img {
            width: 100%;
        }
    }
}
.p-userinfo__dropdown .el-dropdown-menu__item {
    width: 130px;
    display: flex;
    align-items: center;
    line-height: 12px;
}
.p-userinfo__theme {
    cursor: pointer;

    .bg-box {
        width: 20px;
        height: 20px;
        border-radius: 3px;
        margin-right: 3px;

        .el-icon-check {
            width: 100%;
            line-height: 20px;
            font-size: 13px;
            font-weight: 700;
            color: whitesmoke;
            display: block;
            text-align: center;
        }
    }
}

.p-userinfo__slider {
    width: 70%;
    margin: 0 0 0 10px;
}
</style>
