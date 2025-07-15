import {
  createContext,
  ReactNode,
  useCallback,
  useMemo,
  useState,
} from "react";

type HeaderState = {
  disabled: boolean;
  isLoading: boolean;
  reset: VoidFunction | null;
  submit: VoidFunction | null;
};

export type PageContextType = {
  headerState: HeaderState;
  updateHeaderState: (state: HeaderState) => void;
};

// @ts-ignore
export const PageContext = createContext<PageContextType>(undefined);

export const PageContextProvider = ({ children }: { children: ReactNode }) => {
  const [headerState, setHeaderState] = useState<HeaderState>({
    disabled: true,
    isLoading: false,
    reset: null,
    submit: null,
  });

  const updateHeaderState = useCallback((newState: HeaderState) => {
    setHeaderState((prevState) => {
      return { ...prevState, ...newState };
    });
  }, []);

  const context = useMemo(() => {
    return {
      headerState,
      updateHeaderState,
    };
  }, [headerState, updateHeaderState]);

  return (
    <PageContext.Provider value={context}>{children}</PageContext.Provider>
  );
};
