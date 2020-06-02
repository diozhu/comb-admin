<template>
    <!-- <div id="app" v-kernel> -->
    <div id="app">
        <router-view />
    </div>
</template>

<script type="text/ecmascript-6">
import { mapState } from 'vuex';
import * as enums from './store/modules/app.enums.js';

export default {
    data() {
        return {};
    },
    computed: {
        ...mapState({
            loading: state => state.app.loading
        })
    },
    created() {
        this.init();
    },
    beforeDestroy() {
    },
    methods: {
        async init() {
            console.log('App.init: ');
            // // display global mask
            // bus.$emit('global.dialog', 'connecting');
            this.$store.commit(enums.OPEN_LOADING);
            if (this.loading) this.$store.commit(enums.CLOSE_LOADING);
        },
    }
};
</script>

<style lang="scss">
@import './scss/app';

#app {
    /*!*font-family: "Avenir", Helvetica, Arial, sans-serif;*!*/
    /*!*-webkit-font-smoothing: antialiased;*!*/
    /*!*-moz-osx-font-smoothing: grayscale;*!*/
    /*font-family: 'Share Tech', 'Noto Sans SC', sans-serif;*/
    /*text-align: center;*/
    /*color: #2c3e50;*/
}
#nav {
    padding: 30px;
    a {
        font-weight: bold;
        color: #2c3e50;

        &.router-link-exact-active {
            color: #42b983;
        }
    }
}
</style>
