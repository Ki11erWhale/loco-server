import express from 'express';
import { ClientManager } from '../client/manager';
import { CommandConf } from '../types/command';
import { Long, util } from 'loco-client';

const clientManager = new ClientManager();

const authRouter = express.Router();

authRouter.post('/login', async (req, res) => {
  const {
    email,
    password,
    device_uuid: deviceUuid,
    device_name: deviceName,
    prefix,
    is_admin_bot: isAdminBot,
    admin_list: adminList,
  } = req.body;

  if (
    !email ||
    !password ||
    !deviceUuid ||
    !deviceName ||
    !prefix ||
    isAdminBot === undefined
  ) {
    res.status(200).json({
      success: false,
      message:
        'email, password, device_uuid, device_name, prefix, 그리고 is_admin_bot를 제공하세요.',
    });

    return;
  }

  if (isAdminBot && adminList === undefined) {
    res.status(200).json({
      success: false,
      message: 'admin_list를 제공하세요.',
    });

    return;
  }

  const userInfo = { email, password, deviceUuid, deviceName };
  const bsonAdminList = adminList.map((admin: any) => ({
    ...admin,
    userId: Long.fromBits(
      admin.userId.low,
      admin.userId.high,
      admin.userId.unsigned
    ),
  }));
  const commandConf: CommandConf = {
    prefix,
    isAdminBot,
    adminList: bsonAdminList,
  };
  const { token, commandClient } = clientManager.registerClient(
    userInfo,
    commandConf
  );

  const result = await commandClient.login();

  if (!result.success) {
    clientManager.removeClient(email, token);

    res.status(200).json({
      success: false,
      message: `로그인 실패: ${result.reason}`,
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
    res.status(200).json({ success: false, message: '잘못된 요청입니다.' });
    return;
  }

  const success = clientManager.removeClient(email, token);

  if (!success) {
    res
      .status(200)
      .json({ success: false, message: '이메일 또는 토큰이 잘못되었습니다.' });
    return;
  }

  res.status(200).json({ success: true, message: '로그아웃 성공' });
});

authRouter.post('/is-running', (req, res) => {
  const { email, token } = req.body;

  if (!email || !token) {
    res.status(200).json({ success: false, message: '잘못된 요청입니다.' });
    return;
  }

  if (!clientManager.getClient(email, token)) {
    res.status(200).json({ isRunning: false });
    return;
  }

  res.status(200).json({ isRunning: true });
  return;
});

export { authRouter, clientManager };
