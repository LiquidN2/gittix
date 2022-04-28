import { FC, FormEventHandler, useState, useEffect, FormEvent } from 'react';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';

import { useRequest } from '../../hooks/use-request';
import { FormTicketContainer } from './form-ticket.styles';

interface FormTicketProps {
  id?: string;
  title?: string;
  price?: number;
}

const FormTicket: FC<FormTicketProps> = props => {
  const [validated, setValidated] = useState(false);
  const [title, setTitle] = useState('');
  const [price, setPrice] = useState<string | number>('');
  const [isInvalidPrice, setIsInvalidPrice] = useState(false);

  // Create ticket request hook
  const { doRequest: createTicket, errors: createTicketErrors } = useRequest(
    '/api/tickets',
    'post',
    {
      title: title.trim(),
      price: Number(price),
    }
  );

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
    e.stopPropagation();

    if (Number(price) < 0) {
      setIsInvalidPrice(true);
    }

    setValidated(true);

    // Update ticket if ticket id is provided
    // if (props.id) {
    //   await updateTicket();
    //   return;
    // }
    //
    // // Create ticket
    // await createTicket();
  };

  return (
    <FormTicketContainer>
      <Form noValidate validated={validated} onSubmit={onSubmit}>
        <h1 className="h3 mb-3 fw-normal">Enter ticket details</h1>

        <Form.Group className="mb-3" controlId="title">
          <Form.Label>Title</Form.Label>
          <Form.Control
            type="text"
            value={title}
            onChange={e => setTitle(e.currentTarget.value)}
            placeholder="Awesome Concert Ticket"
            required
          />
          <Form.Control.Feedback type="invalid">
            Invalid title
          </Form.Control.Feedback>
        </Form.Group>

        <Form.Group className="mb-3" controlId="price">
          <Form.Label>Price</Form.Label>
          <Form.Control
            type="number"
            value={price}
            onChange={e => setPrice(e.currentTarget.value)}
            placeholder="200.00"
            required
            isInvalid={isInvalidPrice}
          />

          <Form.Control.Feedback type="invalid">
            Price must be greater than zero (0)
          </Form.Control.Feedback>
        </Form.Group>

        <Button type="submit">{props.id ? 'Update' : 'Create'}</Button>

        {createTicketErrors}
      </Form>
    </FormTicketContainer>
  );
};

export default FormTicket;
