<template>
    <i
        :class="['p-fullscreen', 'icon', isFullscreen ? 'icon-fullscreen-restore' : 'icon-fullscreen']"
        @click="handleClick"
    />
</template>

<script>
import Screenfull from 'screenfull';
/**
 * p-fullscreen
 * @author Dio Zhu
 * @date 2019.7.30
 */
export default {
    name: 'p-fullscreen',
    props: {},
    data() {
        return {
            isFullscreen: false
        };
    },
    mounted() {
        this.init();
    },
    beforeDestroy() {
        if (Screenfull.isEnabled) Screenfull.off('change', this.change);
    },
    methods: {
        init() {
            if (Screenfull.isEnabled) {
                Screenfull.on('change', this.change);
            }
        },
        change() {
            this.isFullscreen = Screenfull.isFullscreen;
        },

        handleClick() {
            console.warn(Screenfull);
            if (!Screenfull.isEnabled) {
                this.$message({ message: 'you browser can not work', type: 'warning' });
                return false;
            }
            Screenfull.toggle();
        }
    }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<!-- <style scoped lang="scss"> -->
<style rel="stylesheet/scss" lang="scss">
.p-fullscreen {
    cursor: pointer;
    font-size: 20px;
    font-weight: 300;
}
</style>
