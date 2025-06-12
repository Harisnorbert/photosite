const fetch = require('node-fetch');

exports.handler = async () => {
  const PUBLIC = process.env.UPLOADCARE_PUBLIC_KEY;
  const SECRET = process.env.UPLOADCARE_SECRET_KEY;

  const response = await fetch(
    'https://api.uploadcare.com/files/?limit=100&ordering=-datetime_uploaded',
    {
      headers: {
        'Authorization': `Uploadcare.Simple ${PUBLIC}:${SECRET}`
      }
    }
  );

  if (!response.ok) {
    return {
      statusCode: response.status,
      body: JSON.stringify({ error: 'Failed to fetch files' }),
    };
  }

  const payload = await response.json();
  const files = payload.results.map(f => ({
    uuid: f.uuid,
    originalUrl: f.original_file_url,
    thumbnailUrl: `${f.cdn_url}/-/resize/200x200/`,
  }));

  return {
    statusCode: 200,
    body: JSON.stringify({ files }),
  };
};