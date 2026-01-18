/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    // Explicitly tell Turbopack to leave these out of the bundle
    serverComponentsExternalPackages: [
      '@huggingface/transformers',
      'onnxruntime-node'
    ],
  },
};

export default nextConfig;