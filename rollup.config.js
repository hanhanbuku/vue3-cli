import terser from '@rollup/plugin-terser'
// import { nodeResolve } from '@rollup/plugin-node-resolve';
// import commonjs from '@rollup/plugin-commonjs';
import babel from '@rollup/plugin-babel'
// import json from '@rollup/plugin-json';

export default {
    input: 'bin/index.js', // 你的入口文件
    output: {
        file: 'dist/cli.cjs', // 输出的打包文件
        format: 'cjs', // CommonJS 模块格式，适用于 Node.js
        banner: '#!/usr/bin/env node\n', // 向打包后的输出文件添加一个前缀
    },
    plugins:[
        // json(),
        // commonjs(),
        // nodeResolve(),
        // babel({
        //     babelHelpers: 'bundled',
        // }),
        terser({
            module: true
        }),
    ]
}

