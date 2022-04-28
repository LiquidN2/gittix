import axios, { AxiosInstance, AxiosRequestHeaders } from 'axios';
import { AppContext } from 'next/app';

// appContext.ctx.req only available on the server
// if on the server build a custom axios client
// else use a regular axios client for browser
export const buildClient = (appContext: AppContext): AxiosInstance =>
  appContext.ctx.req
    ? axios.create({
        baseURL:
          'http://ingress-nginx-controller.ingress-nginx.svc.cluster.local',
        headers: appContext.ctx.req.headers as AxiosRequestHeaders,
      })
    : axios.create({ baseURL: '/' });
