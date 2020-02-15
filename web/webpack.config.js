const Path = require('path')
//const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin

module.exports = (env, argv) => {
    const isProduction = argv.mode === 'production'

    return {
        entry: Path.join(__dirname, 'src/index.tsx'),
        mode: isProduction ? 'production' : 'development',
        module: {
            rules: [
                {
                    test: /\.(ts|tsx)$/,
                    exclude: /(node_modules)/,
                    use: {
                        loader: 'ts-loader'
                    }
                }
            ]
        },
        resolve: {
            extensions: ['.ts', '.tsx', '.js', '.json']
        },
        output: {
            filename: 'index.min.js',
            path: Path.join(__dirname, './public/js'),
            publicPath: '/js/'
        },
        devServer: {
            contentBase: Path.join(__dirname, './public'),
            historyApiFallback: true,
            hot: true,
            inline: true,
            host: 'localhost',
            port: 8080,
            publicPath: 'http://localhost:8080/js'
        },
        plugins: [
            //new BundleAnalyzerPlugin()
        ],
        performance: {
            hints: false
        }
    }
}