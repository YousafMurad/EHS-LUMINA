"use client";

import { useState } from "react";
import { Save, DollarSign, Calendar, Percent, AlertTriangle, Loader2 } from "lucide-react";

export function FeeSettingsForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [saved, setSaved] = useState(false);

  const [settings, setSettings] = useState({
    // Late Fee Settings
    enableLateFee: true,
    lateFeeType: "fixed", // fixed or percentage
    lateFeeAmount: 500,
    lateFeePercentage: 5,
    gracePeriodDays: 10,
    maxLateFee: 2000,
    
    // Due Date Settings
    defaultDueDay: 10,
    
    // Discount Settings
    enableSiblingDiscount: true,
    siblingDiscountPercent: 10,
    enableEarlyPaymentDiscount: false,
    earlyPaymentDiscountPercent: 5,
    earlyPaymentDays: 5,
    
    // Receipt Settings
    receiptPrefix: "EHS",
    showPreviousDues: true,
    
    // Notifications
    sendDueReminder: true,
    reminderDaysBefore: 3,
    sendOverdueNotice: true,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;
    
    setSettings((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : type === "number" ? Number(value) : value,
    }));
    setSaved(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    await new Promise((resolve) => setTimeout(resolve, 1000));
    
    setIsSubmitting(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <form onSubmit={handleSubmit}>
      {saved && (
        <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg text-green-700 text-sm">
          Fee settings saved successfully!
        </div>
      )}

      {/* Late Fee Configuration */}
      <div className="bg-white rounded-xl border border-gray-200 p-6 mb-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
            <AlertTriangle size={20} className="text-red-600" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Late Fee Configuration</h3>
            <p className="text-sm text-gray-500">Configure penalties for late payments</p>
          </div>
        </div>

        <div className="space-y-4">
          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              name="enableLateFee"
              checked={settings.enableLateFee}
              onChange={handleChange}
              className="w-5 h-5 rounded border-gray-300 text-yellow-500 focus:ring-yellow-400"
            />
            <span className="font-medium text-gray-900">Enable Late Fee</span>
          </label>

          {settings.enableLateFee && (
            <div className="ml-8 space-y-4 border-l-2 border-gray-200 pl-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Late Fee Type</label>
                  <select
                    name="lateFeeType"
                    value={settings.lateFeeType}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400"
                  >
                    <option value="fixed">Fixed Amount</option>
                    <option value="percentage">Percentage</option>
                  </select>
                </div>
                
                {settings.lateFeeType === "fixed" ? (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Late Fee Amount (Rs.)</label>
                    <input
                      type="number"
                      name="lateFeeAmount"
                      value={settings.lateFeeAmount}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400"
                    />
                  </div>
                ) : (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Late Fee Percentage (%)</label>
                    <input
                      type="number"
                      name="lateFeePercentage"
                      value={settings.lateFeePercentage}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400"
                    />
                  </div>
                )}
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Grace Period (Days)</label>
                  <input
                    type="number"
                    name="gracePeriodDays"
                    value={settings.gracePeriodDays}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400"
                  />
                </div>
              </div>
              
              <div className="max-w-xs">
                <label className="block text-sm font-medium text-gray-700 mb-1">Maximum Late Fee (Rs.)</label>
                <input
                  type="number"
                  name="maxLateFee"
                  value={settings.maxLateFee}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400"
                />
                <p className="text-xs text-gray-500 mt-1">Cap on maximum late fee that can be charged</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Due Date Settings */}
      <div className="bg-white rounded-xl border border-gray-200 p-6 mb-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
            <Calendar size={20} className="text-blue-600" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Due Date Settings</h3>
            <p className="text-sm text-gray-500">Configure default fee due dates</p>
          </div>
        </div>

        <div className="max-w-xs">
          <label className="block text-sm font-medium text-gray-700 mb-1">Default Due Day of Month</label>
          <input
            type="number"
            name="defaultDueDay"
            value={settings.defaultDueDay}
            onChange={handleChange}
            min={1}
            max={28}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400"
          />
          <p className="text-xs text-gray-500 mt-1">Fees will be due on this day each month</p>
        </div>
      </div>

      {/* Discount Settings */}
      <div className="bg-white rounded-xl border border-gray-200 p-6 mb-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
            <Percent size={20} className="text-green-600" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Discount Settings</h3>
            <p className="text-sm text-gray-500">Configure automatic discounts</p>
          </div>
        </div>

        <div className="space-y-6">
          {/* Sibling Discount */}
          <div>
            <label className="flex items-center gap-3 cursor-pointer mb-3">
              <input
                type="checkbox"
                name="enableSiblingDiscount"
                checked={settings.enableSiblingDiscount}
                onChange={handleChange}
                className="w-5 h-5 rounded border-gray-300 text-yellow-500 focus:ring-yellow-400"
              />
              <span className="font-medium text-gray-900">Enable Sibling Discount</span>
            </label>
            
            {settings.enableSiblingDiscount && (
              <div className="ml-8 max-w-xs">
                <label className="block text-sm font-medium text-gray-700 mb-1">Discount Percentage (%)</label>
                <input
                  type="number"
                  name="siblingDiscountPercent"
                  value={settings.siblingDiscountPercent}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400"
                />
                <p className="text-xs text-gray-500 mt-1">Applied to 2nd and subsequent siblings</p>
              </div>
            )}
          </div>

          {/* Early Payment Discount */}
          <div>
            <label className="flex items-center gap-3 cursor-pointer mb-3">
              <input
                type="checkbox"
                name="enableEarlyPaymentDiscount"
                checked={settings.enableEarlyPaymentDiscount}
                onChange={handleChange}
                className="w-5 h-5 rounded border-gray-300 text-yellow-500 focus:ring-yellow-400"
              />
              <span className="font-medium text-gray-900">Enable Early Payment Discount</span>
            </label>
            
            {settings.enableEarlyPaymentDiscount && (
              <div className="ml-8 grid grid-cols-1 md:grid-cols-2 gap-4 max-w-lg">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Discount Percentage (%)</label>
                  <input
                    type="number"
                    name="earlyPaymentDiscountPercent"
                    value={settings.earlyPaymentDiscountPercent}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Days Before Due Date</label>
                  <input
                    type="number"
                    name="earlyPaymentDays"
                    value={settings.earlyPaymentDays}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400"
                  />
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Receipt Settings */}
      <div className="bg-white rounded-xl border border-gray-200 p-6 mb-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
            <DollarSign size={20} className="text-purple-600" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Receipt Settings</h3>
            <p className="text-sm text-gray-500">Configure fee receipt generation</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Receipt Number Prefix</label>
            <input
              type="text"
              name="receiptPrefix"
              value={settings.receiptPrefix}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400"
            />
            <p className="text-xs text-gray-500 mt-1">e.g., EHS-2026-00001</p>
          </div>
          <div className="flex items-center">
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                name="showPreviousDues"
                checked={settings.showPreviousDues}
                onChange={handleChange}
                className="w-5 h-5 rounded border-gray-300 text-yellow-500 focus:ring-yellow-400"
              />
              <span className="font-medium text-gray-900">Show Previous Dues on Receipt</span>
            </label>
          </div>
        </div>
      </div>

      {/* Notification Settings */}
      <div className="bg-white rounded-xl border border-gray-200 p-6 mb-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Notifications</h3>
        
        <div className="space-y-4">
          <div className="flex items-center justify-between py-2 border-b border-gray-100">
            <div>
              <p className="font-medium text-gray-900">Due Date Reminder</p>
              <p className="text-sm text-gray-500">Send reminder before fee is due</p>
            </div>
            <div className="flex items-center gap-4">
              <input
                type="number"
                name="reminderDaysBefore"
                value={settings.reminderDaysBefore}
                onChange={handleChange}
                className="w-20 px-3 py-1 border border-gray-300 rounded-lg text-sm"
                disabled={!settings.sendDueReminder}
              />
              <span className="text-sm text-gray-500">days before</span>
              <input
                type="checkbox"
                name="sendDueReminder"
                checked={settings.sendDueReminder}
                onChange={handleChange}
                className="w-5 h-5 rounded border-gray-300 text-yellow-500 focus:ring-yellow-400"
              />
            </div>
          </div>
          
          <div className="flex items-center justify-between py-2">
            <div>
              <p className="font-medium text-gray-900">Overdue Notice</p>
              <p className="text-sm text-gray-500">Send notice when fee becomes overdue</p>
            </div>
            <input
              type="checkbox"
              name="sendOverdueNotice"
              checked={settings.sendOverdueNotice}
              onChange={handleChange}
              className="w-5 h-5 rounded border-gray-300 text-yellow-500 focus:ring-yellow-400"
            />
          </div>
        </div>
      </div>

      {/* Submit Button */}
      <div className="flex items-center gap-4">
        <button
          type="submit"
          disabled={isSubmitting}
          className="px-6 py-2.5 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition-colors font-medium disabled:opacity-50 flex items-center gap-2"
        >
          {isSubmitting ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />}
          {isSubmitting ? "Saving..." : "Save Settings"}
        </button>
      </div>
    </form>
  );
}
