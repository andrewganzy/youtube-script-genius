
import { useState, useEffect } from "react";
import { WordPressAccount } from "@/types/wordpress";
import AccountForm from "./accounts/AccountForm";
import AccountList from "./accounts/AccountList";
import { loadAccounts, saveAccounts } from "./accounts/AccountsStorage";

interface AccountsManagerProps {
  accounts: WordPressAccount[];
  setAccounts: (accounts: WordPressAccount[]) => void;
}

const AccountsManager = ({ accounts, setAccounts }: AccountsManagerProps) => {
  const [activeAccount, setActiveAccount] = useState<WordPressAccount | null>(null);

  // Load accounts from localStorage on component mount
  useEffect(() => {
    const savedAccounts = loadAccounts();
    if (savedAccounts.length > 0) {
      setAccounts(savedAccounts);
    }
  }, [setAccounts]);

  // Save accounts to localStorage whenever they change
  useEffect(() => {
    if (accounts) {
      saveAccounts(accounts);
    }
  }, [accounts]);

  const handleEditAccount = (account: WordPressAccount) => {
    setActiveAccount(account);
  };

  return (
    <div className="space-y-8">
      <AccountForm 
        accounts={accounts} 
        setAccounts={setAccounts} 
      />
      <AccountList 
        accounts={accounts} 
        setAccounts={setAccounts} 
        onEdit={handleEditAccount} 
      />
    </div>
  );
};

export default AccountsManager;
