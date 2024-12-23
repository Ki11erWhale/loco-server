import express from 'express';
import { clientManager } from './auth';

const adminRouter = express.Router();

adminRouter.post('/check-key', (req, res) => {
  const { email, token } = req.body;

  if (!email || !token) {
    res.status(200).json({ success: false, message: '잘못된 요청입니다.' });
    return;
  }

  const client = clientManager.getClient(email, token);

  if (!client) {
    res
      .status(200)
      .json({ success: false, message: '클라이언트가 실행 중이 아닙니다.' });
    return;
  }

  const key = client.commandClient.getAdminKey();

  if (!key) {
    res.status(200).json({
      success: false,
      message: `발급된 키가 없습니다. 채팅방에서 '관리자등록' 명령어로 키를 발급하세요.`,
    });

    return;
  }

  res.status(200).json({ success: true, key });
});

adminRouter.post('/get-admin-list', (req, res) => {
  const { email, token } = req.body;

  if (!email || !token) {
    res.status(200).json({ success: false, message: '잘못된 요청입니다.' });
    return;
  }

  const client = clientManager.getClient(email, token);

  if (!client) {
    res
      .status(200)
      .json({ success: false, message: '클라이언트가 실행 중이 아닙니다.' });
    return;
  }

  if (!client.commandClient.commandConf.isAdminBot) {
    res.status(200).json({
      success: false,
      message:
        '관리자 권한이 필요한 봇이 아닙니다. 관리자 권한이 필요한 봇을 사용하려면, .env 파일의 IS_ADMIN_BOT 값을 "true"로 바꾸고 다시 로그인하세요.',
    });
    return;
  }

  res.status(200).json({
    success: true,
    adminList: client.commandClient.commandConf.adminList,
  });
});

export { adminRouter };
