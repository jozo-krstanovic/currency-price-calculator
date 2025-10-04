"use client";

import { useState } from "react";

interface Article {
  id: number;
  priceUSD: number;
  amount: number;
  priceEUR: number;
}

export default function Home() {
  const [priceEUR, setPriceEUR] = useState<number | "">("");
  const [priceUSD, setPriceUSD] = useState<number | "">("");
  const [exchangeRate, setExchangeRate] = useState<number | null>(null);
  const [includeVAT, setIncludeVAT] = useState(false);
  const [articles, setArticles] = useState<Article[]>([]);
  const [newPriceUSD, setNewPriceUSD] = useState<number | "">("");
  const [newAmount, setNewAmount] = useState<number | "">("");

  const calculateExchangeRate = () => {
    if (priceEUR !== "" && priceUSD !== "") {
      setExchangeRate(Number(priceEUR) / Number(priceUSD));
    }
  };

  const addArticle = () => {
    if (exchangeRate && newPriceUSD !== "" && newAmount !== "") {
      let calculatedEUR = Number(newPriceUSD) * exchangeRate;
      if (includeVAT) calculatedEUR *= 1.1;

      const article: Article = {
        id: Date.now(),
        priceUSD: Number(newPriceUSD),
        amount: Number(newAmount),
        priceEUR: calculatedEUR,
      };

      setArticles([...articles, article]);
      setNewPriceUSD("");
      setNewAmount("");
    }
  };

  const deleteArticle = (id: number) => {
    setArticles(articles.filter((a) => a.id !== id));
  };

  const totalEUR = articles.reduce(
    (sum, a) => sum + a.priceEUR * a.amount,
    0
  );

  return (
    <div className="max-w-3xl mx-auto p-6 space-y-6">
      <h1 className="text-3xl font-bold text-center">Kalkulator valuta i PDV-a</h1>

      {/* Exchange rate input */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 items-end">
        <div className="flex flex-col">
          <label className="mb-1">Cijena u EUR</label>
          <input
            type="number"
            placeholder="Unesite cijenu u EUR"
            value={priceEUR}
            onChange={(e) => setPriceEUR(Number(e.target.value))}
            className="border p-2 rounded"
          />
        </div>
        <div className="flex flex-col">
          <label className="mb-1">Cijena u USD</label>
          <input
            type="number"
            placeholder="Unesite cijenu u USD"
            value={priceUSD}
            onChange={(e) => setPriceUSD(Number(e.target.value))}
            className="border p-2 rounded"
          />
        </div>
        <button
          onClick={calculateExchangeRate}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Izračunaj tečaj
        </button>
      </div>

      {exchangeRate && (
        <div className="text-lg">
          <strong>Tečaj:</strong> {exchangeRate.toFixed(4)}
        </div>
      )}

      {/* VAT checkbox */}
      <div className="flex items-center gap-2">
        <input
          type="checkbox"
          checked={includeVAT}
          onChange={(e) => setIncludeVAT(e.target.checked)}
        />
        <label>Uključi PDV (10%)</label>
      </div>

      {/* Add new article */}
      <div className="space-y-2">
        <h2 className="text-xl font-semibold">Dodaj novi artikal</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 items-end">
          <div className="flex flex-col">
            <label className="mb-1">Cijena u USD</label>
            <input
              type="number"
              placeholder="Unesite cijenu u USD"
              value={newPriceUSD}
              onChange={(e) => setNewPriceUSD(Number(e.target.value))}
              className="border p-2 rounded"
            />
          </div>
          <div className="flex flex-col">
            <label className="mb-1">Količina</label>
            <input
              type="number"
              placeholder="Unesite količinu"
              value={newAmount}
              onChange={(e) => setNewAmount(Number(e.target.value))}
              className="border p-2 rounded"
            />
          </div>
          <button
            onClick={addArticle}
            className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
          >
            Dodaj
          </button>
        </div>
      </div>

      {/* Article table */}
      {articles.length > 0 && (
        <div className="overflow-x-auto">
          <table className="w-full border-collapse border border-gray-300 mt-4">
            <thead>
              <tr className="bg-gray-200 text-center">
                <th className="border p-2">Cijena USD</th>
                <th className="border p-2">Količina</th>
                <th className="border p-2">Cijena EUR</th>
                <th className="border p-2">EUR × Količina</th>
                <th className="border p-2">Akcije</th>
              </tr>
            </thead>
            <tbody>
              {articles.map((a) => (
                <tr key={a.id} className="text-center">
                  <td className="border p-2">{a.priceUSD.toFixed(2)}</td>
                  <td className="border p-2">{a.amount}</td>
                  <td className="border p-2">{a.priceEUR.toFixed(2)}</td>
                  <td className="border p-2">
                    {(a.priceEUR * a.amount).toFixed(2)}
                  </td>
                  <td className="border p-2">
                    <button
                      onClick={() => deleteArticle(a.id)}
                      className="text-red-600 font-bold hover:text-red-800"
                    >
                      Obriši
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Total */}
      <div className="text-xl font-bold text-right mt-2">
        Ukupno EUR: {totalEUR.toFixed(2)}
      </div>
    </div>
  );
}
