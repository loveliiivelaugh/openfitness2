import { create } from 'zustand';

// *** APP STORE ***

interface FitnessStoreState {
  userID: string | null;
  isDrawerOpen: boolean;
  activeDrawer: 'food' | 'exercise' | 'weight' | 'profile' | 'sleep' | 'steps';
  drawerAnchor: 'left' | 'right' | 'bottom';
  selectedSearchItem: any; // Replace `any` with the actual type if known
  fitnessTables: Record<string, any>; // Define a more specific type if available
  activeSearchTab: 'recent' | 'favorites' | 'search'
  appConfig: any;
  setAppConfig: (appConfig: any) => void;
  setFitnessTables: (fitnessTables: Record<string, any>) => void;
  toggleDrawer: (options?: { open?: boolean; anchor?: 'left' | 'right' | 'bottom'  } | boolean | null) => void;
  setActiveDrawer: (activeDrawer: string) => void;
  setSelectedSearchItem: (selectedSearchItem: any) => void; // Replace `any` with the actual type if known
  setActiveSearchTab: (activeSearchTab: 'recent' | 'favorites' | 'search') => void;
}

const useFitnessStore = create<FitnessStoreState>((set) => ({
  // states
  userID: null,
  isDrawerOpen: false,
  activeDrawer: "weight",
  drawerAnchor: "right",
  selectedSearchItem: null,
  activeSearchTab: "recent",
  fitnessTables: {},

  appConfig: null,
  setAppConfig: (appConfig) => set(() => ({ appConfig })),
  
  // actions
  setFitnessTables: (fitnessTables) => set(() => ({ fitnessTables })),
  toggleDrawer: (options) => set((state) => ({ 
    isDrawerOpen: ((options as any)?.open !== undefined) ? (options as any).open : !state.isDrawerOpen,
    drawerAnchor: ((options as any)?.anchor || state.drawerAnchor) 
  })),
  setActiveDrawer: (activeDrawer: any) => set(() => ({ activeDrawer })),
  setSelectedSearchItem: (selectedSearchItem) => set(() => ({ selectedSearchItem })),
  setActiveSearchTab: (activeSearchTab) => set(() => ({ activeSearchTab }))
}));


// *** SUPABASE STORE ***

interface SupabaseUser {
  id: string;
  email: string;
  app_metadata: {
      provider: string;
  };
  user_metadata: {
      name: string;
  };
}

interface SupabaseSession {
  access_token: string;
  token_type: string;
  user: SupabaseUser;
}

interface SupabaseStore {
  session: SupabaseSession | null;
  setSession: (session: SupabaseSession | null) => void;
  cpxData: any; // Cross Platform Exchange Data
  setCpxData: (cpxData: any) => void;
}

const useSupabaseStore = create<SupabaseStore>((set) => ({
  // states
  session: null,
  cpxData: null,
  // actions
  setSession: (session: any) => set({ session }),
  setCpxData: (cpxData: any) => set({ cpxData }),
}));


export { useSupabaseStore, useFitnessStore };
