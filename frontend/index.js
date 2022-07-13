const fs = require('fs');

exports.handler = async (event, context) => {
  const { handler } = await import('./.output/server/index.mjs');
  console.log(`path${event.path}`);
  console.log(`result${JSON.stringify(context)}`);

  if (event.path.startsWith('/_nuxt')) {
    const dataPath = `${__dirname}/.output/public${event.path}`;
    console.log(`data path:${dataPath}`);
    const data = fs.readFileSync(dataPath, 'utf8');
    const headers = {};
    if (event.path.indexOf('.mjs') !== -1 || event.path.indexOf('.js') !== -1) {
      headers['content-type'] = 'text/javascript';
    }
    else if (event.path.indexOf('css') !== -1) {
      headers['content-type'] = 'text/css';
    }

    return {
      statusCode: 200,
      headers,
      body: data.toString(),
    };
  }
  return await handler(event);
};
