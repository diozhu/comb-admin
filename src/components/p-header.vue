<template>
    <div id="header" class="header p-header">
        <div class="header-left">
            <i class="menu icon icon-menu" :class="{ active: sidebar.opened }" @click="toggleSideBar"></i>
            <div class="meta-title">{{ $route.meta.title }}</div>
        </div>
        <div class="header-right">
            <p-fullscreen />
            <p-userinfo />
        </div>
    </div>
</template>

<script>
import { mapState } from 'vuex';
import * as enums from '../store/modules/app.enums.js';
import bus from '../vendors/eventbus.js';
import Storage from '../vendors/Storage.js';
import pFullscreen from '../components/p-fullscreen.vue';
import pUserinfo from '../components/p-userinfo.vue';
/**
 * p-header
 * @author Dio Zhu
 * @date 2019.7.30
 */
export default {
    name: 'p-header',
    props: {},
    components: { pFullscreen, pUserinfo },
    data() {
        return {
            offline: false, // just for demo... Dio Zhu. on 2020.1.8
            // el-tooltip options
            effect: 'dark',
            openDelay: 600
        };
    },
    computed: {
        ...mapState({
            sidebar: state => state.app.sidebar
        })
    },
    mounted() {
        this.init();
    },
    methods: {
        init() {
            // // just for demo... Dio Zhu. on 2020.1.8
            this.offline = Storage.getSessionStorage('RESOURCES').get('TYPE');
        },
        toggleSideBar() {
            this.$store.commit(enums.TOGGLE_SIDEBAR);
        },
        toggleOffline() {
            // console.warn('p-header.toggleSlideMap: ');
            this.offline = this.offline ? '' : 'OFFLINE';
            Storage.getSessionStorage('RESOURCES').set('TYPE', this.offline);
            if (this.offline) {
                bus.$emit('app.offlineConnect', 'OFFLINE');
            } else {
                bus.$emit('app.reconnect');
            }
        }
    }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<!-- <style scoped lang="scss"> -->
<style rel="stylesheet/scss" lang="scss">
.p-header {
    height: 50px;
    /*overflow: hidden;*/
    position: relative;
    background: #fff;
    box-shadow: 0 1px 4px rgba(0, 21, 41, 0.08);
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    z-index: 9;

    .header-left,
    .header-right {
        padding: 0 10px;
        display: flex;
        align-items: center;
    }

    .menu {
        flex: 0 0 auto;
        display: inline-block;
        font-size: 30px;
        font-weight: 300;
        transform: rotate(90deg);
        transition: transform 600ms;
        &.active {
            transform: rotate(0deg);
            transition: transform 600ms;
        }
    }

    .p-translation,
    .p-fullscreen,
    .icon {
        cursor: pointer;
        padding: 0 8px;

        &.red {
            color: red;
            font-weight: 900;
        }
    }
}
</style>
