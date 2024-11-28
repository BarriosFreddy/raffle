import { React } from "react";
import TicketImage from "@/assets/images/ticket.png";

type TicketContainerProps = {
  ticketNumber: number;
};

export const TicketContainer = ({ ticketNumber }: TicketContainerProps) => {
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
        {ticketNumber}
        </span>
    </div>;
};

const styles = {
  container: {},
  content: {
  }
};
