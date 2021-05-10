import { babel } from '@rollup/plugin-babel'
import { nodeResolve } from '@rollup/plugin-node-resolve'
import commonJs from '@rollup/plugin-commonjs'
import filesize from 'rollup-plugin-filesize'

export default {
    input: 'src/index.js',
    output: [
        {
            name: 'Spruce',
            file: 'dist/spruce.umd.js',
            format: 'umd',
            sourcemap: true,
            strict: false,
        },
    ],
    plugins: [
        filesize(),
        nodeResolve(),
        commonJs(),
        babel({
            babelHelpers: 'bundled'
        }),
    ]
}