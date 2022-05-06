import { FC, FormEventHandler, useState, useEffect } from 'react';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Alert from 'react-bootstrap/Alert';

import { useRequest } from '../../hooks/use-request';
import { FormTicketContainer } from './form-ticket.styles';

interface FormTicketProps {
  id?: string;
  title?: string;
  price?: number;
  onSubmit?: Function;
}

const FormTicket: FC<FormTicketProps> = props => {
  const [title, setTitle] = useState('');
  const [price, setPrice] = useState<number | string>('');
  const [isDisplayedResult, setIsDisplayedResult] = useState(false);

  // Create ticket request hook
  const {
    doRequest: createTicket,
    errors: createTicketErrors,
    isLoading: isCreatingTicket,
    data: ticketCreatedData,
  } = useRequest('/api/tickets', 'post', {
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

  // Removes form submission result after 3s
  useEffect(() => {
    if (!isDisplayedResult) return;
    setTimeout(() => setIsDisplayedResult(false), 3000);
  }, [isDisplayedResult]);

  const onSubmit: FormEventHandler = async e => {
    e.preventDefault();

    // Update ticket if ticket id is provided
    // else create new ticket
    if (props.id) {
      await updateTicket();
    } else {
      await createTicket();
    }

    // Display submission result
    setIsDisplayedResult(true);
    setPrice(0);
    setTitle('');
  };

  return (
    <FormTicketContainer>
      <Form onSubmit={onSubmit}>
        <h1 className="h3 mb-3 fw-normal">
          {props.id
            ? 'Provide updated details of your ticket'
            : 'I would like to sell the following ticket'}
        </h1>

        <Form.Group className="mb-3" controlId="title">
          <Form.Label>Ticket title</Form.Label>
          <Form.Control
            type="text"
            value={title}
            onChange={e => setTitle(e.currentTarget.value)}
            placeholder="Awesome Concert Ticket"
            required
          />
        </Form.Group>

        <Form.Group className="mb-3" controlId="price">
          <Form.Label>Price</Form.Label>
          <Form.Control
            type="number"
            value={price}
            onChange={e => setPrice(Number(e.currentTarget.value))}
            placeholder="200.00"
            required
          />
        </Form.Group>

        <Button className="mb-3" type="submit">
          {props.id ? 'Update' : 'Create'}
        </Button>

        {isDisplayedResult && createTicketErrors}
        {isDisplayedResult && ticketCreatedData && (
          <Alert variant="success">Ticket created</Alert>
        )}
      </Form>
    </FormTicketContainer>
  );
};

export default FormTicket;
