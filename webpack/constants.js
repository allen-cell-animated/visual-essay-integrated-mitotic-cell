const devServer = {
    host: "0.0.0.0",
    port: 9001,
    path: "imsc-visual-essay",
};

const Env = {
    DEVELOPMENT: "dev",
    PRODUCTION: "production",
    STAGE: "staging"
};

const stats = {
    children: false,
    env: true,
    errors: true,
    errorDetails: true,
    version: true,
};

module.exports = {
    devServer,
    Env,
    stats
};
