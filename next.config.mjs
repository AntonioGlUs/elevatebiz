/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  trailingSlash: true, // pages are exported as folder/index.html, so /privacy/ and /demos/dental/ work on any host
  output: "export", // static export — produces plain HTML/CSS/JS in /out, works on any cPanel shared hosting
  images: {
    unoptimized: true, // required for static export (no server to optimize images on the fly)
  },
};

export default nextConfig;
