<template>
    <div class="page page-error">
        <h2>404 page not found</h2>
    </div>
</template>

<script>
export default {
    components: {},

    data() {
        return {};
    },

    mounted() {
        console.log('404 page not found...');
    },

    methods: {}
};
</script>

<style rel="stylesheet/scss" lang="scss">
.page-error {
    h2 {
        margin: 150px 0 0 0 !important;
        line-height: 40px;
        text-align: center;
        color: #858585;
        padding-bottom: 150px;
    }

    .desc {
        height: 28px;
        font-size: 14px;
        line-height: 28px;
        padding-left: 15px;
        color: #777e8c;
        // background: #f2f2f4;
    }
}
</style>
