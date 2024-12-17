import React, { useEffect, useState } from "react";
import { PurchasesList } from "./PurchasesList";
import { RaffleProgress } from "./RaffleProgress";
import { AdminStats } from "./AdminStats";
import type { Raffle } from "../../types";
import { findAll } from "@/services/payments.service";
import { getRaffleById } from "@/services/raffle.service";

const RAFFLE_ID = "6747912cd96b74b06aa5f4b9";
const APPROVED = "approved";

interface AdminPanelProps {}

export function AdminPanel({}: AdminPanelProps) {
  const [page, setPage] = useState(1);
  const [payments, setPayments] = useState([]);
  const [raffle, setRaffle] = useState();

  useEffect(() => {
    (async () => {
      const paymentsData = await findAll({
        status: APPROVED,
        page,
      });
      setPayments(paymentsData);
      const raffle = await getRaffleById(RAFFLE_ID);
      setRaffle(raffle);
    })();
  }, []);

  const handlePrevPage = async () => {
    const prev = page === 1 ? 1 : page - 1;
    setPage(prev);
    const paymentsData = await findAll({
      status: APPROVED,
      page: prev,
    });
    setPayments(paymentsData);
  };

  const handleNextPage = async () => {
    const next = page + 1;
    setPage(next);
    const paymentsData = await findAll({
      status: APPROVED,
      page: next,
    });
    setPayments(paymentsData);
  };

  return (
    <div className="space-y-6">
      <AdminStats raffle={raffle} />
      <div className="grid grid-cols-1 lg:grid-cols-1 gap-6">
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-6">
            Compras recientes
          </h2>
          <PurchasesList payments={payments} />
        </div>
        <div className="flex items-center gap-8">
          <button
            onClick={handlePrevPage}
            disabled={page === 1}
            className="rounded-md border border-slate-300 p-2.5 text-center text-sm transition-all shadow-sm hover:shadow-lg text-slate-600 hover:text-white hover:bg-slate-800 hover:border-slate-800 focus:text-white focus:bg-slate-800 focus:border-slate-800 active:border-slate-800 active:text-white active:bg-slate-800 disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none"
            type="button"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
              className="w-4 h-4"
            >
              <path
                fillRule="evenodd"
                d="M11.03 3.97a.75.75 0 0 1 0 1.06l-6.22 6.22H21a.75.75 0 0 1 0 1.5H4.81l6.22 6.22a.75.75 0 1 1-1.06 1.06l-7.5-7.5a.75.75 0 0 1 0-1.06l7.5-7.5a.75.75 0 0 1 1.06 0Z"
                clipRule="evenodd"
              />
            </svg>
          </button>

          <p className="text-slate-600">
            Page <strong className="text-slate-800">{page}</strong> &nbsp;
          </p>

          <button
            onClick={handleNextPage}
            className="rounded-md border border-slate-300 p-2.5 text-center text-sm transition-all shadow-sm hover:shadow-lg text-slate-600 hover:text-white hover:bg-slate-800 hover:border-slate-800 focus:text-white focus:bg-slate-800 focus:border-slate-800 active:border-slate-800 active:text-white active:bg-slate-800 disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none"
            type="button"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
              className="w-4 h-4"
            >
              <path
                fillRule="evenodd"
                d="M12.97 3.97a.75.75 0 0 1 1.06 0l7.5 7.5a.75.75 0 0 1 0 1.06l-7.5 7.5a.75.75 0 1 1-1.06-1.06l6.22-6.22H3a.75.75 0 0 1 0-1.5h16.19l-6.22-6.22a.75.75 0 0 1 0-1.06Z"
                clipRule="evenodd"
              />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}
