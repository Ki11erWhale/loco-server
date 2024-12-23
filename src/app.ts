import express from 'express';
import { adminRouter, authRouter, featuresRouter } from './routes';

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/', (req, res) => {
  res.json('loco-server');
});

app
  .use('/auth', authRouter)
  .use('/features', featuresRouter)
  .use('/admin', adminRouter);

export default app;
