import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { apiService } from '../services/api';
import type { ShiftResponse, WeeklyHoursResponse } from '../services/api';
import { FiClock, FiLogOut, FiCalendar, FiRefreshCw, FiX } from 'react-icons/fi';
import { format } from 'date-fns';

export const EmployeeDashboard = () => {
  const { user, logout } = useAuth();
  const [activeShift, setActiveShift] = useState<ShiftResponse | null>(null);
  const [weeklyHours, setWeeklyHours] = useState<WeeklyHoursResponse | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const loadData = async () => {
    setIsLoading(true);
    setError('');
    try {
      const [shift, hours] = await Promise.all([
        apiService.getActiveShift(),
        apiService.getWeeklyHours(),
      ]);
      setActiveShift(shift);
      setWeeklyHours(hours);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load data');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleClockIn = async () => {
    setIsLoading(true);
    setError('');
    try {
      const shift = await apiService.clockIn();
      setActiveShift(shift);
      await loadData();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to clock in');
    } finally {
      setIsLoading(false);
    }
  };

  const handleClockOut = async () => {
    setIsLoading(true);
    setError('');
    try {
      await apiService.clockOut();
      setActiveShift(null);
      await loadData();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to clock out');
    } finally {
      setIsLoading(false);
    }
  };

  const formatTime = (dateString: string) => {
    return format(new Date(dateString), 'MMM dd, yyyy h:mm a');
  };

  const formatDuration = (hours: number | null) => {
    if (hours === null) return 'N/A';
    const h = Math.floor(hours);
    const m = Math.round((hours - h) * 60);
    return `${h}h ${m}m`;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Welcome, {user?.name}</h1>
            <p className="text-sm text-gray-600">Employee Dashboard</p>
          </div>
          <button
            onClick={logout}
            className="flex items-center gap-2 px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <FiLogOut className="w-5 h-5" />
            Logout
          </button>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg flex justify-between items-start">
            <div className="pr-4">{error}</div>
            <button
              onClick={() => setError('')}
              aria-label="Close error"
              className="text-red-700 hover:text-red-900 ml-4"
            >
              <FiX className="w-5 h-5" />
            </button>
          </div>
        )}

        {/* Clock In/Out Card */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
              <FiClock className="w-6 h-6 text-primary-600" />
              Current Shift
            </h2>
            <button
              onClick={loadData}
              disabled={isLoading}
              className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors disabled:opacity-50"
            >
              <FiRefreshCw className={`w-5 h-5 ${isLoading ? 'animate-spin' : ''}`} />
            </button>
          </div>

          {activeShift ? (
            <div className="space-y-4">
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                  <span className="font-medium text-green-800">Currently Clocked In</span>
                </div>
                <p className="text-sm text-green-700">
                  Clocked in: {formatTime(activeShift.clockIn)}
                </p>
              </div>
              <button
                onClick={handleClockOut}
                disabled={isLoading}
                className="w-full bg-red-600 text-white py-3 rounded-lg font-medium hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 disabled:opacity-50 transition-colors"
              >
                Clock Out
              </button>
            </div>
          ) : (
            <div className="text-center">
              <p className="text-gray-600 mb-4">No active shift</p>
              <button
                onClick={handleClockIn}
                disabled={isLoading}
                className="w-full bg-primary-600 text-white py-3 rounded-lg font-medium hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 disabled:opacity-50 transition-colors"
              >
                Clock In
              </button>
            </div>
          )}
        </div>

        {/* Weekly Hours Card */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
          <h2 className="text-xl font-semibold text-gray-900 flex items-center gap-2 mb-6">
            <FiCalendar className="w-6 h-6 text-primary-600" />
            Weekly Hours
          </h2>
          {weeklyHours ? (
            <div>
              <div className="bg-primary-50 rounded-lg p-6 mb-6">
                <div className="text-3xl font-bold text-primary-700">
                  {formatDuration(weeklyHours.totalWeeklyHours)}
                </div>
                <div className="text-sm text-primary-600 mt-1">Total Hours This Week</div>
              </div>

              {weeklyHours.shifts.length > 0 ? (
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Shift History</h3>
                  <div className="space-y-3">
                    {weeklyHours.shifts.map((shift) => (
                      <div
                        key={shift.id}
                        className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors"
                      >
                        <div className="flex justify-between items-start">
                          <div>
                            <p className="font-medium text-gray-900">
                              {formatTime(shift.clockIn)}
                            </p>
                            {shift.clockOut && (
                              <p className="text-sm text-gray-600">
                                Out: {formatTime(shift.clockOut)}
                              </p>
                            )}
                          </div>
                          <div className="text-right">
                            <p className="font-medium text-gray-900">
                              {formatDuration(shift.totalHours)}
                            </p>
                            {!shift.clockOut && (
                              <span className="text-xs text-green-600">Active</span>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <p className="text-gray-600 text-center py-4">No shifts this week</p>
              )}
            </div>
          ) : (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600 mx-auto"></div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
