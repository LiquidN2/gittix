import { FC } from 'react';

interface TicketCardProps {
  id: string;
  title: string;
  price: number;
}

const TicketCard: FC<TicketCardProps> = ({ title, price }) => {
  return (
    <div>
      {title} - ${price}
    </div>
  );
};

export default TicketCard;
