import { FC, FormEventHandler, useState, useEffect } from 'react';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';

import { useRequest } from '../../hooks/use-request';

interface FormTicketProps {
  id?: string;
  title?: string;
  price?: number;
}

const FormTicket: FC<FormTicketProps> = props => {
  const [title, setTitle] = useState('');
  const [price, setPrice] = useState<string | number>('');

  // Create ticket request hook
  const { doRequest: createTicket } = useRequest('/api/tickets', 'post', {
    title: title.trim(),
    price: Number(price),
  });

  // Update ticket request hook
  const { doRequest: updateTicket } = useRequest(
    `/api/tickets/${props.id}`,
    'put',
    {
      title: title.trim(),
      price: Number(price),
    }
  );

  useEffect(() => {
    if (props.title) setTitle(props.title);
    if (props.price) setPrice(props.price);
  }, [props.title, props.price]);

  const onSubmit: FormEventHandler = async e => {
    e.preventDefault();

    // Update ticket if ticket id is provided
    if (props.id) {
      await updateTicket();
      return;
    }

    // Create ticket
    await createTicket();
  };

  return (
    <Form onSubmit={onSubmit}>
      <Form.Group className="mb-3" controlId="title">
        <Form.Label>Title</Form.Label>
        <Form.Control
          type="text"
          value={title}
          onChange={e => setTitle(e.currentTarget.value)}
          required
        />
      </Form.Group>
      <Form.Group className="mb-3" controlId="price">
        <Form.Label>Price</Form.Label>
        <Form.Control
          type="number"
          value={price}
          onChange={e => setPrice(e.currentTarget.value)}
        />
      </Form.Group>
      <Button type="submit">{props.id ? 'Update' : 'Create'}</Button>
    </Form>
  );
};

export default FormTicket;
