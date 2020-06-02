import store from '../store';
import * as enums from '../store/modules/app.enums.js';
import bus from '../vendors/eventbus.js';

const { body } = document;
const WIDTH = 1024; // refer to Bootstrap's responsive design
const RATIO = 3;

export default {
    watch: {
        $route() {
            if (this.device === 'mobile' && this.sidebar.opened) {
                store.commit(enums.CLOSE_SIDEBAR, { withoutAnimation: false });
            }
        }
    },
    beforeMount() {
        window.addEventListener('resize', this.$_resizeHandler);
    },
    beforeDestroy() {
        window.removeEventListener('resize', this.$_resizeHandler);
    },
    mounted() {
        // console.log('resize-handler.mounted: ');
        const isMobile = this.$_isMobile();
        if (isMobile) {
            store.commit(enums.TOGGLE_DEVICE, 'mobile');
            store.commit(enums.CLOSE_SIDEBAR, { withoutAnimation: true });
        } else {
            store.commit(enums.TOGGLE_DEVICE, 'desktop');
            store.commit(enums.OPEN_SIDEBAR, { withoutAnimation: true });
        }
    },
    methods: {
        // use $_ for mixins properties
        // https://vuejs.org/v2/style-guide/index.html#Private-property-names-essential
        $_isMobile() {
            const rect = body.getBoundingClientRect();
            return rect.width - RATIO < WIDTH;
        },
        $_resizeHandler() {
            if (!document.hidden) {
                const isMobile = this.$_isMobile();
                store.commit(enums.TOGGLE_DEVICE, isMobile ? 'mobile' : 'desktop');

                if (isMobile) {
                    store.commit(enums.CLOSE_SIDEBAR, { withoutAnimation: true });
                } else {
                    store.commit(enums.OPEN_SIDEBAR, { withoutAnimation: false });
                }
                bus.$emit('p-painter.repaint');
            }
        }
    }
};
