<template>
    <div v-if="!item.hidden" class="p-sidebar-item">
        <template
            v-if="
                hasOneShowingChild(item.subMenuList, item) &&
                    (!onlyOneChild.subMenuList || onlyOneChild.noShowingChildren) &&
                    !item.alwaysShow
            "
        >
            <router-link :to="resolvePath(onlyOneChild.action)">
                <el-menu-item
                    :index="resolvePath(onlyOneChild.action)"
                    :class="{ 'submenu-title-noDropdown': !isNest }"
                >
                    <!--<item
                        :icon="onlyOneChild.meta.icon || (item.meta && item.meta.icon)"
                        :title="generateTitle(onlyOneChild.meta.title)"
                    />-->
                    <i v-if="onlyOneChild.top_icon" :class="['icon', 'icon-' + onlyOneChild.top_icon]"></i>
                    <i v-else class="icon icon-more"></i>
                    <span>{{ onlyOneChild.name }}</span>
                </el-menu-item>
            </router-link>
        </template>

        <el-submenu v-else ref="subMenu" :index="resolvePath(item.action)" popper-append-to-body>
            <template slot="title">
                <!--<item v-if="item.meta" :icon="item.meta && item.meta.icon" :title="generateTitle(item.meta.title)" />-->
                <i v-if="item.top_icon" :class="['icon', 'icon-' + item.top_icon]"></i>
                <i v-else class="icon icon-more"></i>
                <span>{{ item.name }}</span>
            </template>
            <p-sidebar-item
                v-for="child in item.subMenuList"
                :key="child.action"
                :is-nest="true"
                :item="child"
                :base-path="resolvePath(child.action)"
                class="nest-menu"
            />
        </el-submenu>
    </div>
</template>

<script>
import path from 'path';
import * as validate from '../vendors/validate.js';

/**
 * p-sidebar-item
 * @author Dio Zhu
 * @date 2019.7.30
 */
export default {
    name: 'p-sidebar-item',
    props: {
        // route object
        item: {
            type: Object,
            required: true
        },
        isNest: {
            type: Boolean,
            default: false
        },
        basePath: {
            type: String,
            default: ''
        }
    },
    data() {
        this.onlyOneChild = null;
        return {
            // onlyOneChild: null
        };
    },
    computed: {},
    mounted() {
        this.init();
    },
    methods: {
        init() {},
        hasOneShowingChild(children = [], parent) {
            const showingChildren = children.filter(item => {
                if (item.hidden) {
                    return false;
                } else {
                    // Temp set(will be used if only has one showing child)
                    this.onlyOneChild = item;
                    return true;
                }
            });

            // When there is only one child router, the child router is displayed by default
            if (showingChildren.length === 1) {
                return true;
            }

            // Show parent if there are no child router to display
            if (showingChildren.length === 0) {
                this.onlyOneChild = { ...parent, action: parent.action, noShowingChildren: true };
                return true;
            }

            return false;
        },
        resolvePath(routePath) {
            if (validate.isExternal(routePath)) {
                return routePath;
            }
            if (validate.isExternal(this.basePath)) {
                return this.basePath;
            }
            return path.resolve(this.basePath, routePath);
        }
    }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<!-- <style scoped lang="scss"> -->
<style lang="scss">
.p-sidebar-item {
}
</style>
