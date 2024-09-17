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
  registrationView: boolean;
  setRegistrationView: (registrationView: boolean) => void;
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

  registrationView: false,
  setRegistrationView: (registrationView) => set(() => ({ registrationView })),

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

interface AlertType {
  severity: "success" | "error" | "warning" | "info";
  message: string;
  open: boolean;
};

interface ConfirmType {
  open: boolean;
  title?: string;
  message?: string;
  severity?: "success" | "error" | "warning" | "info";
  continueText?: string;
  cancelText?: string;
  onConfirm?: (
    answer: boolean, 
    resolve?: (value: boolean | PromiseLike<boolean>) => void) => void | Promise<void>;
  onCancel?: (answer: boolean) => void;
};

// *** UTILITY STORE ***
interface UtilityStoreType {
  alert: AlertType
  confirm: ConfirmType
  setConfirm: (confirm: UtilityStoreType["confirm"]) => void;
  clearConfirm: () => void;
  colorMode: "light" | "dark";
  setColorMode: (colorMode: UtilityStoreType["colorMode"]) => void;
  setAlert: (alert: UtilityStoreType["alert"]) => void;
  createAlert: (severity: string, message: string) => void;
}

const useUtilityStore = create<UtilityStoreType>((set) => ({
  alert: {
    severity: "success",
    message: "",
    open: false
  },
  confirm: {
    open: false,
    title: "",
    message: "",
  },
  setConfirm: (confirm) => set(() => ({ confirm })),
  clearConfirm: () => set(() => ({ confirm: { open: false, title: "", message: "" } })),
  colorMode: "dark",
  setColorMode: (colorMode) => set(() => ({ colorMode })),
  setAlert: (alert) => set((old) => ({ ...old, alert })),
  createAlert: (severity: string, message: string) => set(() => ({ alert: { severity, message, open: true } }) as UtilityStoreType),
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
  userType: "admin" | "guest" | null;
  setUserType: (userType: "admin" | "guest" | null) => void;
  setSession: (session: SupabaseSession | null) => void;
}

const useSupabaseStore = create<SupabaseStore>((set) => ({
  // states
  session: null,
  userType: null,
  // actions
  setSession: (session: any) => set({ session }),
  setUserType: (userType: any) => set({ userType }),
}));


export { useSupabaseStore, useFitnessStore, useUtilityStore };
export type { 
  AlertType, 
  ConfirmType,
  UtilityStoreType,
  FitnessStoreState,
  SupabaseStore,
  SupabaseSession
};