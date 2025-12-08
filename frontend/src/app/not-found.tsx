export default function NotFound() {
  return (
    <html>
      <body>
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '100vh',
          fontFamily: 'system-ui, sans-serif'
        }}>
          <h1 style={{ fontSize: '4rem', marginBottom: '1rem' }}>404</h1>
          <h2 style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>Page Not Found</h2>
          <p>The page you are looking for does not exist.</p>
          <a href="/" style={{ marginTop: '2rem', color: '#4A9C82', textDecoration: 'underline' }}>
            Go back to home
          </a>
        </div>
      </body>
    </html>
  );
}
