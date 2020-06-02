<template>
    <div class="p-author">
        <div class="author">
            <el-input
                type="text"
                v-model="username"
                :placeholder="'usernamePlaceholder'"
                @keyup.enter.native="switchLogin"
                autofocus
            ></el-input>
            <el-input
                v-model="password"
                :placeholder="'passwordPlaceholder'"
                @keyup.enter.native="switchLogin"
                show-password
            ></el-input>
            <el-button ref="submitBtn" :loading="loading" @click="oauth">{{ 'login' }}</el-button>
        </div>
    </div>
</template>
<script type="text/ecmascript-6">
// import * as api from '../js/api.js';
import * as enums from '../store/modules/app.enums.js';
import bus from '../vendors/eventbus.js';
import Storage from '../vendors/Storage.js';

/**
 * author
 * show local map as background, Custom in ./mock/*.navasmart.js.
 * switch oauth server or local server.
 * @author Dio Zhu
 * @date 2020.3.18
 */
export default {
    name: "author",
    // components: { vCanvasGrid, pPainterContours, pPainterPaths, pPainterVehicles },
    components: {},
    data () {
        return {
            map: {},
            dimensions: null,
            draggable: true,
            username: '',
            password: '',
            loading: false
        };
    },
    created() {
        this.clearCredentials();
        this.$store.commit(enums.CLOSE_FLOATER);
        bus.$emit('app.offlineConnect', 'LOGO');

        this.init();
    },
    beforeRouteLeave(to, from, next) {
        bus.$emit('app.reconnect');
        next();
    },
    methods: {
        init() {
            this.dimensions = [-80000, 300000, -120000, 80000];
        },
        async login() {
            this.$router.push({ name: 'index' });
        },
        async oauth() {
            this.$router.push({ name: 'index' });
        },

        // // CREDENTIALS RESOURCES
        clearCredentials() {
            Storage.getSessionStorage('CREDENTIALS').set('username', null);
            Storage.getSessionStorage('CREDENTIALS').set('authorHeader', null);
            Storage.getSessionStorage('CREDENTIALS').set('token', null);
            Storage.getSessionStorage('CREDENTIALS').set('wstoken', null);
            Storage.getSessionStorage('CREDENTIALS').set('subscriptions', null);
            Storage.getSessionStorage('SETTINGS').set('settings', null);
        }
    }
};
</script>
<style lang="scss">
.p-author {
    width: 100%;
    height: 100vh;
    position: relative;
    .v-canvas-grid,
    .p-painter-contours,
    .p-painter-paths,
    .p-painter-vehicles {
        position: absolute;
        left: 0;
        top: 0;
    }
}
.author {
    // #loginDialog
    // {
    position: absolute;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    margin: auto;
    padding: 2vmin;
    width: 300px;
    height: 168px;
    font-size: 22px;
    border-radius: 3px;
    background: white;
    box-sizing: border-box;
    box-shadow: 0 0 20px gray;

    display: flex;
    flex-direction: column;
    justify-content: space-between;
    // }

    input {
        width: 100%;
        height: 38px;
        border-radius: 3px;
        // padding: 0 1vmin;
        // border-width: 0.3vmin;
    }

    button {
        width: 100%;
        height: 38px;
        // border-width: 0.3vmin;
    }

    button:hover:enabled {
        box-shadow: 0 0 0.25rem gray;
    }
}
</style>
