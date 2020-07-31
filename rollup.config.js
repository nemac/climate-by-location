// rollup.config.js
import babel from '@rollup/plugin-babel';
import { nodeResolve } from '@rollup/plugin-node-resolve';
export default {
  input: 'src/main.js',
  output: {
    file: 'build/climate-by-location.js',
    format: 'umd',
    name: 'ClimateByLocationWidget'
  },
  plugins: [
    nodeResolve(),
    babel({
      exclude: 'node_modules/**' // only transpile our source code
    })
  ]
};
