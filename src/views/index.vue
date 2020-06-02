<template>
    <div class="page page-index">
        <div class="dashboard">aaa</div>
    </div>
</template>

<script type="text/ecmascript-6">
export default {
    name: "index",
    components: {},
    data () {
        return {
            map: {},
            rulerMode: 1,
            dragMode: false,
            displayVehicleLabels: false
        };
    },
    computed: {
    },
    watch: {
    },
    created() {
    },
    mounted() {
        this.init();
    },
    beforeDestroy() {
    },
    methods: {
        init() {
            // console.warn('index.init: ');
        }
    }
};
</script>

<style lang="scss">
.page-index {
    .dashboard {
        width: 100%;
        display: flex;
        .left {
            width: 38.2%;
            height: calc(100vh - 60px);
            padding: 10px 0 0 10px;
            overflow-x: hidden;
            overflow-y: auto;
            scrollbar-color: transparent transparent;
            scrollbar-track-color: transparent;
            -ms-scrollbar-track-color: transparent;
            &::-webkit-scrollbar {
                /*滚动条整体样式*/
                width: 6px;
                height: 6px;
            }
            &::-webkit-scrollbar-thumb {
                /*滚动条里面小方块*/
                border-radius: 3px;
                box-shadow: inset 0 0 3px rgba(0, 0, 0, 0.2);
                background: #535353;
            }
            &::-webkit-scrollbar-track {
                /*滚动条里面轨道*/
                box-shadow: inset 0 0 3px rgba(0, 0, 0, 0.2);
                border-radius: 3px;
                background: #ededed;
            }
        }
        @media screen and (min--moz-device-pixel-ratio: 0) {
            .left {
                scrollbar-color: #dedede #fff !important;
            }
        }
        .p-charts-vehicles-status {
            height: calc(50vh - 60px);
        }
        .p-charts-network {
            height: 280px;
        }
        .p-charts-task {
            height: 180px;
        }
        .map {
            width: 100%;
            box-shadow: 0px 0px 6px #ccc;
        }
    }
}
</style>
