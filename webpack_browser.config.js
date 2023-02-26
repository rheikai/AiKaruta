module.exports = {
    mode: 'development',
    entry: './src/main_browser.ts',
    module: {
        rules: [
            {
                test: /\.ts$/,
                use: 'ts-loader',
            },
        ],
    },
    resolve: {
        extensions: [
            '.ts', '.js',
        ],
    },
    devServer: {
        static: {
            directory: "dist"
        }
    }
};