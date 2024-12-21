import express from 'express';
import { ClientManager } from '../client/manager';

const clientManager = new ClientManager();

const authRouter = express.Router();

authRouter.post('/login', async (req, res) => {
  const {
    email,
    password,
    device_uuid: deviceUuid,
    device_name: deviceName,
    prefix,
  } = req.body;

  if (!email || !password || !deviceUuid || !deviceName || !prefix) {
    res.status(400).json({
      success: false,
      message:
        'Please provide email, password, device_uuid, device_name, and prefix.',
    });

    return;
  }

  const userInfo = { email, password, deviceUuid, deviceName };
  const commandConf = { prefix };
  const { token, commandClient } = clientManager.registerClient(
    userInfo,
    commandConf
  );

  const result = await commandClient.login();

  if (!result.success) {
    clientManager.removeClient(email, token);

    res.status(400).json({
      success: false,
      message: `Login failed. Reason: ${result.reason}`,
    });

    return;
  }

  res.status(200).json({
    success: true,
    token: token,
  });
});

authRouter.post('/logout', (req, res) => {
  const { email, token } = req.body;

  if (!email || !token) {
    res.status(400).json({ success: false, message: 'Invalid request.' });
    return;
  }

  const success = clientManager.removeClient(email, token);

  if (!success) {
    res
      .status(403)
      .json({ success: false, message: 'Invalid token or email.' });
    return;
  }

  res.status(200).json({ success: true, message: 'Logout succeed.' });
});

export { authRouter };
