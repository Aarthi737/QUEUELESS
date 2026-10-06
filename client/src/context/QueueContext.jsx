import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { authAPI, queuesAPI, adminAPI } from '../services/api';
import { initialServices } from '../data/services';
import { initialUserQueue, initialQueueHistory } from '../data/queues';
import { mockUsers } from '../data/users';

const QueueContext = createContext();

export const QueueProvider = ({ children }) => {
  const [services, setServices] = useState(initialServices);
  const [userQueue, setUserQueue] = useState(null);
  const [queueHistory, setQueueHistory] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [toasts, setToasts] = useState([]);

  // Toast notifications helper
  const addToast = useCallback((message, type = 'info', duration = 3500) => {
    const id = Date.now() + Math.random().toString(36).substring(2, 7);
    setToasts((prev) => [...prev, { id, message, type }]);

    if (duration > 0) {
      setTimeout(() => {
        removeToast(id);
      }, duration);
    }
  }, []);

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  // Fetch all queues from backend
  const fetchQueues = useCallback(async () => {
    try {
      const res = await queuesAPI.getAll();
      if (res.success && Array.isArray(res.data)) {
        setServices(res.data);
      }
    } catch (err) {
      console.warn('Backend queues fetch failed, using local fallback:', err.message);
    }
  }, []);

  // Fetch active queue for current user
  const fetchMyActiveQueue = useCallback(async () => {
    try {
      const token = localStorage.getItem('queueless_token');
      if (!token) return;
      const res = await queuesAPI.getMyActive();
      if (res.success) {
        setUserQueue(res.data);
      }
    } catch (err) {
      console.warn('Backend active queue fetch failed:', err.message);
    }
  }, []);

  // Fetch queue history for current user
  const fetchMyHistory = useCallback(async () => {
    try {
      const token = localStorage.getItem('queueless_token');
      if (!token) return;
      const res = await queuesAPI.getMyHistory();
      if (res.success && Array.isArray(res.data)) {
        setQueueHistory(res.data);
      }
    } catch (err) {
      console.warn('Backend history fetch failed:', err.message);
    }
  }, []);

  // Initialize session on mount
  useEffect(() => {
    const initApp = async () => {
      setIsLoading(true);
      await fetchQueues();

      const existingToken = localStorage.getItem('queueless_token');
      if (existingToken) {
        try {
          const meRes = await authAPI.getMe();
          if (meRes.success && meRes.user) {
            setCurrentUser(meRes.user);
            await fetchMyActiveQueue();
            await fetchMyHistory();
          }
        } catch (err) {
          console.warn('Stored token validation failed, performing demo login:', err.message);
          localStorage.removeItem('queueless_token');
          await loginAs('customer');
        }
      } else {
        // Auto-authenticate as default customer demo user so app is instantly ready with live token
        await loginAs('customer');
      }
      setIsLoading(false);
    };

    initApp();
  }, []);

  // Real API Login
  const login = async (email, password) => {
    try {
      const res = await authAPI.login(email, password);
      if (res.success && res.token) {
        localStorage.setItem('queueless_token', res.token);
        setCurrentUser(res.user);
        await fetchMyActiveQueue();
        await fetchMyHistory();
        await fetchQueues();
        addToast(`Welcome back, ${res.user.name}!`, 'success');
        return { success: true, user: res.user };
      }
    } catch (err) {
      addToast(err.message || 'Login failed', 'error');
      return { success: false, message: err.message };
    }
  };

  // Real API Register
  const register = async (userData) => {
    try {
      const res = await authAPI.register(userData);
      if (res.success && res.token) {
        localStorage.setItem('queueless_token', res.token);
        setCurrentUser(res.user);
        setUserQueue(null);
        setQueueHistory([]);
        await fetchQueues();
        addToast('Account created successfully!', 'success');
        return { success: true, user: res.user };
      }
    } catch (err) {
      addToast(err.message || 'Registration failed', 'error');
      return { success: false, message: err.message };
    }
  };

  // Switch demo user / role
  const loginAs = async (role) => {
    const roleCredentials = {
      customer: { email: 'aarthi.sharma@example.com', password: 'password123' },
      staff: { email: 'r.kumar@citycare.org', password: 'password123' },
      admin: { email: 'admin@queueless.io', password: 'password123' },
    };

    const creds = roleCredentials[role] || roleCredentials.customer;

    try {
      const res = await authAPI.login(creds.email, creds.password);
      if (res.success && res.token) {
        localStorage.setItem('queueless_token', res.token);
        setCurrentUser(res.user);
        await fetchMyActiveQueue();
        await fetchMyHistory();
        await fetchQueues();
        addToast(`Logged in as ${res.user.name} (${res.user.role.toUpperCase()})`, 'info');
        return res.user;
      }
    } catch (err) {
      console.warn('Demo login via API failed, using local mock user:', err.message);
      const user = mockUsers.find((u) => u.role === role) || mockUsers[0];
      setCurrentUser(user);
      return user;
    }
  };

  const switchUser = async (userId) => {
    const found = mockUsers.find((u) => u.id === userId);
    if (found) {
      await loginAs(found.role);
    }
  };

  // Join Queue with backend API
  const joinQueue = async (serviceId, customNotes = '', customerInfo = {}) => {
    try {
      const res = await queuesAPI.join(serviceId, {
        notes: customNotes,
        customerName: customerInfo.name || currentUser?.name || 'Customer',
        customerPhone: customerInfo.phone || currentUser?.phone || '',
      });

      if (res.success && res.data) {
        setUserQueue(res.data);
        await fetchQueues();
        addToast(`Successfully joined the queue! Token: ${res.data.tokenNumber}`, 'success');
        return res.data;
      }
    } catch (err) {
      // If duplicate token exists in DB, fetch the active one
      if (err.status === 409) {
        addToast(err.message, 'warning');
        await fetchMyActiveQueue();
        return userQueue;
      }
      addToast(err.message || 'Failed to join queue', 'error');
      return null;
    }
  };

  // Leave Queue with backend API
  const leaveQueue = async () => {
    if (!userQueue) return;

    try {
      const res = await queuesAPI.leave(userQueue.serviceId, {
        entryId: userQueue.id || userQueue._id,
        tokenNumber: userQueue.tokenNumber,
      });

      if (res.success) {
        setUserQueue(null);
        await fetchMyHistory();
        await fetchQueues();
        addToast('You have left the queue.', 'info');
      }
    } catch (err) {
      addToast(err.message || 'Failed to leave queue', 'error');
    }
  };

  // Staff: Call next token
  const callNext = async (serviceId) => {
    try {
      const res = await queuesAPI.callNext(serviceId);
      if (res.success) {
        await fetchQueues();
        await fetchMyActiveQueue();
        addToast(res.message || 'Called next token', 'info');
      }
    } catch (err) {
      addToast(err.message || 'Failed to call next token', 'error');
    }
  };

  // Staff: Complete current token
  const completeCurrent = async (serviceId) => {
    try {
      const res = await queuesAPI.complete(serviceId);
      if (res.success) {
        await fetchQueues();
        await fetchMyActiveQueue();
        await fetchMyHistory();
        addToast('Token marked as completed.', 'success');
      }
    } catch (err) {
      addToast(err.message || 'Failed to complete token', 'error');
    }
  };

  // Staff: Skip current token
  const skipCurrent = async (serviceId) => {
    try {
      const res = await queuesAPI.skip(serviceId);
      if (res.success) {
        await fetchQueues();
        await fetchMyActiveQueue();
        addToast('Token was skipped.', 'warning');
      }
    } catch (err) {
      addToast(err.message || 'Failed to skip token', 'error');
    }
  };

  // Staff: Toggle Pause / Resume
  const togglePauseQueue = async (serviceId) => {
    try {
      const res = await queuesAPI.togglePause(serviceId);
      if (res.success) {
        await fetchQueues();
        addToast(res.message, res.data.status === 'Paused' ? 'warning' : 'success');
      }
    } catch (err) {
      addToast(err.message || 'Failed to toggle queue status', 'error');
    }
  };

  // Update profile with real API
  const updateProfile = async (updatedFields) => {
    try {
      const res = await authAPI.updateProfile(updatedFields);
      if (res.success && res.user) {
        setCurrentUser(res.user);
        addToast('Profile updated successfully!', 'success');
      }
    } catch (err) {
      addToast(err.message || 'Failed to update profile', 'error');
    }
  };

  // Logout
  const logout = () => {
    localStorage.removeItem('queueless_token');
    setCurrentUser(null);
    setUserQueue(null);
    setQueueHistory([]);
    addToast('Logged out successfully.', 'info');
  };

  // Reset Demo to fresh state in MongoDB
  const resetDemo = async () => {
    try {
      const res = await adminAPI.resetDemo();
      if (res.success) {
        localStorage.removeItem('queueless_token');
        await loginAs('customer');
        await fetchQueues();
        await fetchMyActiveQueue();
        await fetchMyHistory();
        addToast('Demo database reset to clean default state in MongoDB.', 'info');
      }
    } catch (err) {
      addToast(err.message || 'Failed to reset demo database', 'error');
    }
  };

  return (
    <QueueContext.Provider
      value={{
        services,
        userQueue,
        queueHistory,
        currentUser,
        isLoading,
        toasts,
        addToast,
        removeToast,
        login,
        register,
        loginAs,
        switchUser,
        joinQueue,
        leaveQueue,
        callNext,
        completeCurrent,
        skipCurrent,
        togglePauseQueue,
        updateProfile,
        logout,
        resetDemo,
        fetchQueues,
        fetchMyActiveQueue,
        fetchMyHistory,
      }}
    >
      {children}
    </QueueContext.Provider>
  );
};

export const useQueue = () => {
  const context = useContext(QueueContext);
  if (!context) {
    throw new Error('useQueue must be used within a QueueProvider');
  }
  return context;
};
