import React, { createContext, useContext, useState, useEffect } from 'react';
import { initialServices } from '../data/services';
import { initialUserQueue, initialQueueHistory, generateUpcomingTokens } from '../data/queues';
import { mockUsers } from '../data/users';

const QueueContext = createContext();

export const QueueProvider = ({ children }) => {
  // Load initial data from localStorage if available, or fall back to defaults
  const [services, setServices] = useState(() => {
    const saved = localStorage.getItem('queueless_services');
    return saved ? JSON.parse(saved) : initialServices;
  });

  const [userQueue, setUserQueue] = useState(() => {
    const saved = localStorage.getItem('queueless_user_queue');
    if (saved === 'null') return null;
    return saved ? JSON.parse(saved) : initialUserQueue;
  });

  const [queueHistory, setQueueHistory] = useState(() => {
    const saved = localStorage.getItem('queueless_history');
    return saved ? JSON.parse(saved) : initialQueueHistory;
  });

  const [currentUser, setCurrentUser] = useState(() => {
    const saved = localStorage.getItem('queueless_user');
    return saved ? JSON.parse(saved) : mockUsers[0];
  });

  const [toasts, setToasts] = useState([]);

  // Sync to localStorage
  useEffect(() => {
    localStorage.setItem('queueless_services', JSON.stringify(services));
  }, [services]);

  useEffect(() => {
    localStorage.setItem('queueless_user_queue', JSON.stringify(userQueue));
  }, [userQueue]);

  useEffect(() => {
    localStorage.setItem('queueless_history', JSON.stringify(queueHistory));
  }, [queueHistory]);

  useEffect(() => {
    localStorage.setItem('queueless_user', JSON.stringify(currentUser));
  }, [currentUser]);

  // Toast notifications helper
  const addToast = (message, type = 'info', duration = 3500) => {
    const id = Date.now() + Math.random().toString(36).substring(2, 7);
    setToasts((prev) => [...prev, { id, message, type }]);

    if (duration > 0) {
      setTimeout(() => {
        removeToast(id);
      }, duration);
    }
  };

  const removeToast = (id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  // Join a queue for a specific service
  const joinQueue = (serviceId, customNotes = '') => {
    const service = services.find((s) => s.id === serviceId);
    if (!service) {
      addToast('Service not found', 'error');
      return null;
    }

    if (service.status === 'Paused') {
      addToast('This queue is temporarily paused. Please check back shortly.', 'warning');
      return null;
    }

    // Generate token number
    const nextNumber = service.currentNumber + service.peopleWaiting + 1;
    const tokenNumber = `${service.codePrefix}${nextNumber < 10 ? '0' + nextNumber : nextNumber}`;
    const peopleAhead = service.peopleWaiting;
    const estimatedWait = peopleAhead * service.avgWaitPerPerson;

    const newQueue = {
      id: `token-${Date.now()}`,
      tokenNumber,
      tokenIndex: nextNumber,
      serviceId: service.id,
      serviceName: service.name,
      department: service.department,
      category: service.category,
      location: service.location,
      counterNumber: service.counterNumber,
      status: 'Waiting',
      issuedAt: 'Just now',
      peopleAhead,
      estimatedWait,
      currentServing: service.currentServing,
      notes: customNotes || `Online token for ${service.department}`,
    };

    // Update service waiting count
    setServices((prev) =>
      prev.map((s) =>
        s.id === serviceId
          ? {
              ...s,
              peopleWaiting: s.peopleWaiting + 1,
              estimatedWait: (s.peopleWaiting + 1) * s.avgWaitPerPerson,
            }
          : s
      )
    );

    setUserQueue(newQueue);
    addToast(`Successfully joined the queue! Token: ${tokenNumber}`, 'success');
    return newQueue;
  };

  // Leave active queue
  const leaveQueue = () => {
    if (!userQueue) return;

    // Add to history as Cancelled
    const historyItem = {
      id: `hist-${Date.now()}`,
      tokenNumber: userQueue.tokenNumber,
      serviceName: userQueue.serviceName,
      department: userQueue.department,
      category: userQueue.category,
      status: 'Cancelled',
      date: 'Today, Just now',
      counter: userQueue.counterNumber,
      waitTime: 'Cancelled by user',
    };

    setQueueHistory((prev) => [historyItem, ...prev]);

    // Decrement people waiting for the service
    setServices((prev) =>
      prev.map((s) =>
        s.id === userQueue.serviceId
          ? {
              ...s,
              peopleWaiting: Math.max(0, s.peopleWaiting - 1),
              estimatedWait: Math.max(0, s.peopleWaiting - 1) * s.avgWaitPerPerson,
            }
          : s
      )
    );

    setUserQueue(null);
    addToast('You have left the queue.', 'info');
  };

  // Staff action: Call next token
  const callNext = (serviceId) => {
    const service = services.find((s) => s.id === serviceId);
    if (!service) return;

    const nextNum = service.currentNumber + 1;
    const nextTokenStr = `${service.codePrefix}${nextNum < 10 ? '0' + nextNum : nextNum}`;
    const newWaiting = Math.max(0, service.peopleWaiting - 1);

    // Update service
    setServices((prev) =>
      prev.map((s) =>
        s.id === serviceId
          ? {
              ...s,
              currentNumber: nextNum,
              currentServing: nextTokenStr,
              peopleWaiting: newWaiting,
              estimatedWait: newWaiting * s.avgWaitPerPerson,
            }
          : s
      )
    );

    // Update user queue if user belongs to this service
    if (userQueue && userQueue.serviceId === serviceId) {
      if (userQueue.tokenIndex === nextNum) {
        // User's turn now!
        setUserQueue((prev) => ({
          ...prev,
          currentServing: nextTokenStr,
          status: 'Now Serving',
          peopleAhead: 0,
          estimatedWait: 0,
        }));
        addToast(`🎉 Ding! Your turn has arrived! Please proceed to ${service.counterNumber}.`, 'success', 8000);
      } else if (userQueue.tokenIndex > nextNum) {
        // Still waiting, position advanced
        const newAhead = Math.max(0, userQueue.tokenIndex - nextNum);
        setUserQueue((prev) => ({
          ...prev,
          currentServing: nextTokenStr,
          peopleAhead: newAhead,
          estimatedWait: newAhead * service.avgWaitPerPerson,
        }));
        addToast(`Queue advanced. Now serving: ${nextTokenStr}.`, 'info');
      } else if (userQueue.tokenIndex < nextNum && userQueue.status !== 'Completed') {
        // Already served/passed
        setUserQueue((prev) => ({
          ...prev,
          currentServing: nextTokenStr,
          status: 'Completed',
          peopleAhead: 0,
          estimatedWait: 0,
        }));

        // Archive to history
        setQueueHistory((prev) => [
          {
            id: `hist-${Date.now()}`,
            tokenNumber: userQueue.tokenNumber,
            serviceName: userQueue.serviceName,
            department: userQueue.department,
            category: userQueue.category,
            status: 'Completed',
            date: 'Today, Just now',
            counter: userQueue.counterNumber,
            waitTime: `${service.avgWaitPerPerson * 6} min`,
          },
          ...prev,
        ]);
        addToast(`Token ${userQueue.tokenNumber} marked as completed.`, 'success');
      }
    } else {
      addToast(`Now serving: ${nextTokenStr}`, 'info');
    }
  };

  // Staff action: Complete current token
  const completeCurrent = (serviceId) => {
    const service = services.find((s) => s.id === serviceId);
    if (!service) return;

    if (userQueue && userQueue.serviceId === serviceId && userQueue.currentServing === userQueue.tokenNumber) {
      // User was being served, mark complete and archive
      setUserQueue((prev) => ({
        ...prev,
        status: 'Completed',
      }));

      setQueueHistory((prev) => [
        {
          id: `hist-${Date.now()}`,
          tokenNumber: userQueue.tokenNumber,
          serviceName: userQueue.serviceName,
          department: userQueue.department,
          category: userQueue.category,
          status: 'Completed',
          date: 'Today, Just now',
          counter: userQueue.counterNumber,
          waitTime: 'Completed',
        },
        ...prev,
      ]);
    }

    addToast(`Token ${service.currentServing} completed.`, 'success');
    // Call next
    callNext(serviceId);
  };

  // Staff action: Skip current token
  const skipCurrent = (serviceId) => {
    const service = services.find((s) => s.id === serviceId);
    if (!service) return;

    addToast(`Token ${service.currentServing} was skipped.`, 'warning');
    callNext(serviceId);
  };

  // Staff action: Toggle pause/resume queue
  const togglePauseQueue = (serviceId) => {
    setServices((prev) =>
      prev.map((s) => {
        if (s.id === serviceId) {
          const nextStatus = s.status === 'Active' ? 'Paused' : 'Active';
          addToast(
            `${s.name} queue is now ${nextStatus === 'Paused' ? 'paused' : 'resumed and active'}.`,
            nextStatus === 'Paused' ? 'warning' : 'success'
          );
          return { ...s, status: nextStatus };
        }
        return s;
      })
    );
  };

  // User auth mock switchers
  const switchUser = (userId) => {
    const found = mockUsers.find((u) => u.id === userId);
    if (found) {
      setCurrentUser(found);
      addToast(`Switched user to ${found.name} (${found.role.toUpperCase()})`, 'info');
    }
  };

  const updateProfile = (updatedFields) => {
    setCurrentUser((prev) => ({
      ...prev,
      ...updatedFields,
    }));
    addToast('Profile updated successfully!', 'success');
  };

  const logout = () => {
    setCurrentUser(null);
    addToast('Logged out successfully.', 'info');
  };

  const loginAs = (role) => {
    const user = mockUsers.find((u) => u.role === role) || mockUsers[0];
    setCurrentUser(user);
    addToast(`Welcome back, ${user.name}!`, 'success');
  };

  // Reset demo back to clean initial state
  const resetDemo = () => {
    localStorage.removeItem('queueless_services');
    localStorage.removeItem('queueless_user_queue');
    localStorage.removeItem('queueless_history');
    localStorage.removeItem('queueless_user');
    setServices(initialServices);
    setUserQueue(initialUserQueue);
    setQueueHistory(initialQueueHistory);
    setCurrentUser(mockUsers[0]);
    addToast('Demo state reset to default mock data.', 'info');
  };

  return (
    <QueueContext.Provider
      value={{
        services,
        userQueue,
        queueHistory,
        currentUser,
        toasts,
        addToast,
        removeToast,
        joinQueue,
        leaveQueue,
        callNext,
        completeCurrent,
        skipCurrent,
        togglePauseQueue,
        switchUser,
        updateProfile,
        logout,
        loginAs,
        resetDemo,
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
