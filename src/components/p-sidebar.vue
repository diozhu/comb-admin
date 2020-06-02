<template>
    <div class="p-sidebar">
        <a class="logo" href="https://www.navasmart.com" target="_blank">
            <img v-if="collapse" class="w_34" :src="logoSmallUrl" />
            <!--<img v-if="collapse" src="../assets/images/navaLogo.svg" />-->
            <img v-else :src="logoUrl" />
        </a>
        <el-scrollbar wrap-class="scrollbar-wrapper">
            <!--:background-color="variables.menuBg"
            :text-color="variables.menuText"
            :active-text-color="variables.menuActiveText"-->
            <el-menu
                :default-active="activeMenu"
                :collapse="isCollapse"
                :unique-opened="false"
                :collapse-transition="false"
                mode="vertical"
            >
                <p-sidebar-item v-for="route in list" :key="route.path" :item="route" :base-path="route.path" />
            </el-menu>
        </el-scrollbar>
    </div>
</template>

<script>
import { mapState } from 'vuex';
import pSidebarItem from './p-sidebar-item.vue';
import variables from '../scss/variables.scss';
import * as utils from '../js/utils.js';

/**
 * p-sidebar
 * @author Dio Zhu
 * @date 2019.7.30
 */
export default {
    name: 'p-sidebar',
    components: { pSidebarItem },
    props: {
        collapse: {
            type: Boolean,
            default: false
        }
    },
    data() {
        return {
            list: [],
            logoUrl: utils.thumb(process.env.VUE_APP_OSS_URL + '/logo_blue.png', { width: 260 }),
            logoSmallUrl: utils.thumb(process.env.VUE_APP_OSS_URL + '/logo_small_blue.png', { width: 68 })
        };
    },
    computed: {
        ...mapState({
            sidebar: state => state.app.sidebar
        }),
        variables() {
            return variables;
        },
        activeMenu() {
            const { meta, path } = this.$route;
            // if set path, the sidebar will highlight the path you set
            if (meta.activeMenu) {
                return meta.activeMenu;
            }
            return path;
        },
        isCollapse() {
            return !this.sidebar.opened;
        }
    },
    mounted() {
        this.init();
    },
    methods: {
        init() {
            this.list = this.getDevMenus();
        },
        getDevMenus() {
            let menus = [],
                routes = require('../routes.js').default;
            [].forEach.call(routes, m => {
                if (m.meta && m.meta.hidden) return;
                let menu = {},
                    subs = [];
                menu.name = (m.meta && m.meta.title) || '';
                menu.action = m.path;
                menu.top_icon = (m.meta && m.meta.icon) || '';
                (m.children || []).forEach(s => {
                    if (m.meta.hidden || s.meta.hidden) return;
                    subs.push({
                        name: s.meta.title,
                        action: s.path,
                        top_icon: (s.meta && s.meta.icon) || ''
                    });
                });
                menu['subMenuList'] = subs;
                menus.push(menu);
            });
            return menus;
        }
    }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<!-- <style scoped lang="scss"> -->
<style lang="scss">
@import '../scss/variables.scss';

.p-sidebar {
    transition: width 0.28s;
    width: $sideBarWidth !important;
    /*background-color: $menuBg;*/
    height: 100%;
    position: fixed;
    font-size: 0px;
    top: 0;
    bottom: 0;
    left: 0;
    z-index: 1001;
    overflow: hidden;

    .logo {
        height: 50px;
        display: flex;
        align-items: center;
        justify-content: flex-start;
        padding-left: 20px;

        img {
            flex: 0 0 auto;
            width: 43%;
            // display: none;
        }
    }

    // reset element-ui css
    .horizontal-collapse-transition {
        transition: 0s width ease-in-out, 0s padding-left ease-in-out, 0s padding-right ease-in-out;
    }

    .scrollbar-wrapper {
        overflow-x: hidden !important;
        background: #ffffff;
    }

    .el-scrollbar__bar.is-vertical {
        right: 0px;
    }

    .el-scrollbar {
        height: 100%;
    }

    &.has-logo {
        .el-scrollbar {
            height: calc(100% - 50px);
        }
    }

    .is-horizontal {
        display: none;
    }

    a {
        display: inline-block;
        width: 100%;
        overflow: hidden;
    }

    .svg-icon {
        margin-right: 16px;
    }

    .el-menu {
        border: none;
        height: 100%;
        width: 100% !important;
    }
}

.hideSidebar {
    /*.p-sidebar {*/
    /*    width: 54px !important;*/
    /*}*/

    /*.app-container {*/
    /*    margin-left: 54px;*/
    /*}*/

    .submenu-title-noDropdown {
        padding: 0 !important;
        position: relative;

        .el-tooltip {
            padding: 0 !important;

            .svg-icon {
                margin-left: 20px;
            }
        }
    }

    .el-submenu {
        overflow: hidden;

        & > .el-submenu__title {
            padding: 0 !important;

            .svg-icon {
                margin-left: 20px;
            }

            .el-submenu__icon-arrow {
                display: none;
            }
        }
    }

    .el-menu--collapse {
        .el-submenu {
            & > .el-submenu__title {
                & > span {
                    height: 0;
                    width: 0;
                    overflow: hidden;
                    visibility: hidden;
                    display: inline-block;
                }
            }
        }
    }

    .el-menu-item,
    .el-submenu__title {
        display: flex;
        justify-content: center;

        & > span {
            display: none;
        }
    }
}
</style>
