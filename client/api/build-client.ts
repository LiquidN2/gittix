import axios, { AxiosRequestHeaders } from 'axios';
import { GetServerSidePropsContext } from 'next';

// The base url here is for nextjs service to make request to ingress-nginx service
// The url format is http://servicename.namespace.svc.cluster.local
export const buildClient = ({ req }: GetServerSidePropsContext) => {
  const headers = req.headers as AxiosRequestHeaders;

  return axios.create({
    baseURL: 'http://ingress-nginx-controller.ingress-nginx.svc.cluster.local',
    headers,
  });
};
