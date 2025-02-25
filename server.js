import express from 'express';
import { createProxyMiddleware } from 'http-proxy-middleware';
import cors from 'cors';

const app = express();

// CORS 설정
app.use(cors());

// 프록시 설정
app.use(
  '/proxy',
  createProxyMiddleware({
    target: 'https://firestore.googleapis.com', // Firebase Firestore의 API URL
    changeOrigin: true,
    pathRewrite: {
      '^/proxy': '',
    },
  })
);

const port = 3000;
app.listen(port, () => {
  console.log(`Proxy server running on http://localhost:${port}`);
});
