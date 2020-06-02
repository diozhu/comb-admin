<template>
    <div class="page-t-table">
        <v-table
            ref="vTable"
            render-type="VIRTUAL"
            record-key="_id"
            header-class="header-title__virtual"
            v-model="list"
            :columns="columns"
            :func="getList"
            @selectionChange="handleSelectionChange"
            show-checkbox
        ></v-table>
        <input type="text" v-model="tCurrentId" />
        <el-button size="mini" @click="handleScroll">scroll to</el-button>
    </div>
</template>

<script type="text/ecmascript-6">
// import * as api from '../../js/api.js';
// import _ from 'lodash';
import vTable from '../../vendors/v-table/index.js';
export default {
    name: "t-table",
    components: { vTable },
    data () {
        return {
            columns: [
                { label: 'icon icon-lock', prop: 'lockExt', width: 30, isIcon: true },
                { label: 'name', prop: 'id', width: 60, align: 'right' },
                { label: 'label', prop: 'labelExt', width: 60, isBranchground: true },
                { label: 'parts', prop: 'partsExt', width: 60, align: 'right' },
                { label: 'length', prop: 'lengthExt', width: 70, align: 'right' },
                { label: 'absoluteSpeed', prop: 'absoluteSpeedExt', width: 90, align: 'right' },
                { label: 'relativeSpeed', prop: 'relativeSpeedExt', width: 90, align: 'right', isBranchground: true },
                { label: 'condition', prop: 'conditionExt', width: 90, align: 'right', isBranchground: true },
                { label: 'icon icon-turn', prop: 'spotTurnExt', width: 30, isIcon: true },
                { label: 'icon icon-closure', prop: 'closureExt', width: 30, isIcon: true },
                { label: 'icon icon-stop', prop: 'stopSignExt', width: 30, isIcon: true },
                { label: 'initTime', prop: 'initTimeExt', width: 130 },
                { label: 'modified', prop: 'modificationTimeExt', width: 130 },
                { label: 'responsibility', prop: 'responsibility', width: 110 },
                {
                    label: 'operate',
                    fixed: 'right',
                    width: 120,
                    align: 'center',
                    opts: [
                        {
                            label: 'detail',
                            type: 'primary',
                            callback: this.handleDetail
                        },
                        {
                            label: 'edit',
                            type: 'primary',
                            callback: this.handleModify
                        }
                    ]
                }
            ],
            list: [],
            tCurrentId: 1
        };
    },
    computed: {
    },
    watch: {
        // '$root.ws.serverTime'() { this.initAsync(); }
        '$root.ws.serverTime'() { this.initAsync.call(this); }
    },
    created () {
    },
    beforeDestroy: function () { // clear the listener
    },
    mounted() {
        this.init();
    },
    methods: {
        init() {
            // this.getList().then(res => {
            //     this.list = res.list;
            // });
        },
        getList() {
            // return API.getLocalResources('paths').then(res => {
            //     let rtn = {...res};
            //     if (res && res.list && res.list.length) rtn.list = Chef.extendPaths(res.list);
            //     return rtn;
            // });
        },
        handleSelectionChange() {
            console.log('t-table.handleSelectionChange: ', ...arguments);
        },
        handleScroll() {
            console.log('t-table.handleScroll: ', this.tCurrentId);
            this.$refs.vTable.toggleRowSelection([String(this.tCurrentId)], true);
        }
    }
};
</script>

<style lang="scss">
.page-t-table {
}
</style>
