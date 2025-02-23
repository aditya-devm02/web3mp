import React from "react";
import { products } from "../data/products";

export default function ProductList({ addToCart }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 p-6">
      {products.map((product) => (
        <div
          key={product.id}
          className="bg-gray-900 border border-gray-700 rounded-xl p-6 shadow-lg transition-all duration-300 z-0 relative scale-100"
          onMouseEnter={(e) => e.currentTarget.classList.add("z-50", "scale-105", "shadow-2xl")}
          onMouseLeave={(e) => e.currentTarget.classList.remove("z-50", "scale-105", "shadow-2xl")}
        >
          <img 
            src={product.image} 
            alt={product.name} 
            className="w-full h-48 object-cover rounded-lg"
          />
          <h2 className="text-2xl font-bold text-blue-400 mt-4">{product.name}</h2>
          <p className="text-gray-300 mt-2">{product.description}</p>
          <p className="text-xl font-semibold text-green-400 mt-2">${product.price}</p>
          <button
            onClick={() => addToCart(product)}
            className="mt-4 bg-gradient-to-r from-blue-500 to-purple-600 text-white px-6 py-3 rounded-lg font-bold shadow-lg hover:from-blue-700 hover:to-purple-800 transition duration-300"
          >
            Add to Cart 🚀
          </button>
        </div>
      ))}
    </div>
  );
}
