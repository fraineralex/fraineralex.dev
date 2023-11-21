export default function RootLayout ({
  children
}: {
  children: React.ReactNode
}) {
  return (
    <html lang='en' className='scroll-smooth' data-lt-installed='true'>
      <body>{children}</body>
    </html>
  )
}
