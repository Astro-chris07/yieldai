import React, { useState } from 'react';
import { ArrowLeft, Loader2 } from 'lucide-react';
import axios from 'axios';

const AREAS = ["Albania", "Algeria", "Angola", "Argentina", "Armenia", "Australia", "Austria", "Azerbaijan", "Bahamas", "Bahrain", "Bangladesh", "Belarus", "Belgium", "Botswana", "Brazil", "Bulgaria", "Burkina Faso", "Burundi", "Cameroon", "Canada", "Central African Republic", "Chile", "Colombia", "Croatia", "Denmark", "Dominican Republic", "Ecuador", "Egypt", "El Salvador", "Eritrea", "Estonia", "Finland", "France", "Germany", "Ghana", "Greece", "Guatemala", "Guinea", "Guyana", "Haiti", "Honduras", "Hungary", "India", "Indonesia", "Iraq", "Ireland", "Italy", "Jamaica", "Japan", "Kazakhstan", "Kenya", "Latvia", "Lebanon", "Lesotho", "Libya", "Lithuania", "Madagascar", "Malawi", "Malaysia", "Mali", "Mauritania", "Mauritius", "Mexico", "Montenegro", "Morocco", "Mozambique", "Namibia", "Nepal", "Netherlands", "New Zealand", "Nicaragua", "Niger", "Norway", "Pakistan", "Papua New Guinea", "Peru", "Poland", "Portugal", "Qatar", "Romania", "Rwanda", "Saudi Arabia", "Senegal", "Slovenia", "South Africa", "Spain", "Sri Lanka", "Sudan", "Suriname", "Sweden", "Switzerland", "Tajikistan", "Thailand", "Tunisia", "Turkey", "Uganda", "Ukraine", "United Kingdom", "Uruguay", "Zambia", "Zimbabwe"];
const CROPS = ["Cassava", "Maize", "Plantains and others", "Potatoes", "Rice, paddy", "Sorghum", "Soybeans", "Sweet potatoes", "Wheat", "Yams"];

export default function InputForm({ onSuccess, onBack }) {
  const [formData, setFormData] = useState({
    Area: 'India',
    Crop: 'Wheat',
    Year: 2024,
    Rainfall: 1000,
    Temperature: 25.5,
    Pesticide_usage: 15.0
  });
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      const payload = {
        ...formData,
        Year: parseInt(formData.Year),
        Rainfall: parseFloat(formData.Rainfall),
        Temperature: parseFloat(formData.Temperature),
        Pesticide_usage: parseFloat(formData.Pesticide_usage),
      };
      
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:8000';
      const response = await axios.post(`${apiUrl}/api/predict`, payload);
      onSuccess(response.data);
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to connect to AI Engine.');
      setLoading(false);
    }
  };

  const InputField = ({ label, name, type="number", step, min, max, placeholder }) => (
    <div className="flex flex-col gap-1.5 mb-5">
      <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
        {label}
      </label>
      <input 
        type={type}
        name={name}
        value={formData[name]}
        onChange={handleChange}
        step={step} min={min} max={max}
        placeholder={placeholder}
        required
        className="saas-input"
      />
    </div>
  );

  return (
    <div className="flex-1 flex items-center justify-center p-4 py-12 bg-gray-50 dark:bg-[#0a0a0a]">
      <div className="w-full max-w-lg">
        
        <button 
          onClick={onBack}
          className="mb-6 flex items-center gap-1.5 text-sm font-medium text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white transition-colors"
          disabled={loading}
        >
          <ArrowLeft size={16} />
          Back
        </button>

        <div className="saas-card p-6 sm:p-8">
          <div className="mb-8">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">Configure Prediction</h2>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Enter your field parameters to calculate potential yield.</p>
          </div>

          {error && (
            <div className="mb-6 p-4 rounded-lg bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 border border-red-100 dark:border-red-900/50 text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="flex flex-col">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6">
              
              <div className="flex flex-col gap-1.5 mb-5">
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Region</label>
                <select 
                  name="Area" 
                  value={formData.Area} 
                  onChange={handleChange}
                  className="saas-input block"
                >
                  {AREAS.map(a => <option key={a} value={a}>{a}</option>)}
                </select>
              </div>

              <div className="flex flex-col gap-1.5 mb-5">
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Crop Type</label>
                <select 
                  name="Crop" 
                  value={formData.Crop} 
                  onChange={handleChange}
                  className="saas-input block"
                >
                  {CROPS.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>

              <InputField label="Target Year" name="Year" type="number" step="1" min="1990" max="2100" />
              <InputField label="Rainfall (mm)" name="Rainfall" step="0.1" min="0" />
              <InputField label="Temperature (°C)" name="Temperature" step="0.1" />
              <InputField label="Pesticide Usage (tonnes)" name="Pesticide_usage" step="0.1" min="0" />
            </div>

            <div className="mt-4 pt-6 border-t border-gray-100 dark:border-[#262626]">
              <button 
                type="submit"
                disabled={loading}
                className="w-full saas-button-primary py-2.5 text-[15px] disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <>
                    <Loader2 className="animate-spin" size={18} />
                    Processing Prediction...
                  </>
                ) : (
                  "Calculate Yield"
                )}
              </button>
            </div>
          </form>
        </div>
        
      </div>
    </div>
  );
}
