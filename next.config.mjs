/** @type {import('next').NextConfig} */
const nextConfig = {
    swcMinify: true,
    experimental: {
      forceSwcTransforms: true,
    },
    webpack: (config) => {
      config.devtool = 'source-map'
      return config
    },
    async headers() {
        return [
            {
                source: '/:path*',
                headers: [
                    { key: 'Access-Control-Allow-Credentials', value: 'true' },
                    { key: 'Access-Control-Allow-Origin', value: '*' },
                    { key: 'Access-Control-Allow-Methods', value: 'GET,DELETE,PATCH,POST,PUT' },
                    { key: 'Access-Control-Allow-Headers', value: 'X-Appwrite-Response-Format, X-Appwrite-Project, X-Appwrite-Key, Content-Type' },
                ]
            }
        ]
    }
};

export default nextConfig;