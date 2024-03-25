import { terser } from 'rollup-plugin-terser';

export default {
  input: 'main.js', // Your entry point
  output: {
    file: 'dist/bundle.js', // Where to output the bundle
    format: 'iife' // Format: Immediately-Invoked Function Expression (good for web)
  },
  plugins: [terser()] // Minify the output (optional)
};
