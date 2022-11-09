
import { WalletApi } from 'lucid-cardano'
import create from 'zustand'
import { persist } from 'zustand/middleware'

interface ApiState {
  api: WalletApi | null
  setApi: (newApi: WalletApi) => void
}

export const useApiStore = create<ApiState>()(
  persist(
    (set) => ({
      api: null,
      setApi: (newApi) => set({ api: newApi }),
    }),
    {
      name: 'lucid-storage',
    }
  )
)
