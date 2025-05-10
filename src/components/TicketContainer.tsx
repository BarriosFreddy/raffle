import { React } from "react";
import TicketImage from "@/assets/images/ticket.png";
import { formatTicketNumber } from "@/utils/formatNumber";

type TicketContainerProps = {
  ticketNumber: number;
  digits?: number;
};

export const TicketContainer = ({ ticketNumber, digits = 0 }: TicketContainerProps) => {
  return <div className="w-1/2" style={{
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    width: 200,
    height: 100,
    backgroundImage: `url(${TicketImage})`,
    backgroundSize: '100% 100%',
    backgroundRepeat: 'no-repeat',
  }}>
    <span style={{
    textAlign: "center",
    lineHeight: 2,
    fontSize: 40,
    fontWeight: 'bold',
  }}>
        {formatTicketNumber(ticketNumber, digits)} 
        </span>
    </div>;
};
