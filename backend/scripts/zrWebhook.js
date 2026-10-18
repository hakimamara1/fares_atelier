// Registers this server's webhook address at ZR Express and prints the signing secret.
// Usage: npm run zr:webhook            (uses PUBLIC_API_URL)
//        npm run zr:webhook -- https://your-api.example/api/webhooks/zr
process.env.LOG_LEVEL ||= 'warn';
const zr = require('../services/zrExpress');

const EVENTS = ['parcel.state.updated', 'parcel.state.situation.created', 'parcel.isReturn.updated'];
const base = (process.env.PUBLIC_API_URL || '').replace(/\/+$/, '');
const url = process.argv[2] || (base && `${base}/api/webhooks/zr`);

if (!url) {
    console.error('✗ Set PUBLIC_API_URL, or pass the webhook address: npm run zr:webhook -- https://your-api.example/api/webhooks/zr');
    process.exit(1);
}

const asList = (data) => (Array.isArray(data) ? data : data?.items || data?.endpoints || []);

const main = async () => {
    const existing = asList(await zr.listWebhookEndpoints().catch(() => [])).find((endpoint) => endpoint.url === url);
    const endpoint = existing || await zr.createWebhookEndpoint({
        url,
        description: 'Fares Atelier site: parcel status updates',
        eventTypes: EVENTS,
    });
    console.log(`✓ ${existing ? 'Already registered' : 'Registered'}: ${url}`);

    const { secret } = await zr.getWebhookSecret(endpoint.id);
    console.log('\nAdd this on Render → Environment, then redeploy:\n');
    console.log(`  ZR_WEBHOOK_SECRET=${secret}\n`);
};

main().catch((err) => {
    console.error(`✗ ${err.message}`);
    process.exitCode = 1;
});
