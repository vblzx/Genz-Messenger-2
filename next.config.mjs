/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        remotePatterns: [
            {
            protocol: 'https',
            hostname: "utfs.io",
        }
        ]
    }
};

// using remotePatterns here cause the previous "domains" is depecreated in this version.

export default nextConfig;
