// rollup.config.js
import babel from '@rollup/plugin-babel';
import nodeResolve from '@rollup/plugin-node-resolve';
let production = process.env.build_env === 'prod' || process.env.build_env === 'production'
const plugins = [
  nodeResolve(),
];
if (production){
  plugins.push(
      babel({
        exclude: 'node_modules/**', // only transpile our source code
        babelHelpers: 'bundled',
      })
  )
}
export default [{
  input: 'src/bundles/climate_by_location.climate_explorer.bundle.js',
  output: {
    file: 'dist/climate_by_location.climate_explorer.bundle.js',
    format: 'umd',
    name: 'ClimateByLocationWidget',
    sourcemap: !production ? 'inline' : false,
  },
  plugins: plugins
},{
  input: 'src/bundles/climate_by_location.climate_by_forest.bundle.js',
  output: {
    file: 'dist/climate_by_location.climate_by_forest.bundle.js',
    format: 'umd',
    name: 'ClimateByLocationWidget',
    sourcemap: !production ? 'inline' : false,
  },
  plugins: plugins
},{
  input: 'src/bundles/climate_by_location.complete.bundle.js',
  output: {
    file: 'dist/climate_by_location.complete.bundle.js',
    format: 'umd',
    name: 'ClimateByLocationWidget',
    sourcemap: !production ? 'inline' : false,
  },
  plugins: plugins
}];
