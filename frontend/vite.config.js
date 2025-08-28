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
            port: env.VITE__RUN__CLIENT_PORT_DEV,
            host: '127.0.0.1',
            hmr: {
                clientPort: env.VITE__RUN__CLIENT_PORT_DEV,
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
            VITE__RUN__SERVER_PORT: env.VITE__RUN__SERVER_PORT ?? 8000,
            VITE__MAIN_API_PREFIX: JSON.stringify(env.VITE__MAIN_API_PREFIX) ?? JSON.stringify("/api"),
            VITE__SECONDARY_API_PREFIX: JSON.stringify(env.VITE__SECONDARY_API_PREFIX) ?? JSON.stringify("/v1"),
            VITE__GAME_THRESHOLD_HOURS: env.VITE__GAME_THRESHOLD_HOURS ?? 24,
            VITE__DAILY_UPDATE_TIME_UTC: JSON.stringify(env.VITE__DAILY_UPDATE_TIME_UTC) ?? JSON.stringify("00:00:05"),
            VITE__CLEANUP_INTERVAL_DAYS: env.VITE__CLEANUP_INTERVAL_DAYS ?? 7,
            VITE__DEBUG: env.VITE__DEBUG ?? 1
        }
    }
})