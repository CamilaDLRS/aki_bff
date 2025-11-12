import { Request, Response } from 'express';
import { sendMessageUseCase } from './useCase';

export const sendMessageController = async (req: Request, res: Response) => {
  try {
    const { teacher_id, class_id, message } = req.body;

    if (!teacher_id || !class_id || !message) {
      return res.status(400).json({ error: 'Missing required fields: teacher_id, class_id, message' });
    }

    const result = await sendMessageUseCase({ teacher_id, class_id, message });
    res.status(200).json(result);
  } catch (error: any) {
    console.error('Error in sendMessageController:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};