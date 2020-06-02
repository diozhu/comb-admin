<template>
    <div class="app-wrapper" :class="classObj">
        <p-dialog v-if="dialog" :value="dialog"></p-dialog>
        <p-sidebar :collapse="collapse"></p-sidebar>
        <div class="app-container">
            <p-header></p-header>
            <section class="app-main">
                <transition name="fade-transform" mode="out-in">
                    <keep-alive>
                        <router-view v-if="$route.meta.keepAlive" class="routerDetailStaly" ref="page" :key="key" />
                    </keep-alive>
                </transition>
                <transition name="fade-transform" mode="out-in">
                    <router-view v-if="!$route.meta.keepAlive" class="routerDetailStaly" :key="key"></router-view>
                </transition>

                <!-- details -->
                <transition name="slide-transform" mode="out-in">
                    <router-view
                        v-if="floaterTag && (!currentRouteName || currentRouteName == 'details')"
                        name="details"
                        ref="page"
                        :key="'details_' + key"
                        class="float-right"
                    />
                </transition>
                <transition name="slide-transform" mode="out-in">
                    <router-view
                        v-if="floaterTag && currentRouteName == 'detailSecond'"
                        name="detailSecond"
                        :key="'details_sec_' + key"
                        class="float-right medium"
                    />
                </transition>
                <transition name="slide-transform" mode="out-in">
                    <router-view
                        v-if="floaterTag && currentRouteName == 'detailThird'"
                        name="detailThird"
                        :key="'details_thd_' + key"
                        class="float-right max"
                    />
                </transition>
            </section>
        </div>
    </div>
</template>

<script>
import * as enums from '../store/modules/app.enums.js';
import { mapState } from 'vuex';
import pHeader from '../components/p-header.vue';
import pSidebar from '../components/p-sidebar.vue';
import resizeHandler from '../mixins/resize-handler.js';
import Modal from '../vendors/Modal.js';
import pDialog from '../components/p-dialog.vue';
import bus from '../vendors/eventbus.js';

export default {
    name: 'default.vue',
    components: {
        pHeader,
        pSidebar,
        pDialog
    },
    mixins: [resizeHandler],
    data() {
        return {
            dialog: ''
        };
    },
    computed: {
        ...mapState({
            loading: state => state.app.loading,
            sidebar: state => state.app.sidebar,
            floaterTag: state => state.app.floaterOpened,
            currentRouteName: state => state.app.currentRouteName,
            device: state => state.app.device
        }),
        key() {
            return this.$route.fullPath;
        },
        collapse() {
            return !this.sidebar.opened;
        },
        classObj() {
            return {
                hideSidebar: !this.sidebar.opened,
                openSidebar: this.sidebar.opened,
                withoutAnimation: this.sidebar.withoutAnimation,
                mobile: this.device === 'mobile'
            };
        }
    },
    watch: {
        loading: {
            handler(val) {
                if (val) this.dialog = 'connecting';
                else this.dialog = '';
            },
            deep: true,
            immediate: true
        },
        floaterTag(val) {
            if (val) Modal.getModal({ clickFunc: () => this.$store.commit(enums.CLOSE_FLOATER) });
            else Modal.removeModal();
        },
        isHelperActive() {
            bus.$emit('p-painter.repaint');
        }
    },
    mounted() {
        this.init();
    },
    methods: {
        init() {
            // console.log('layout.default.init: ');
        }
    }
};
</script>

<style rel="stylesheet/scss" lang="scss">
@import '../scss/variables';
.app-wrapper {
    width: 100%;
    height: 100%;
    display: flex;

    .p-sidebar {
        flex: 0 0 auto;
        width: $sideBarWidth;

        .el-scrollbar {
            height: calc(100vh - 50px);
        }
    }

    .app-container {
        width: calc(100% - 210px - 380px);
        flex: 1 1 auto;
        margin-left: $sideBarWidth;
    }

    .app-main {
        width: 100%;
        min-height: calc(100vh - 50px);
        box-shadow: 0px 0px 6px #ccc inset;
        display: flex;
    }
}

.app-wrapper .float-right {
    width: 38.2%;
    height: 100%;
    overflow: auto;
    position: fixed;
    top: 0;
    right: 0;
    margin: 0;
    z-index: 1900;
    box-sizing: border-box;
    border-left: #2d2f33 1px solid;
    background: #ffffff;
    box-shadow: -10px 0px 30px #333;

    &.medium {
        width: 61.8%;
    }

    &.max {
        width: 80%;
    }
}

.app-wrapper.helper-active .float-right {
    // width: calc(38.2vw + 380px);
    right: 380px;
}

.app-wrapper .slide-right {
    position: relative;
    // width: 38.2%;
    // height: calc(100vh - 50px);
    width: 380px;
    height: 100vh;
    overflow: auto;
    box-sizing: border-box;
    border-left: #c1c1c1 1px solid;
    background: #fbfbec;
    box-shadow: 3px 0px 6px #ccc inset;
    padding: 16px;
    z-index: 1999;
}

.hideSidebar .fixed-header {
    /*width: calc(100% - 54px);*/
}

.hideSidebar {
    .p-sidebar {
        width: 54px !important;
    }

    .app-container {
        margin-left: 54px;
    }
}
</style>
