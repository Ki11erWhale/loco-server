import app from './app';

const port = process.env.PORT || 80;

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
