import React, { useState } from 'react';
import { Database, CheckCircle, XCircle, RefreshCw } from 'lucide-react';
import { testSupabaseConnection } from '../lib/testSupabaseConnection';

const SupabaseTestButton: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<any>(null);

  const handleTest = async () => {
    setIsLoading(true);
    setResult(null);
    
    try {
      const testResult = await testSupabaseConnection();
      setResult(testResult);
    } catch (error) {
      setResult({
        success: false,
        error: 'Test failed: ' + (error as Error).message
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200">
      <div className="flex items-center space-x-3 mb-4">
        <Database className="h-6 w-6 text-nexar-accent" />
        <h3 className="text-lg font-semibold text-gray-900">Test Conexiune Supabase</h3>
      </div>
      
      <p className="text-gray-600 mb-4">
        Testează dacă fix-ul pentru recursiunea infinită a funcționat și toate tabelele sunt accesibile.
      </p>
      
      <button
        onClick={handleTest}
        disabled={isLoading}
        className="w-full bg-nexar-accent text-white py-3 px-4 rounded-lg font-semibold hover:bg-nexar-gold transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
      >
        {isLoading ? (
          <>
            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            <span>Se testează...</span>
          </>
        ) : (
          <>
            <RefreshCw className="h-5 w-5" />
            <span>Testează Conexiunea</span>
          </>
        )}
      </button>
      
      {result && (
        <div className={`mt-4 p-4 rounded-lg ${
          result.success ? 'bg-green-100 border border-green-200' : 'bg-red-100 border border-red-200'
        }`}>
          <div className="flex items-center space-x-2 mb-2">
            {result.success ? (
              <CheckCircle className="h-5 w-5 text-green-600" />
            ) : (
              <XCircle className="h-5 w-5 text-red-600" />
            )}
            <span className={`font-semibold ${
              result.success ? 'text-green-800' : 'text-red-800'
            }`}>
              {result.success ? 'Test Reușit!' : 'Test Eșuat'}
            </span>
          </div>
          
          <p className={`text-sm ${
            result.success ? 'text-green-700' : 'text-red-700'
          }`}>
            {result.message || result.error}
          </p>
          
          {result.details && (
            <div className="mt-3 space-y-1">
              <p className="text-xs font-semibold text-green-800">Detalii:</p>
              {Object.entries(result.details).map(([key, value]) => (
                <div key={key} className="flex justify-between text-xs text-green-700">
                  <span className="capitalize">{key}:</span>
                  <span className="font-semibold">{value as string}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default SupabaseTestButton;