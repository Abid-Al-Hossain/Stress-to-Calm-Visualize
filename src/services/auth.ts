export interface User {
  id: string;
  name: string;
  email: string;
}

interface StoredUser extends User {
  password: string;
}

// Simulated network delay
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

const USERS_KEY = "stress_visualizer_users";
const CURRENT_USER_KEY = "stress_visualizer_current_user";
export const AUTH_CHANGE_EVENT = "auth-change";
let cachedCurrentUserRaw: string | null | undefined;
let cachedCurrentUser: User | null = null;

function isBrowser() {
  return typeof window !== "undefined";
}

function readUsers(): StoredUser[] {
  if (!isBrowser()) return [];
  const raw = localStorage.getItem(USERS_KEY);
  if (!raw) return [];
  try {
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? (parsed as StoredUser[]) : [];
  } catch {
    return [];
  }
}

function emitAuthChange() {
  if (!isBrowser()) return;
  window.dispatchEvent(new Event(AUTH_CHANGE_EVENT));
}

export const AuthService = {
  async register(name: string, email: string, password: string): Promise<User> {
    await delay(800); // Simulate server request

    const users = readUsers();

    if (users.find((u) => u.email === email)) {
      throw new Error("User with this email already exists");
    }

    const newUser: StoredUser = {
      id: crypto.randomUUID(),
      name,
      email,
      password,
    };

    users.push(newUser);

    if (isBrowser()) {
      localStorage.setItem(USERS_KEY, JSON.stringify(users));
      // Auto-login
      const userToReturn = {
        id: newUser.id,
        name: newUser.name,
        email: newUser.email,
      };
      localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(userToReturn));
      emitAuthChange();
      return userToReturn;
    }

    return { id: newUser.id, name: newUser.name, email: newUser.email };
  },

  async login(email: string, password: string): Promise<User> {
    await delay(800);

    const users = readUsers();

    const user = users.find(
      (u) => u.email === email && u.password === password,
    );

    if (!user) {
      throw new Error("Invalid email or password");
    }

    const userToReturn = { id: user.id, name: user.name, email: user.email };

    if (isBrowser()) {
      localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(userToReturn));
      emitAuthChange();
    }

    return userToReturn;
  },

  logout() {
    if (isBrowser()) {
      localStorage.removeItem(CURRENT_USER_KEY);
      emitAuthChange();
    }
  },

  getCurrentUser(): User | null {
    if (!isBrowser()) return null;
    const raw = localStorage.getItem(CURRENT_USER_KEY);
    if (raw === cachedCurrentUserRaw) return cachedCurrentUser;

    cachedCurrentUserRaw = raw;
    if (!raw) {
      cachedCurrentUser = null;
      return cachedCurrentUser;
    }

    try {
      cachedCurrentUser = JSON.parse(raw) as User;
      return cachedCurrentUser;
    } catch {
      cachedCurrentUser = null;
      return cachedCurrentUser;
    }
  },

  subscribe(callback: () => void) {
    if (!isBrowser()) return () => {};
    const handleChange = () => callback();
    window.addEventListener(AUTH_CHANGE_EVENT, handleChange);
    window.addEventListener("storage", handleChange);
    return () => {
      window.removeEventListener(AUTH_CHANGE_EVENT, handleChange);
      window.removeEventListener("storage", handleChange);
    };
  },

  isAuthenticated(): boolean {
    return !!this.getCurrentUser();
  },
};
