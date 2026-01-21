export interface User {
  id: string;
  name: string;
  email: string;
}

// Simulated network delay
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

const USERS_KEY = "stress_visualizer_users";
const CURRENT_USER_KEY = "stress_visualizer_current_user";

export const AuthService = {
  async register(name: string, email: string, password: string): Promise<User> {
    await delay(800); // Simulate server request

    // Get existing users
    let users: any[] = [];
    if (typeof window !== "undefined") {
      const raw = localStorage.getItem(USERS_KEY);
      if (raw) users = JSON.parse(raw);
    }

    if (users.find((u) => u.email === email)) {
      throw new Error("User with this email already exists");
    }

    const newUser = {
      id: crypto.randomUUID(),
      name,
      email,
      password,
    };

    users.push(newUser);

    if (typeof window !== "undefined") {
      localStorage.setItem(USERS_KEY, JSON.stringify(users));
      // Auto-login
      const userToReturn = {
        id: newUser.id,
        name: newUser.name,
        email: newUser.email,
      };
      localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(userToReturn));
      return userToReturn;
    }

    return { id: newUser.id, name: newUser.name, email: newUser.email };
  },

  async login(email: string, password: string): Promise<User> {
    await delay(800);

    let users: any[] = [];
    if (typeof window !== "undefined") {
      const raw = localStorage.getItem(USERS_KEY);
      if (raw) users = JSON.parse(raw);
    }

    const user = users.find(
      (u) => u.email === email && u.password === password,
    );

    if (!user) {
      throw new Error("Invalid email or password");
    }

    const userToReturn = { id: user.id, name: user.name, email: user.email };

    if (typeof window !== "undefined") {
      localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(userToReturn));
    }

    return userToReturn;
  },

  logout() {
    if (typeof window !== "undefined") {
      localStorage.removeItem(CURRENT_USER_KEY);
    }
  },

  getCurrentUser(): User | null {
    if (typeof window === "undefined") return null;
    const raw = localStorage.getItem(CURRENT_USER_KEY);
    if (!raw) return null;
    try {
      return JSON.parse(raw);
    } catch {
      return null;
    }
  },

  isAuthenticated(): boolean {
    return !!this.getCurrentUser();
  },
};
