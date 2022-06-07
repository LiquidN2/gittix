import { FC } from 'react';

import TicketCard from './ticket-card';

interface TicketAttrs {
  id: string;
  title: string;
  price: number;
}

interface TicketListProps {
  tickets: TicketAttrs[];
}

const TicketList: FC<TicketListProps> = ({ tickets }) => {
  return tickets.length > 0 ? (
    <div>
      {tickets.map(({ id, title, price }: TicketAttrs) => (
        <TicketCard key={id} id={id} title={title} price={price} />
      ))}
    </div>
  ) : null;
};

export default TicketList;
