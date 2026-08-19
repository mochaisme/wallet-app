"use client";
import { useEffect, useState } from "react";
import { createClient } from "../lib/supabase";

interface Transaction {
  id: string;
  title: string;
  amount: number;
  type: string;
  transaction_date: string;
}

export default function Home() {
  const supabase = createClient();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [title, setTitle] = useState("");
  const [amount, setAmount] = useState("");

  const fetchTransactions = async () => {
    const { data } = await supabase
      .from("transactions")
      .select("*")
      .order("transaction_date", { ascending: false });
    if (data) setTransactions(data);
  };

  useEffect(() => {
    fetchTransactions();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !amount) return;

    await supabase.from("transactions").insert([
      {
        title,
        amount: Number(amount),
        type: "expense",
      },
    ]);

    setTitle("");
    setAmount("");
    fetchTransactions();
  };

  return (
    <main className="max-w-md mx-auto p-4 space-y-6">
      <h1 className="text-xl font-bold">Catatan Wallet</h1>

      <form onSubmit={handleSubmit} className="space-y-3 bg-zinc-900 p-4 rounded-xl">
        <input
          type="text"
          placeholder="Nama Pengeluaran"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full p-2 rounded bg-zinc-800 border border-zinc-700 text-white"
        />
        <input
          type="number"
          placeholder="Jumlah (Rp)"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          className="w-full p-2 rounded bg-zinc-800 border border-zinc-700 text-white"
        />
        <button
          type="submit"
          className="w-full bg-blue-600 hover:bg-blue-500 py-2 rounded font-medium text-white"
        >
          Simpan Transaksi
        </button>
      </form>

      <div className="space-y-2">
        <h2 className="font-semibold text-lg">Riwayat</h2>
        {transactions.map((tx) => (
          <div key={tx.id} className="flex justify-between p-3 bg-zinc-900 rounded-lg">
            <span>{tx.title}</span>
            <span className="text-red-400">-Rp {Number(tx.amount).toLocaleString("id-ID")}</span>
          </div>
        ))}
      </div>
    </main>
  );
}