import { NextApiHandler } from 'next';
import httpProxyMiddleware from 'next-http-proxy-middleware';

const blockfrostProxy: NextApiHandler = async (req, res) => {
  try {
    return (await httpProxyMiddleware(req, res, {
      target: "https://cardano-preprod.blockfrost.io/api/v0",
      headers: {
        project_id: `${process.env.BLOCKFROST_PROJECT_ID_PREPROD}`,
      },
      pathRewrite: [
        {
          patternStr: "^/api/blockfrost/0",
          replaceStr: "",
        },
      ],
    }))
  } catch (e) {
    console.error("Blockfrost proxy error", e)

    // NOTE(Alan): Not sure if this is compatible with Lucid / the Blockfrost provider
    return res.status(400).end()
  }
}

export default blockfrostProxy
