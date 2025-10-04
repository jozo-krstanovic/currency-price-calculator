"use client";

import { useState } from "react";

interface Article {
  id: number;
  priceUSD: number;
  amount: number;
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
      const article: Article = {
        id: Date.now(),
        priceUSD: Number(newPriceUSD),
        amount: Number(newAmount),
      };

      setArticles([...articles, article]);
      setNewPriceUSD("");
      setNewAmount("");
    }
  };

  const deleteArticle = (id: number) => {
    setArticles(articles.filter((a) => a.id !== id));
  };

  // Function to calculate EUR price for an article
  const calcEUR = (priceUSD: number) => {
    if (!exchangeRate) return 0;
    let priceEUR = priceUSD * exchangeRate;
    if (includeVAT) priceEUR *= 1.1;
    return priceEUR;
  };

  // Total EUR calculation
  const totalEUR = articles.reduce(
    (sum, a) => sum + calcEUR(a.priceUSD) * a.amount,
    0
  );

  return (
    <div className="max-w-3xl mx-auto p-4 sm:p-6 space-y-6 text-gray-900 dark:text-gray-100">
      <h1 className="text-3xl font-bold text-center">Kalkulator valuta i PDV-a</h1>

      {/* Exchange rate input */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 items-end">
        <div className="flex flex-col">
          <label className="mb-1 font-medium">Cijena u EUR</label>
          <input
            type="number"
            placeholder="Unesite cijenu u EUR"
            value={priceEUR}
            onChange={(e) => setPriceEUR(Number(e.target.value))}
            className="border p-2 rounded focus:ring-2 focus:ring-blue-400 dark:bg-gray-800 dark:border-gray-600 dark:focus:ring-blue-500"
          />
        </div>
        <div className="flex flex-col">
          <label className="mb-1 font-medium">Cijena u USD</label>
          <input
            type="number"
            placeholder="Unesite cijenu u USD"
            value={priceUSD}
            onChange={(e) => setPriceUSD(Number(e.target.value))}
            className="border p-2 rounded focus:ring-2 focus:ring-blue-400 dark:bg-gray-800 dark:border-gray-600 dark:focus:ring-blue-500"
          />
        </div>
        <button
          onClick={calculateExchangeRate}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 w-full sm:w-auto dark:bg-blue-500 dark:hover:bg-blue-600"
        >
          Izračunaj tečaj
        </button>
      </div>

      {exchangeRate && (
        <div className="text-lg font-semibold">
          Tečaj: <span className="text-blue-700 dark:text-blue-400">{exchangeRate.toFixed(4)}</span>
        </div>
      )}

      {/* VAT checkbox */}
      <div className="flex items-center gap-2">
        <input
          type="checkbox"
          checked={includeVAT}
          onChange={(e) => setIncludeVAT(e.target.checked)}
          className="w-5 h-5"
        />
        <label className="font-medium">Uključi PDV (10%)</label>
      </div>

      {/* Add new article */}
      <div className="space-y-2">
        <h2 className="text-xl font-semibold">Dodaj novi artikal</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 items-end">
          <div className="flex flex-col">
            <label className="mb-1 font-medium">Cijena u USD</label>
            <input
              type="number"
              placeholder="Unesite cijenu u USD"
              value={newPriceUSD}
              onChange={(e) => setNewPriceUSD(Number(e.target.value))}
              className="border p-2 rounded focus:ring-2 focus:ring-green-400 dark:bg-gray-800 dark:border-gray-600 dark:focus:ring-green-500"
            />
          </div>
          <div className="flex flex-col">
            <label className="mb-1 font-medium">Količina</label>
            <input
              type="number"
              placeholder="Unesite količinu"
              value={newAmount}
              onChange={(e) => setNewAmount(Number(e.target.value))}
              className="border p-2 rounded focus:ring-2 focus:ring-green-400 dark:bg-gray-800 dark:border-gray-600 dark:focus:ring-green-500"
            />
          </div>
          <button
            onClick={addArticle}
            className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 w-full sm:w-auto dark:bg-green-500 dark:hover:bg-green-600"
          >
            Dodaj
          </button>
        </div>
      </div>

      {/* Article table */}
      {articles.length > 0 && (
        <div className="overflow-x-auto">
          <table className="w-full border-collapse border border-gray-300 dark:border-gray-600 mt-4 text-center">
            <thead>
              <tr className="bg-gray-200 dark:bg-gray-700 font-semibold">
                <th className="border p-2">Cijena USD</th>
                <th className="border p-2">Količina</th>
                <th className="border p-2">Cijena EUR</th>
                <th className="border p-2">EUR × Količina</th>
                <th className="border p-2">Akcije</th>
              </tr>
            </thead>
            <tbody>
              {articles.map((a, index) => {
                const priceEUR = calcEUR(a.priceUSD);
                return (
                  <tr
                    key={a.id}
                    className={
                      index % 2 === 0
                        ? "bg-white dark:bg-gray-800"
                        : "bg-gray-50 dark:bg-gray-700"
                    }
                  >
                    <td className="border p-2">{a.priceUSD.toFixed(2)}</td>
                    <td className="border p-2">{a.amount}</td>
                    <td className="border p-2">{priceEUR.toFixed(2)}</td>
                    <td className="border p-2">{(priceEUR * a.amount).toFixed(2)}</td>
                    <td className="border p-2">
                      <button
                        onClick={() => deleteArticle(a.id)}
                        className="text-red-600 font-bold hover:text-red-800 dark:text-red-400 dark:hover:text-red-300"
                      >
                        Obriši
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
            <tfoot>
              <tr className="bg-yellow-100 dark:bg-yellow-700 font-bold">
                <td className="border p-2 text-right" colSpan={3}>
                  Ukupno EUR:
                </td>
                <td className="border p-2">{totalEUR.toFixed(2)}</td>
                <td className="border p-2"></td>
              </tr>
            </tfoot>
          </table>
        </div>
      )}
    </div>
  );
}
