import React, { useState, useEffect } from "react";
import { getAwardedNumbersWinners } from "../../services/raffle.service";
import type { Raffle } from "../../types";

interface WinnerNumbersDetailsProps {
  raffle: Raffle;
}

export function WinnerNumbersDetails({ raffle }: WinnerNumbersDetailsProps) {
  const [awardedNumbersWinners, setAwardedNumbersWinners] = useState([]);

  useEffect(() => {
    const fetchWinners = async () => {
      if (!raffle._id) return;
      const awardedNumbersWinners = await getAwardedNumbersWinners(raffle._id);
      setAwardedNumbersWinners(awardedNumbersWinners);
    };
    fetchWinners();
    const intervalId = setInterval(fetchWinners, 10000);
    return () => {
      clearInterval(intervalId);
    };
  }, [raffle._id]);

  return (
    <div className="bg-white p-5 rounded-lg shadow-md">
      <h3 className="text-lg font-semibold mb-4">Números ganadores</h3>
      {awardedNumbersWinners?.length > 0 && (
        <div className="mt-4">
          <div className="flex flex-wrap gap-2">
            {awardedNumbersWinners?.map(({ payer, ticketNumbers }, index) => (
              <div
                key={index}
                className="flex items-center bg-gray-100 p-2 rounded"
              >
                {ticketNumbers?.map((number) => (
                  <div
                    key={number}
                    className="flex items-center bg-yellow-100 m-1 px-1 py-1 rounded border-gray-300 border"
                  >
                    <span className="m-1">{number}</span>
                  </div>
                ))}
                <span className="mr-2">{payer.email}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
