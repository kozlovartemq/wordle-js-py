import { defineConfig, loadEnv } from "vite";
import { ViteAliases } from "vite-aliases";
import legacy from "@vitejs/plugin-legacy"
import TemplateLoader from './plugins/vite-template-plugin'
import path from "path"

export default defineConfig(({ mode }) => {
    const env = loadEnv(mode, path.resolve(__dirname, "../"), "")

    return {
        build: {
            target: 'es2020',
            outDir: 'build',
        },
        server: {
            port: 3000,
            host: '0.0.0.0',
            hmr: {
                // protocol: 'wss',
                clientPort: 3000,
            },
        },
        plugins: [
            ViteAliases(),
            TemplateLoader(),
            legacy({
                targets: ['defaults', 'not IE 11'],
            })
        ],
        define: {
            VITE__RUN__SERVER_PORT: env.VITE__RUN__SERVER_PORT,
            VITE__MAIN_API_PREFIX: JSON.stringify(env.VITE__MAIN_API_PREFIX),
            VITE__SECONDARY_API_PREFIX: JSON.stringify(env.VITE__SECONDARY_API_PREFIX),
            VITE__GAME_THRESHOLD_HOURS: env.VITE__GAME_THRESHOLD_HOURS,
        }
    }
})