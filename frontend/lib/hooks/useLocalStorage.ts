/**
 * @FeatureID F-2
 * @Purpose React hook for localStorage with cross-tab synchronization
 * @Spec /docs/PRD.md F-2
 * @Author Chat Bot Labs
 */

import { useState, useEffect, useCallback } from "react";

/**
 * React hook for localStorage with cross-tab synchronization.
 * Automatically syncs changes across browser tabs/windows and handles SSR safely.
 * 
 * @param key - localStorage key to store/retrieve value
 * @param initialValue - Initial value if key doesn't exist in localStorage
 * @returns Tuple of [storedValue, setValue] similar to useState
 * @example
 * const [theme, setTheme] = useLocalStorage("theme", "dark");
 * setTheme("light"); // Updates localStorage and syncs across tabs
 */
export function useLocalStorage<T>(
  key: string,
  initialValue: T
): [T, (value: T | ((val: T) => T)) => void] {
  // State to store our value
  const [storedValue, setStoredValue] = useState<T>(() => {
    if (typeof window === "undefined") {
      return initialValue;
    }
    try {
      const item = window.localStorage.getItem(key);
      return item ? (JSON.parse(item) as T) : initialValue;
    } catch (error) {
      console.error(`Error reading localStorage key "${key}":`, error);
      return initialValue;
    }
  });

  // Return a wrapped version of useState's setter function that
  // persists the new value to localStorage and triggers storage event
  const setValue = useCallback(
    (value: T | ((val: T) => T)) => {
      try {
        // Allow value to be a function so we have the same API as useState
        const valueToStore =
          value instanceof Function ? value(storedValue) : value;
        
        // Save state
        setStoredValue(valueToStore);
        
        // Save to local storage
        if (typeof window !== "undefined") {
          window.localStorage.setItem(key, JSON.stringify(valueToStore));
          
          // Dispatch custom event for cross-tab synchronization
          window.dispatchEvent(
            new CustomEvent("local-storage", {
              detail: { key, value: valueToStore },
            })
          );
        }
      } catch (error) {
        console.error(`Error setting localStorage key "${key}":`, error);
      }
    },
    [key, storedValue]
  );

  // Listen for changes from other tabs/windows
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent | CustomEvent) => {
      if (e instanceof StorageEvent) {
        // Standard storage event (from other tabs)
        if (e.key === key && e.newValue) {
          try {
            setStoredValue(JSON.parse(e.newValue) as T);
          } catch (error) {
            console.error(`Error parsing storage value for "${key}":`, error);
          }
        }
      } else if (e instanceof CustomEvent) {
        // Custom event (from same tab)
        if (e.detail.key === key) {
          setStoredValue(e.detail.value as T);
        }
      }
    };

    // Listen for storage events
    window.addEventListener("storage", handleStorageChange);
    window.addEventListener("local-storage", handleStorageChange as EventListener);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
      window.removeEventListener("local-storage", handleStorageChange as EventListener);
    };
  }, [key]);

  return [storedValue, setValue];
}

