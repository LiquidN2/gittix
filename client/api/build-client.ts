import axios, { AxiosInstance, AxiosRequestHeaders } from 'axios';

// appContext.ctx.req only available on the server
// if on the server build a custom axios client
// else use a regular axios client for browser
// export const buildClient = (
//   context: AppContext | GetServerSidePropsContext
// ): AxiosInstance => {
//   if ((context as AppContext).ctx.req) {
//     return axios.create({
//       baseURL:
//         'http://ingress-nginx-controller.ingress-nginx.svc.cluster.local',
//       headers: (context as AppContext).ctx.req?.headers as AxiosRequestHeaders,
//     });
//   }

//   return axios.create({ baseURL: '/' });

//   // return context.ctx.req
//   //   ? axios.create({
//   //       baseURL:
//   //         'http://ingress-nginx-controller.ingress-nginx.svc.cluster.local',
//   //       headers: context.ctx.req.headers as AxiosRequestHeaders,
//   //     })
//   //   : axios.create({ baseURL: '/' });
// };

interface Context {
  ctx?: any;
  req?: any;
}

export function buildClient<T extends Context>(context: T): AxiosInstance {
  // Check if the context param is of type AppContext
  if (context.ctx?.req) {
    return axios.create({
      baseURL:
        'http://ingress-nginx-controller.ingress-nginx.svc.cluster.local',
      headers: context.ctx.req.headers as AxiosRequestHeaders,
    });
  }

  // Check if the context param is of type GetServerSidePropsContext or GetStaticPropsContent
  if (context.req) {
    return axios.create({
      baseURL:
        'http://ingress-nginx-controller.ingress-nginx.svc.cluster.local',
      headers: context.req.headers as AxiosRequestHeaders,
    });
  }

  // if no context returns a simple axios instance for browser request
  return axios.create({ baseURL: '/' });
}
