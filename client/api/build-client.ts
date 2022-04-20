import axios, { AxiosInstance, AxiosRequestHeaders } from 'axios';

// The base url here is for nextjs service to make request to ingress-nginx service
// The url format is http://servicename.namespace.svc.cluster.local
// This function is server side
export const buildClient = (req: any): AxiosInstance => {
  const headers = req.headers as AxiosRequestHeaders;

  return axios.create({
    baseURL: 'http://ingress-nginx-controller.ingress-nginx.svc.cluster.local',
    headers,
  });
};

export const buildClientWithCookie = (cookie: any) =>
  axios.create({
    baseURL: 'http://ingress-nginx-controller.ingress-nginx.svc.cluster.local',
    headers: {
      Host: 'gittix.dev',
      Cookie:
        'gittix-session=eyJqd3QiOiJleUpoYkdjaU9pSklVekkxTmlKOS5leUpwWkNJNklqWXlOREEwTmpjMU5XUXhaV1V5TnpSbU4yRXpNRFJpTWlJc0ltVnRZV2xzSWpvaWRHVnpkRUIwWlhOMExtTnZiU0lzSW1saGRDSTZNVFkwT0RNM09UVXdPU3dpYVhOeklqb2laMmwwZEdsNE9tRjFkR2d0YzNKMk9tbHpjM1ZsY2lJc0ltRjFaQ0k2SW1kcGRIUnBlRHBoZFhSb0xYTnlkanBoZFdScFpXNWpaU0lzSW1WNGNDSTZNVFkwT0RRMk5Ua3dPWDAucVczeGlGNTJLZGZZU2tUNFZuY2tTVUphRUtBRE9vTEdpbkZ1NTJYYXhuNCJ9',
    },
  });
