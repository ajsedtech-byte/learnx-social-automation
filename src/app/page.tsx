export default function Home() {
  return (
    <main style={{ fontFamily: 'system-ui, sans-serif', padding: '2rem', maxWidth: '600px', margin: '0 auto' }}>
      <h1>LearnX Social Media Automation</h1>
      <p>365-day content calendar with daily auto-publishing.</p>
      <ul>
        <li>Cron: daily at 9:30 AM IST</li>
        <li>Endpoint: <code>/api/cron/publish</code></li>
        <li>Posts: 377 across 11 series</li>
      </ul>
      <p style={{ color: '#888', fontSize: '0.85rem', marginTop: '2rem' }}>
        #HarBacchaStar
      </p>
    </main>
  );
}
