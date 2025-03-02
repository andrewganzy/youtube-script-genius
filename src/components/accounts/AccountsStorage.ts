
import { WordPressAccount } from "@/types/wordpress";

const STORAGE_KEY = "wordpress_accounts";

export const loadAccounts = (): WordPressAccount[] => {
  const savedAccounts = localStorage.getItem(STORAGE_KEY);
  if (savedAccounts && savedAccounts !== "undefined" && savedAccounts !== "null") {
    try {
      return JSON.parse(savedAccounts);
    } catch (error) {
      console.error("Failed to parse accounts from localStorage:", error);
    }
  }
  return [];
};

export const saveAccounts = (accounts: WordPressAccount[]) => {
  if (accounts) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(accounts));
  }
};
