const path = require('path');

module.exports = {
    // 是否在保存的时候使用 `eslint-loader` 进行检查
    lintOnSave: process.env.NODE_ENV !== 'production' && process.env.NODE_ENV !== 'publish',
    publicPath: process.env.NODE_ENV === 'production' ? '/' + process.env.VUE_APP_PROJECT_NAME : '/',
    outputDir:
        process.env.NODE_ENV === 'production'
            ? path.resolve(__dirname, './dist/' + process.env.VUE_APP_PROJECT_NAME)
            : undefined,
    assetsDir: 'static',
    runtimeCompiler: undefined,
    productionSourceMap: false,
    css: {
        // extract: true, // 将组件内的 CSS 提取到一个单独的 CSS 文件 (只用在生产环境中)
        // sourceMap: false,
        // modules: false, // 为所有的 CSS 及其预处理文件开启 CSS Modules
        loaderOptions: {
            css: {
                /** options here will be passed to css-loader */
            },
            postcss: {
                // /** options here will be passed to css-loader */
                // plugins: [
                //   require('postcss-px2rem')({ remUnit: 37.5 }) // add by Dio Zhu. on 2019.5.20
                // ]
            }
        }
    },

    // configureWebpack: webpackConfig => {
    //     // 该对象将会被 webpack-merge 合并入最终的 webpack 配置
    //     // if (process.env.NODE_ENV === 'production') {
    //     //     // 生产环境修改配置...
    //     // } else {
    //     //     // 开发环境修改配置...
    //     // }
    // },

    chainWebpack: webpackConfig => {
        // // https://github.com/mozilla-neutrino/webpack-chain
        // // add worker-loader rules, and exclude from *.js rule. https://github.com/webpack-contrib/worker-loader/issues/195#issuecomment-510616933
        // webpackConfig.module
        //     .rule('wroker')
        //     .test(/\.worker\.js$/)
        //     .use('worker-loader')
        //     .loader('worker-loader')
        //     .end();
        // webpackConfig.module.rule('js').exclude.add(/\.worker\.js$/);
        webpackConfig.module
            .rule('js')
            // .include.add('packages')
            .include.add(path.resolve(__dirname, './packages'))
            .end()
            .use('babel')
            .loader('babel-loader')
            .tap(options => {
                return options;
            });
    },

    pluginOptions: {
        developmentSwitcher: {
            // 开发环境的文件转换: xxx.js => xxx.development.js
            //   js: ['api.js']
        }
    },

    pwa: {
        name: 'nava',
        themeColor: '#FFFFFF',
        msTileColor: '#FFFFFF'
    },

    devServer: {
        port: 8181,
        disableHostCheck: true,
        open: false,
        overlay: {
            warnings: true,
            errors: true
        }
    }
};
