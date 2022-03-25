import axios from 'axios';
import { useState } from 'react';
import Alert from 'react-bootstrap/Alert';

interface Error {
  message: string;
  field?: string;
}

export const useRequest = (
  url: string,
  method: 'get' | 'post',
  body: Record<string, any>
) => {
  const [errors, setErrors] = useState<any>(null);

  const doRequest = async () => {
    try {
      const response = await axios[method](url, body);
      return response.data;
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
    }
  };

  return { errors, doRequest };
};
