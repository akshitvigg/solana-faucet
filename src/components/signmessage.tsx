import { useWallet } from "@solana/wallet-adapter-react";
import { useRef, useState } from "react";
import { ed25519 } from "@noble/curves/ed25519";
import bs58 from "bs58";
import { useToast } from "@/hooks/use-toast";
import Loader from "./loader";

export const Signmsg = () => {
  const { signMessage, publicKey } = useWallet();
  const inputRef = useRef<HTMLInputElement>(null);
  const [signature, setSignature] = useState<any>("");
  const [isLoading, setLoading] = useState<boolean>(false);
  const { toast } = useToast();

  const signmsg = async () => {
    setLoading(true);
    try {
      if (!publicKey) {
        toast({
          variant: "destructive",
          title: `Wallet is not connected.`,
        });
        return;
      }
      if (!inputRef.current?.value) {
        toast({
          variant: "destructive",
          title: `Message cannot be empty.`,
        });
        return;
      }

      if (!signMessage) {
        toast({
          variant: "destructive",
          title: `Message signing is not supported by the selected wallet.`,
        });
        return;
      }
      const encodedmsg = new TextEncoder().encode(inputRef.current?.value);

      const sign = await signMessage(encodedmsg);

      if (!ed25519.verify(sign, encodedmsg, publicKey.toBytes())) {
        toast({
          variant: "destructive",
          title: `Message signature is invalid`,
        });
      }

      setSignature(bs58.encode(sign));

      toast({
        title: `Message signed successfully.`,
        description: bs58.encode(sign),
      });
    } catch (e) {
      toast({
        variant: "destructive",
        title: `An error occured while signing message.`,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="  text-zinc-700 dark:text-white ">
      <p className=" text-center font-bold text-2xl sm:text-3xl">
        Type Your Message To Be Signed
      </p>
      <div className=" mt-4 flex justify-center">
        <input
          required
          className="py-3 pl-10 outline-none sm:w-96 w-56 bg-white backdrop-blur-xl dark:bg-zinc-800/70 dark:border-zinc-700 border-gray-300 border-2  rounded-lg "
          ref={inputRef}
          type="text"
          placeholder="Type your message..."
        />
        <button
          onClick={signmsg}
          className="ml-2 sm:ml-3 text-xl text-white hover:bg-[#1a1f2e] font-medium rounded-lg bg-[#512da8] px-10  sm:px-12"
        >
          {isLoading ? <Loader /> : "Sign"}
        </button>
      </div>

      {signature && (
        <div>
          <p className=" pt-4 text-center font-bold text-2xl">Signature</p>
          <div className=" flex justify-center">
            <div className=" bg-gray-100  dark:bg-zinc-800 rounded-lg w-[340px]  sm:w-[550px] flex mt-2 justify-center">
              <p className=" text-start py-2 text-gray-500 dark:text-zinc-300 w-80 sm:w-[510px] break-words text-sm">
                {signature}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
