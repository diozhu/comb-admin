import Vue from 'vue';
class Modal {
    static getModal({ clickFunc } = {}) {
        if (Vue.prototype.$isServer) return;
        let modalDom = document.getElementsByClassName('v-modal')[0];
        if (!modalDom) {
            modalDom = document.createElement('div');
            modalDom.setAttribute('class', 'v-modal');
            modalDom.addEventListener('touchmove', function(e) {
                e.preventDefault();
                e.stopPropagation();
            });
            modalDom.addEventListener('click', function() {
                if (typeof clickFunc === 'function') clickFunc();
            });
            document.body.appendChild(modalDom);
        }
        return modalDom;
    }

    static removeModal() {
        if (Vue.prototype.$isServer) return;
        let modalDom = document.getElementsByClassName('v-modal')[0];
        if (modalDom) document.body.removeChild(modalDom);
    }
}

export default Modal;
