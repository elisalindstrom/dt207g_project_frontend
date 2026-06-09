import { defineConfig } from "vite";
import { resolve } from "path";
import { ViteImageOptimizer } from "vite-plugin-image-optimizer";

export default defineConfig({
    build: {
        rollupOptions: {
            input: {
                main: resolve(__dirname, "index.html"),
                login: resolve(__dirname, "login.html"),
                admin: resolve(__dirname, "admin.html")
            }
        }
    },
    plugins: [
        ViteImageOptimizer({
            png: {
                quality: 75
            },
            jpg: {
                quality: 75
            },
            jpeg: {
                quality: 75
            },
            webp: {
                quality: 80
            },
            avif: {
                quality: 70
            }
        })
    ]
});