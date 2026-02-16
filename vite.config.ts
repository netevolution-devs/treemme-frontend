import {defineConfig} from 'vite'
import react from '@vitejs/plugin-react'
import {resolve} from 'path'
import {fileURLToPath} from 'url'
import {renameSync, existsSync} from 'fs'

const root = fileURLToPath(new URL('.', import.meta.url))

// Get build target from command line args
const buildTarget = process.env.BUILD_TARGET

// Plugin to rename HTML file after build
function renameHtmlPlugin() {
    return {
        name: 'rename-html',
        closeBundle() {
            if (buildTarget === 'default') {
                const distPath = resolve(root, 'dist')
                const originalFile = resolve(distPath, `app-${buildTarget}.html`)
                const targetFile = resolve(distPath, 'index.html')

                if (existsSync(originalFile)) {
                    renameSync(originalFile, targetFile)
                    console.log(`\nRenamed app-${buildTarget}.html to index.html`)
                }
            }
        }
    }
}

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [react(), renameHtmlPlugin()],
    resolve: {
        alias: [
            {find: '@apps', replacement: resolve(root, 'src/apps')},
            {find: '@features', replacement: resolve(root, 'src/features')},
            {find: '@pages', replacement: resolve(root, 'src/pages')},
            {find: '@shared', replacement: resolve(root, 'src/shared')},
            // convenience sub-aliases under shared
            {find: '@ui', replacement: resolve(root, 'src/shared/ui')},
            {find: '@api', replacement: resolve(root, 'src/shared/api')},
            {find: '@helpers', replacement: resolve(root, 'src/shared/helpers')},
            {find: '@model', replacement: resolve(root, 'src/shared/model')},
            {find: "@interfaces", replacement: resolve(root, 'src/shared/interfaces')},
            {find: '@themes', replacement: resolve(root, 'src/shared/themes')},
        ],
    },
    build: {
        rollupOptions: {
            input: buildTarget === 'default'
                ? {default: resolve(root, 'app-default.html')}
                : {
                    default: resolve(root, 'app-default.html'),
                    index: resolve(root, 'index.html'),
                },
        },
    },
})
