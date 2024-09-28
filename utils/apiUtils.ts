
import axios, { AxiosResponse } from 'axios';

interface QueryParams {
  chain?: string;
  format?: string;
  limit?: number;
  cursor?: string;
  exclude_spam?: boolean;
  media_items?: boolean;
  normalizeMetadata?: boolean;
  token_addresses?: object;
}

export const fetchNftData = async (
  apiKey: string,
  address: string,
  params?: QueryParams
): Promise<AxiosResponse<any>> => {
  const baseURL = 'https://deep-index.moralis.io/api/v2.2/';
  const url = `${baseURL}${address}/nft`;
  console.log(url)
  try {
    const response = await axios.get(url, {
      headers: {
        'accept': 'application/json',
        'X-API-Key': apiKey,
      },
      params,
    });
    return response;
  } catch (error) {
    console.error('Error fetching NFT data:', error);
    throw error;
  }
};
