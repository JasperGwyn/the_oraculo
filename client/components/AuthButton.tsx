'use client'

import { useAuth } from "@crossmint/client-sdk-react-ui";
import { Button } from "@/components/ui/button";

export default function AuthButton() {
  const { login, logout, jwt } = useAuth();

  return (
    <div className="flex items-center gap-4">
      {!jwt ? (
        <Button
          variant="outline"
          onClick={login}
          className="bg-gradient-to-r from-[#a8d5d0] to-[#d5f2ef] text-slate-700 hover:from-[#97c0bb] hover:to-[#c0dbd8] hover:text-slate-900 transition-all duration-300 border-slate-300"
        >
          Connect Wallet
        </Button>
      ) : (
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            onClick={logout}
            className="bg-white text-slate-800 hover:bg-slate-100 transition-all duration-300 border-2 border-slate-400"
          >
            Disconnect
          </Button>
        </div>
      )}
    </div>
  );
}