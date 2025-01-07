import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { LAMPORTS_PER_SOL } from "@solana/web3.js";
import { useEffect, useState } from "react";
import solLogo from "../../public/solLogo.png";

export const Getbalance = () => {
  const wallet = useWallet();
  const { connection } = useConnection();
  const [balance, setBalance] = useState<number>(0);

  useEffect(() => {
    let accountChange: number | undefined;

    const fetchBalance = async () => {
      if (wallet.publicKey) {
        const balance = await connection.getBalance(wallet.publicKey);
        setBalance(balance / LAMPORTS_PER_SOL);
      }
    };
    if (wallet.publicKey) {
      fetchBalance();

      accountChange = connection.onAccountChange(
        wallet.publicKey,
        (updatedInfo) => {
          const lamports = updatedInfo.lamports;
          setBalance(lamports / LAMPORTS_PER_SOL);
        }
      );
    }
  }, [wallet.publicKey, connection]);

  return (
    <div className="flex justify-center mt-4 text-white">
      <div className="bg-zinc-800 backdrop-blur-xl rounded-xl w-64 p-4">
        <div className="flex justify-center items-center space-x-2">
          <img src={solLogo} width={60} alt="Solana Logo" />

          <p>
            <p className=" text-left text-lg tracking-widest font-bold">
              SOLANA
            </p>
            <span className="text-center text-lg font-bold">{balance}</span> SOL
          </p>
        </div>
      </div>
    </div>
  );
};
