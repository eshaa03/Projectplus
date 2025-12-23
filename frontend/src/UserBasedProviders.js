import { useContext } from "react";
import { UserContext } from "./context/UserContext";
import { SearchProvider } from "./context/SearchContext";
import App from "./App";

export default function UserBasedProviders() {
  const { user, token } = useContext(UserContext);

  // Changing the key ensures SearchProvider remounts when user or token changes
  return (
    <SearchProvider key={user?.id || token || "guest"}>
      <App />
    </SearchProvider>
  );
}
