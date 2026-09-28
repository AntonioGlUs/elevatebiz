/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  output: "export", // static export — produces plain HTML/CSS/JS in /out, works on any cPanel shared hosting
  images: {
    unoptimized: true, // required for static export (no server to optimize images on the fly)
  },
};

export default nextConfig;
