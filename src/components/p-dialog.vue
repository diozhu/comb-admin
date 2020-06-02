<template>
    <div class="p-dialog">
        <!-- <el-dialog :visible.sync="dialogVisible" :title="dialogTitle" width="30%">
            <template v-if="value === 'connecting'">
                <i class="el-icon-loading"></i>
                <span>{{ $i18n.t('lang.connecting') }}</span>
            </template>
        </el-dialog> -->
    </div>
</template>

<script>
/**
 * p-dialog
 * global alarm, for example, it will be open before websocket connected
 * @author Dio Zhu
 * @date 2019.7.30
 */
export default {
    name: 'p-dialog',
    components: {},
    props: {
        value: String
    },
    data() {
        return {
            loading: null
        };
    },
    computed: {
        dialogVisible() {
            return !!this.value;
        },
        dialogTitle() {
            return 'warning';
        }
    },
    watch: {
        value() {
            this.init();
        }
    },
    mounted() {
        this.init();
    },
    beforeDestroy() {
        this.loadingClose();
    },
    methods: {
        init() {
            console.log('p-dialog.init: ');
            if (this.value) this.loadingInit();
            else this.loadingClose();
        },
        loadingInit() {
            this.loading = this.$loading({
                lock: true,
                text: 'connecting',
                spinner: 'el-icon-loading',
                background: 'rgba(0, 0, 0, 0.7)'
            });
        },
        loadingClose() {
            if (this.loading) this.loading.close();
        }
    }
};
</script>

<style lang="scss">
.p-dialog {
}
</style>
