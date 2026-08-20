/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    unoptimized: true,
  },
  // The app moved to values.purposefp.com on the cutover. The Vercel-assigned
  // address stays alive and forwards, because it is printed in Gain Clarity
  // Part 1 PDFs and the Pre-Work Client Workbook that clients already hold.
  // 308 so it is cached as the permanent answer. Preview deployments get their
  // own hostnames and are not matched.
  async redirects() {
    return [
      {
        source: "/:path*",
        has: [{ type: "host", value: "v0-values-card-app.vercel.app" }],
        destination: "https://values.purposefp.com/:path*",
        permanent: true,
      },
    ]
  },
}

export default nextConfig
