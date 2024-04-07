import { terser } from 'rollup-plugin-terser';
import resolve from '@rollup/plugin-node-resolve'; // Helps Rollup find external modules
import commonjs from '@rollup/plugin-commonjs'; // Convert CommonJS modules to ES6

export default {
  input: 'main.js', // Your entry point
  output: {
    file: 'dist/bundle.js', // Where to output the bundle
    format: 'iife', // Format: Immediately-Invoked Function Expression (good for web)
    globals: {
      'mapbox-gl': 'mapboxgl', // Correct placement of globals
      'gsap': 'GSAP', // Define GSAP as a global (if you're using it from a CDN)
    },
  },
  plugins: [
    resolve(), // Add this before other plugins that transform your modules
    commonjs(), // Convert CommonJS modules to ES6, so they can be included in the Rollup bundle
    terser() // Minify the output (optional)
  ],
  external: ['mapbox-gl'], // Tells Rollup that mapbox-gl is an external dependency
};
