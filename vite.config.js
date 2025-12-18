import { defineConfig } from 'vite';
import path from 'path';

export default defineConfig({
    root: 'public', // Serve from public directory
    publicDir: 'assets', // Static assets like images
    server: {
        port: 5173, // Default Vite port
        open: true, // Open browser on start
        host: true,  // Allow network access (0.0.0.0)
        proxy: {
            '/json': {
                target: 'http://localhost:3003',
                changeOrigin: true
            }
        }
    },
    build: {
        outDir: '../dist_web', // Output build artifacts outside source
        emptyOutDir: true
    },
    resolve: {
        alias: {
            // THE MAGIC: Maps 'components/Foo.js' -> 'public/js/components/Foo.js'
            'components': path.resolve(__dirname, 'public/js/components'),
            'src': path.resolve(__dirname, 'public/js')
        }
    }
});
