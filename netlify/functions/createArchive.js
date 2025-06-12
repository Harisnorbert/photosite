const fetch = require('node-fetch'); // or use global fetch on Node18+

exports.handler = async () => {
  const PUBLIC = process.env.UPLOADCARE_PUBLIC_KEY;
  const SECRET = process.env.UPLOADCARE_SECRET_KEY;

  // 1. Fetch your file list (same as listFiles)
  const listRes = await fetch(
    'https://api.uploadcare.com/files/?limit=100&ordering=-datetime_uploaded',
    { headers: { Authorization: `Uploadcare.Simple ${PUBLIC}:${SECRET}` } }
  );
  const { results } = await listRes.json();
  const uuids = results.map(f => f.uuid);

  if (!uuids.length) {
    return { statusCode: 400, body: 'No files to archive' };
  }

  // 2. Request an archive
  const params = new URLSearchParams();
  uuids.forEach(id => params.append('files[]', id));
  // auto-store the archive so Uploadcare holds it for you
  params.append('store', 'auto');

  const archRes = await fetch(
    `https://api.uploadcare.com/files/archive/`,
    {
      method: 'POST',
      headers: {
        Authorization: `Uploadcare.Simple ${PUBLIC}:${SECRET}`,
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: params.toString()
    }
  );
  const { archive_url } = await archRes.json();

  // 3. Return it so the front end can redirect
  return {
    statusCode: 200,
    body: JSON.stringify({ archiveUrl: archive_url })
  };
};
