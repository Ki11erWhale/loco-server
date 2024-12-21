// import express from 'express';

// const app = express();
// const PORT = 3000;

// let onRequest: (ip: string, userAgent: string) => void;

// app.get('/ip-logger', (req, res) => {
//   const ip =
//     req.ip || req.headers['x-forwarded-for'] || req.connection.remoteAddress;

//   console.log(
//     req.ip,
//     req.headers['x-forwarded-for'],
//     req.connection.remoteAddress
//   );
//   const userAgent = req.headers['user-agent'] || 'Unknown';

//   console.log(`IP: ${ip}, User-Agent: ${userAgent}`);

//   if (onRequest) {
//     onRequest(ip as string, userAgent);
//   }

//   res.redirect(
//     'https://github.com/user-attachments/assets/2d54d27d-dc4b-49c3-807a-7c6bce3023a6'
//   );
// });

// export const setOnRequestCallback = (
//   callback: (ip: string, userAgent: string) => void
// ) => {
//   onRequest = callback;
// };

// export const startServer = () => {
//   app.listen(PORT, () => {
//     console.log(`Server is running at http://localhost:${PORT}`);
//   });
// };
