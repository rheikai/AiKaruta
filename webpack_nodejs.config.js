module.exports = {
    mode: 'development',
    target: "node",
    entry: './src/main_nodejs.ts',
    module: {
        rules: [
            {
                test: /\.ts$/,
                use: 'ts-loader',
            },
        ]
    },
    resolve: {
        extensions: [
            '.ts', '.js',
        ]
    }
};