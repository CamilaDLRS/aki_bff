import axios from 'axios';

interface SendMessageParams {
  teacher_id: number;
  class_id: number;
  message: string;
}

export const sendMessageUseCase = async ({ teacher_id, class_id, message }: SendMessageParams) => {
  try {
    const response = await axios.post(
      'https://aki-notify-institution-a8gpgzf0b7bjhph4.eastus2-01.azurewebsites.net/api/notification',
      {
        teacher_id,
        class_id,
        message,
      },
      {
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );

    return response.data;
  } catch (error: any) {
    console.error('Error in sendMessageUseCase:', error);
    throw new Error('Failed to send message to institution');
  }
};