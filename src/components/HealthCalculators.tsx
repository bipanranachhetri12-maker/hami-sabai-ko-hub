import React, { useState } from 'react';
import { Calculator, Droplet } from 'lucide-react';
import { useHub } from '../context/HubContext';
import { toNepaliDigits } from '../utils/bsDate';

export const HealthCalculators: React.FC = () => {
  const { language } = useHub();
  const [weightKg, setWeightKg] = useState(64);
  const [heightCm, setHeightCm] = useState(168);
  const [age, setAge] = useState(28);
  const [activity, setActivity] = useState<'sedentary' | 'moderate' | 'active'>('moderate');

  const heightM = Math.max(heightCm / 100, 0.5);
  const bmi = weightKg / (heightM * heightM);

  // South Asian BMI risk thresholds (WHO Asia-Pacific consensus)
  const getBmiBand = (val: number) => {
    if (val < 18.5) {
      return {
        label: language === 'ne' ? 'कम तौल (Underweight)' : 'Underweight',
        color: 'text-amber-700 dark:text-amber-400',
        note:
          language === 'ne'
            ? 'प्रोटिनयुक्त दाल-भात, अण्डा, दुध र सन्तुलित आहार बढाउनुहोस्।'
            : 'Focus on nutrient-dense Nepali staples, lentils, dairy, and strength meals.',
      };
    }
    if (val < 23.0) {
      return {
        label: language === 'ne' ? 'स्वस्थ तौल (Normal - South Asian)' : 'Healthy Weight (South Asian Optimal)',
        color: 'text-emerald-700 dark:text-emerald-400',
        note:
          language === 'ne'
            ? 'दक्षिण एसियाली मापदण्डअनुसार तपाईंको तौल सन्तुलित छ।'
            : 'Optimal range for South Asian adults (18.5–22.9 kg/m²). Keep up regular walking.',
      };
    }
    if (val < 25.0) {
      return {
        label: language === 'ne' ? 'बढी तौल जोखिम (Overweight)' : 'Overweight (Asia-Pacific Band)',
        color: 'text-orange-700 dark:text-orange-400',
        note:
          language === 'ne'
            ? 'तारेको खाजा र चिनी घटाई दैनिक ३० मिनेट छिटो हिँड्नुहोस्।'
            : 'Trim refined sugar and fried snacks; aim for 30+ minutes brisk walking daily.',
      };
    }
    return {
      label: language === 'ne' ? 'मोटोपन (Obesity Range)' : 'Obesity Range (Consult Physician)',
      color: 'text-red-700 dark:text-red-400',
      note:
        language === 'ne'
          ? 'रक्तचाप र सुगर जाँचका लागि नजिकको स्वास्थ्य केन्द्रमा परामर्श लिनुहोस्।'
          : 'Consider baseline blood pressure and HbA1c screening with your physician.',
    };
  };

  const band = getBmiBand(bmi);
  const dailyWaterLiters = (weightKg * 0.033 + (activity === 'active' ? 0.6 : activity === 'moderate' ? 0.3 : 0)).toFixed(1);
  const bmr = 10 * weightKg + 6.25 * heightCm - 5 * age + 5;
  const activityMult = activity === 'active' ? 1.6 : activity === 'moderate' ? 1.45 : 1.2;
  const dailyCalories = Math.round(bmr * activityMult);

  const fmt = (v: string | number) => (language === 'ne' ? toNepaliDigits(v) : String(v));

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* BMI Calculator */}
      <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6">
        <div className="flex items-center gap-2">
          <Calculator className="h-5 w-5 text-emerald-700 dark:text-emerald-400" aria-hidden="true" />
          <h3 className="text-base font-semibold text-slate-900 dark:text-slate-100">
            {language === 'ne' ? 'BMI क्याल्कुलेटर (दक्षिण एसियाली मापदण्ड)' : 'BMI Calculator (South Asian Reference)'}
          </h3>
        </div>

        <div className="mt-5 grid grid-cols-2 gap-4">
          <div>
            <label htmlFor="bmi-weight" className="block text-xs font-medium text-slate-600 dark:text-slate-400">
              {language === 'ne' ? 'तौल (kg)' : 'Weight (kg)'}
            </label>
            <input
              id="bmi-weight"
              type="number"
              min={25}
              max={220}
              value={weightKg}
              onChange={(e) => setWeightKg(Math.max(25, Number(e.target.value) || 25))}
              className="mt-1 w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 px-3 py-2 text-sm font-mono-tabular text-slate-900 dark:text-white"
            />
          </div>
          <div>
            <label htmlFor="bmi-height" className="block text-xs font-medium text-slate-600 dark:text-slate-400">
              {language === 'ne' ? 'उचाइ (cm)' : 'Height (cm)'}
            </label>
            <input
              id="bmi-height"
              type="number"
              min={100}
              max={230}
              value={heightCm}
              onChange={(e) => setHeightCm(Math.max(100, Number(e.target.value) || 100))}
              className="mt-1 w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 px-3 py-2 text-sm font-mono-tabular text-slate-900 dark:text-white"
            />
          </div>
        </div>

        <div className="mt-5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 p-4">
          <div className="flex items-baseline justify-between gap-2">
            <span className="text-xs font-medium text-slate-500 dark:text-slate-400">
              {language === 'ne' ? 'तपाईंको BMI नतिजा' : 'Calculated BMI'}
            </span>
            <span className="text-3xl font-bold font-mono-tabular text-slate-900 dark:text-white">
              {fmt(bmi.toFixed(1))}
            </span>
          </div>
          <p className={`mt-2 text-sm font-semibold ${band.color}`}>{band.label}</p>
          <p className="mt-1 text-xs text-slate-600 dark:text-slate-400 leading-relaxed">{band.note}</p>
        </div>
      </div>

      {/* Hydration & Daily Calorie Estimator */}
      <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6">
        <div className="flex items-center gap-2">
          <Droplet className="h-5 w-5 text-blue-700 dark:text-blue-400" aria-hidden="true" />
          <h3 className="text-base font-semibold text-slate-900 dark:text-slate-100">
            {language === 'ne' ? 'दैनिक पानी र क्यालोरी आवश्यकता' : 'Daily Water & Calorie Estimator'}
          </h3>
        </div>

        <div className="mt-5 grid grid-cols-2 gap-4">
          <div>
            <label htmlFor="calc-age" className="block text-xs font-medium text-slate-600 dark:text-slate-400">
              {language === 'ne' ? 'उमेर (वर्ष)' : 'Age (Years)'}
            </label>
            <input
              id="calc-age"
              type="number"
              min={10}
              max={95}
              value={age}
              onChange={(e) => setAge(Math.max(10, Number(e.target.value) || 20))}
              className="mt-1 w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 px-3 py-2 text-sm font-mono-tabular text-slate-900 dark:text-white"
            />
          </div>
          <div>
            <label htmlFor="calc-activity" className="block text-xs font-medium text-slate-600 dark:text-slate-400">
              {language === 'ne' ? 'शारीरिक सक्रियता' : 'Activity Level'}
            </label>
            <select
              id="calc-activity"
              value={activity}
              onChange={(e) => setActivity(e.target.value as 'sedentary' | 'moderate' | 'active')}
              className="mt-1 w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 px-3 py-2 text-sm text-slate-900 dark:text-white"
            >
              <option value="sedentary">{language === 'ne' ? 'कम सक्रिय (डेस्क काम)' : 'Desk / Light'}</option>
              <option value="moderate">{language === 'ne' ? 'मध्यम (दैनिक हिँडाइ)' : 'Moderate Walk'}</option>
              <option value="active">{language === 'ne' ? 'उच्च (व्यायाम / ट्रेक)' : 'Active / Trekking'}</option>
            </select>
          </div>
        </div>

        <div className="mt-5 grid grid-cols-2 gap-4">
          <div className="rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 p-4">
            <p className="text-xs text-slate-500 dark:text-slate-400">
              {language === 'ne' ? 'दैनिक पानी लक्ष्य' : 'Daily Hydration'}
            </p>
            <p className="mt-1 text-2xl font-bold font-mono-tabular text-blue-800 dark:text-blue-400">
              {fmt(dailyWaterLiters)} L
            </p>
          </div>
          <div className="rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 p-4">
            <p className="text-xs text-slate-500 dark:text-slate-400">
              {language === 'ne' ? 'अनुमानित क्यालोरी' : 'Maintenance Energy'}
            </p>
            <p className="mt-1 text-2xl font-bold font-mono-tabular text-emerald-700 dark:text-emerald-400">
              {fmt(dailyCalories)} kcal
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
