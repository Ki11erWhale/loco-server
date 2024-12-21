import express from 'express';
import { authRouter } from './routes';

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/', (req, res) => {
  res.json('loco-server');
});

app.use('/auth', authRouter);

export default app;
