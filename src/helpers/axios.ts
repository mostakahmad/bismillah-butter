import axios from "axios";

const httpPost = (url: string, payload: any, config: any = null) => {
  if (!config) {
    return axios.post(url, payload);
  }
  return axios.post(url, payload, config);
};

const httpGet = (url: string) => {
  return axios.get(url);
};

export { httpPost, httpGet };
