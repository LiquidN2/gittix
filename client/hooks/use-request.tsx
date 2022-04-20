import axios from 'axios';
import { ReactElement, useState } from 'react';
import Alert from 'react-bootstrap/Alert';

interface Error {
  message: string;
  field?: string;
}

export const useRequest = (
  url: string,
  method: 'get' | 'post' | 'patch' | 'put' | 'delete',
  body: Record<string, any>,
  successCallback?: Function
) => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [data, setData] = useState<any>(null);
  const [errors, setErrors] = useState<ReactElement | null>(null);

  const doRequest = async () => {
    setIsLoading(true);

    try {
      const response = await axios[method](url, body);

      setData(response.data);
      setIsLoading(false);
      setErrors(null);

      if (successCallback) successCallback();
    } catch (e: any) {
      // setErrors(e.response.data.errors);
      setErrors(
        e.response.data.errors.length !== 0 ? (
          <Alert variant="danger">
            <ul className="my-0">
              {e.response.data.errors.map((error: Error, index: number) => (
                <li key={index}>{error.message}</li>
              ))}
            </ul>
          </Alert>
        ) : null
      );

      setIsLoading(false);
      setData(null);
    }
  };

  return { doRequest, isLoading, data, errors };
};
