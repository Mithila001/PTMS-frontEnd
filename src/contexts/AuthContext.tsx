// F:\OnGoinProject\Transport Management System\ptms-frontEnd\src\contexts\AuthContext.tsx

import { createContext, useContext, useState, useEffect, type ReactNode } from "react";
import { fetchCurrentUser, login, logout } from "../api/authService";
import type { Role, User, UserCredentials } from "../types/user";

// Define the shape of our authentication context
interface AuthContextType {
  user: User | null;
  isLoggedIn: boolean;
  loading: boolean;
  login: (credentials: UserCredentials) => Promise<void>;
  logout: () => Promise<void>;
  hasRole: (roleName: string) => boolean;
  highestRole: string | null;
}

// Create the context with an initial undefined value
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Define the props for our AuthProvider component
interface AuthProviderProps {
  children: ReactNode;
}

/**
 * The AuthProvider component provides the authentication state to its children.
 * It handles the initial user check and provides methods for login and logout.
 */
export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [highestRole, setHighestRole] = useState<string | null>(null);

  const ROLE_HIERARCHY = ["ROLE_ADMIN", "ROLE_OPERATIONS_MANAGER", "ROLE_USER"];

  /**
   * Determines the highest role from a user's roles array.
   */
  const determineHighestRole = (roles: Role[]): string | null => {
    if (!roles || roles.length === 0) {
      return null;
    }

    if (roles.length === 1) {
      return roles[0].toString();
    }

    // Find the first role in the user's list that matches our hierarchy
    for (const hierarchyRole of ROLE_HIERARCHY) {
      if (roles.some((userRole) => userRole.name === hierarchyRole)) {
        return hierarchyRole;
      }
    }
    return null;
  };

  // This is the CRITICAL ADDITION for state synchronization.
  useEffect(() => {
    if (user) {
      setHighestRole(determineHighestRole(user.roles));
    } else {
      setHighestRole(null);
    }
  }, [user]);

  // Use an effect to check for a logged-in user on component mount
  useEffect(() => {
    const checkAuthStatus = async () => {
      try {
        const currentUser = await fetchCurrentUser();
        if (currentUser) {
          setUser(currentUser);
          //setHighestRole(determineHighestRole(currentUser.roles));
        }
      } catch (error) {
        console.error("Failed to fetch initial user status:", error);
      } finally {
        setLoading(false);
      }
    };

    checkAuthStatus();
  }, []); // The empty dependency array ensures this runs only once on mount

  // Handles the login logic
  const handleLogin = async (credentials: UserCredentials) => {
    setLoading(true);
    try {
      const loggedInUser = await login(credentials);
      setUser(loggedInUser);
    } finally {
      setLoading(false);
    }
  };

  // Handles the logout logic
  const handleLogout = async () => {
    setLoading(true);
    try {
      await logout();
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  // Checks if the user has a specific role
  const hasRole = (roleName: string): boolean => {
    return user ? user.roles.some((role) => role.name === roleName) : false;
  };

  // The value that will be provided by the context
  const value = {
    user,
    isLoggedIn: !!user,
    loading,
    login: handleLogin,
    logout: handleLogout,
    hasRole,
    highestRole,
  };

  // Render the children wrapped in the context provider
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

/**
 * A custom hook to consume the AuthContext.
 * This makes it easy for components to access the auth state and functions.
 */
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
