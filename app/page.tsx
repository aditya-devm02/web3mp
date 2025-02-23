"use client";
import React, { useEffect, useMemo, useState } from "react";
import { useSession, signOut } from "next-auth/react";
import { LoginButton } from "@/app/components/LoginButton";
import GetButton from "@/app/components/GetButton";
import { getAccount, useOkto, getPortfolioActivity } from "@okto_web3/react-sdk";
import ProductList from "@/app/components/ProductList";
import Cart from "@/app/components/Cart";
import { motion } from "framer-motion";
import { Orbitron } from "next/font/google";
import CheckJobStatus from "./components/CheckJobStatus";

// Blockchain-inspired Font
const orbitron = Orbitron({ subsets: ["latin"], weight: "700" });

export default function Home() {
    const { data: session } = useSession();
    const oktoClient = useOkto();
    const [cartItems, setCartItems] = useState([]);
    const [showProducts, setShowProducts] = useState(false);
    const [showCart, setShowCart] = useState(false);
    const [portfolioActivity, setPortfolioActivity] = useState(null);
    const [showActivity, setShowActivity] = useState(false); // Toggle activity display

    //@ts-expect-error
    const idToken = useMemo(() => (session ? session.id_token : null), [session]);

    async function handleAuthenticate(): Promise<any> {
        if (!idToken) {
            return { result: false, error: "No Google login" };
        }
        const user = await oktoClient.loginUsingOAuth({
            idToken: idToken,
            provider: "google",
        });
        console.log("Authentication Success", user);
        return JSON.stringify(user);
    }

    async function handleLogout() {
        try {
            signOut();
            return { result: "logout success" };
        } catch (error) {
            return { result: "logout failed" };
        }
    }

    async function fetchPortfolioActivity() {
        if (showActivity) {
            setShowActivity(false); // Hide if already visible
            return;
        }

        try {
            const activity = await getPortfolioActivity(oktoClient);
            setPortfolioActivity(activity);
            setShowActivity(true); // Show activity box
            console.log("Portfolio Activity:", activity);
        } catch (error) {
            console.error("Failed to fetch portfolio activity:", error);
        }
    }

    useEffect(() => {
        if (idToken) {
            handleAuthenticate();
        }
    }, [idToken]);

    const addToCart = (product) => {
        setCartItems([...cartItems, product]);
    };

    const removeFromCart = (index) => {
        setCartItems(cartItems.filter((_, i) => i !== index));
    };

    return (
        <main className="flex min-h-screen flex-col items-center space-y-8 p-12 bg-gradient-to-br from-purple-900 to-black text-white relative overflow-hidden">
            {/* Background Blockchain Animation */}
            <div className="absolute inset-0 z-0 flex justify-center items-center">
                <div className="animate-pulse w-96 h-96 bg-blue-500 opacity-20 rounded-full filter blur-3xl"></div>
                <div className="animate-spin w-72 h-72 bg-green-500 opacity-20 rounded-full filter blur-3xl absolute"></div>
                <div className="animate-ping w-64 h-64 bg-purple-500 opacity-20 rounded-full filter blur-3xl absolute"></div>
            </div>

            {/* Activity Button & Auth Buttons */}
            <div className="absolute top-1/4 left-4 flex flex-col space-y-4 z-10">
                {/* Fetch Portfolio Activity Button */}
                <button
                    onClick={fetchPortfolioActivity}
                    className="px-6 py-3 bg-purple-500 hover:bg-purple-700 text-white font-bold rounded-lg shadow-lg transition duration-300 transform hover:scale-110"
                >
                    {showActivity ? "Hide Activity" : "Fetch Portfolio Activity"}
                </button>

                {/* Authentication Buttons */}
                <LoginButton className="px-6 py-3 bg-blue-500 hover:bg-blue-700 text-white font-bold rounded-lg shadow-lg transition duration-300 transform hover:scale-110" />
                <GetButton title="Okto Log out" apiFn={handleLogout} className="px-6 py-3 bg-red-500 hover:bg-red-700 text-white font-bold rounded-lg shadow-lg transition duration-300 transform hover:scale-110" />
                <GetButton title="getAccount" apiFn={getAccount} className="px-6 py-3 bg-green-500 hover:bg-green-700 text-white font-bold rounded-lg shadow-lg transition duration-300 transform hover:scale-110" />
            </div>

            {/* Animated Heading */}
            <motion.h1
                className={`text-white text-6xl mt-24 tracking-widest text-center ${orbitron.className}`}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 1.5, ease: "easeOut" }}
            >
                E-commerce <span className="text-yellow-500">Web3</span> Marketplace
            </motion.h1>

            {/* Toggle Buttons */}
            <div className="flex space-x-6 mt-6">
                <button
                    onClick={() => setShowProducts(!showProducts)}
                    className="px-8 py-4 bg-yellow-500 hover:bg-yellow-700 text-black font-bold rounded-lg shadow-lg transition duration-300 transform hover:scale-110"
                >
                    {showProducts ? "Hide Products" : "Shop Now"}
                </button>
                <button
                    onClick={() => setShowCart(!showCart)}
                    className="px-8 py-4 bg-blue-500 hover:bg-blue-700 text-white font-bold rounded-lg shadow-lg transition duration-300 transform hover:scale-110"
                >
                    {showCart ? "Hide Cart" : "Show Cart"}
                </button>
            </div>

            {/* Product List */}
            {showProducts && (
                <motion.div
                    className="glassmorphism-card w-full max-w-4xl p-6 rounded-xl shadow-lg mt-8 z-10"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                >
                    <ProductList addToCart={addToCart} />
                </motion.div>
            )}

            {/* Cart Component */}
            {showCart && (
                <motion.div
                    className="glassmorphism-card w-full max-w-2xl p-8 rounded-xl shadow-lg mt-8 z-10"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                >
                    <Cart cartItems={cartItems} removeFromCart={removeFromCart} />
                    
                    {/* Attractive CheckJobStatus Button */}
                    <div className="mt-6 flex justify-center">
    <CheckJobStatus />
</div>
                </motion.div>
            )}

            {/* Portfolio Activity Display (Toggle on Click) */}
            {showActivity && portfolioActivity && (
                <motion.div
                    className="glassmorphism-card w-full max-w-3xl p-6 rounded-xl shadow-lg mt-8 z-10"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    transition={{ duration: 0.5 }}
                >
                    <h2 className="text-xl font-bold text-yellow-500 mb-4">Portfolio Activity</h2>
                    <ul className="space-y-2">
                        {portfolioActivity.map((activity, index) => (
                            <li key={index} className="p-2 border border-gray-600 rounded-lg bg-gray-800">
                                {activity.transactionHash} - {activity.type} - {activity.amount}
                            </li>
                        ))}
                    </ul>
                </motion.div>
            )}
        </main>
    );
}
