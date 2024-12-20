import path from 'path';
import * as dotenv from 'dotenv';
import { compileCSS, compileJavascript, convertJsonToESM, loadCommonjsPackage, replaceValues, resolveExtensions } from './rollup.plugins.js';
import { BUNDLE_TYPES } from './utils/bundle-types.js';

dotenv.config({ path: path.resolve('../../', '.env') });

export default () => {
    return [
        //ESM build
        {
            input: 'src/index.ts',
            plugins: [
                resolveExtensions(),
                loadCommonjsPackage(),
                // TODO: Enable this once @rollup/plugin-eslint supports ESLINT 9
                // lint(),
                replaceValues({ bundleType: BUNDLE_TYPES.esm, buildType: 'development' }),
                convertJsonToESM(),
                compileCSS({}),
                compileJavascript({ target: 'es2020' })
            ],
            output: [
                {
                    dir: './dist/es',
                    format: 'esm',
                    indent: false,
                    sourcemap: false,
                    preserveModules: true,
                    preserveModulesRoot: 'src',
                    chunkFileNames: 'chunks/[name].js',
                    entryFileNames: chunkInfo => {
                        if (chunkInfo.name.includes('node_modules')) {
                            return chunkInfo.name.replace('node_modules', 'external') + '.js';
                        }

                        return '[name].js';
                    }
                },
                {
                    dir: './dist/es-legacy',
                    format: 'esm',
                    indent: false,
                    sourcemap: true,
                    preserveModules: true,
                    preserveModulesRoot: 'src',
                    chunkFileNames: 'chunks/[name].js',
                    entryFileNames: chunkInfo => {
                        if (chunkInfo.name.includes('node_modules')) {
                            return chunkInfo.name.replace('node_modules', 'external') + '.js';
                        }

                        return '[name].js';
                    }
                }
            ],
            watch: {
                chokidar: {
                    usePolling: true,
                    useFsEvents: false,
                    interval: 500
                },
                exclude: 'node_modules/**'
            }
        }
    ];
};
