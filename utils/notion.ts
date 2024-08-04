// utils/notion.ts
import axios, { AxiosResponse } from 'axios';

const NOTION_API_URL = 'https://api.notion.com/v1';

export interface NotionData {
  id: string;
  title: string;
  description: string;
  // Add more fields as needed
}

export const getNotionData = async (databaseId: string): Promise<NotionData[]> => {
  const NOTION_SECRET = 'secret_QFnPMWv5rTsYVZZKe5aQyO8vfj41hj8QdeL1AD73MTm';

  try {
    const response: AxiosResponse<{ results: NotionData[] }> = await axios.post(
      `${NOTION_API_URL}/databases/${databaseId}/query`,
      {},
      {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${NOTION_SECRET}`,
        },
      }
    );

    return response.data.results;
  } catch (error) {
    console.error('Error fetching data from Notion:', (error as Error).message);
    throw error;
  }
};
