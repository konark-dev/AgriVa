import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  ArrowLeft, Droplets, Wheat, Bug, Palette, Star, AlertTriangle, 
  CheckCircle, Info, ChevronDown, ChevronUp, Award, Shield
} from 'lucide-react';

// --- Grade Computation Engine ---
function computeGrade(moisture, foreignMatterPct, defects, colorUniformity) {
  // Moisture score (weight: 35%)
  const moistureScores = { low: 100, medium: 55, high: 15 };
  const moistureScore = moistureScores[moisture] || 55;

  // Foreign matter score (weight: 25%) — 0% = 100, 20% = 0
  const fmScore = Math.max(0, 100 - (foreignMatterPct * 5));

  // Defect score (weight: 25%) — 0 defects = 100, each defect -30
  const defectCount = defects.length;
  const defectScore = Math.max(0, 100 - (defectCount * 30));

  // Color uniformity score (weight: 15%) — 1 star = 20, 5 stars = 100
  const colorScore = colorUniformity * 20;

  const totalScore = (moistureScore * 0.35) + (fmScore * 0.25) + (defectScore * 0.25) + (colorScore * 0.15);

  let grade = 'C';
  if (totalScore >= 75) grade = 'A';
  else if (totalScore >= 50) grade = 'B';

  return { grade, totalScore: Math.round(totalScore), moistureScore, fmScore, defectScore, colorScore };
}

const GRADE_STYLES = {
  A: { bg: 'bg-emerald-100', border: 'border-emerald-400', text: 'text-emerald-800', label: 'Grade A — Premium', desc: 'Meets all quality benchmarks. Eligible for premium pricing.' },
  B: { bg: 'bg-amber-100', border: 'border-amber-400', text: 'text-amber-800', label: 'Grade B — Standard', desc: 'Acceptable quality. Standard marketplace pricing.' },
  C: { bg: 'bg-orange-100', border: 'border-orange-400', text: 'text-orange-800', label: 'Grade C — Economy', desc: 'Below standard. May require processing or discount pricing.' }
};

const DEFECT_OPTIONS = [
  { key: 'bruising', label: 'Bruising / Crushing', labelHi: 'चोट / कुचला हुआ', emoji: '🟤', desc: 'Visible dents, soft spots, or crushed areas' },
  { key: 'pest_damage', label: 'Pest / Insect Damage', labelHi: 'कीट क्षति', emoji: '🐛', desc: 'Holes, tunnels, or visible insect presence' },
  { key: 'discoloration', label: 'Discoloration / Mold', labelHi: 'रंग बदलाव / फफूंदी', emoji: '🟡', desc: 'Unusual dark spots, white mold, or color patches' }
];

const MOISTURE_OPTIONS = [
  { key: 'low', label: 'Low (<12%)', labelHi: 'कम (<12%)', emoji: '🟢', desc: 'Grain snaps cleanly, feels dry and hard. Ideal for long storage.', color: 'border-emerald-400 bg-emerald-50' },
  { key: 'medium', label: 'Medium (12-16%)', labelHi: 'मध्यम (12-16%)', emoji: '🟡', desc: 'Slightly flexible, mild resistance to nail press. Acceptable.', color: 'border-amber-400 bg-amber-50' },
  { key: 'high', label: 'High (>16%)', labelHi: 'ज़्यादा (>16%)', emoji: '🔴', desc: 'Soft, bends without breaking, feels damp. Risk of spoilage.', color: 'border-rose-400 bg-rose-50' }
];

export default function QualitySelfDeclarationScreen({ lot, onBack, onGraded }) {
  const { language } = useApp();

  const [moisture, setMoisture] = useState('');
  const [foreignMatter, setForeignMatter] = useState(2);
  const [defects, setDefects] = useState([]);
  const [colorUniformity, setColorUniformity] = useState(0);
  const [showMoistureGuide, setShowMoistureGuide] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [gradeResult, setGradeResult] = useState(null);

  const toggleDefect = (key) => {
    setDefects(prev => prev.includes(key) ? prev.filter(d => d !== key) : [...prev, key]);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!moisture || colorUniformity === 0) return;

    const result = computeGrade(moisture, foreignMatter, defects, colorUniformity);
    setGradeResult(result);
    setSubmitted(true);
  };

  const handleConfirmGrade = () => {
    if (!gradeResult) return;
    onGraded({
      quality: {
        moisture,
        foreignMatterPct: foreignMatter,
        defects,
        colorUniformity,
        grade: gradeResult.grade,
        totalScore: gradeResult.totalScore,
        selfDeclaredAt: new Date().toISOString(),
        locked: false // locked when buyer accepts
      }
    });
  };

  // --- RESULT SCREEN ---
  if (submitted && gradeResult) {
    const style = GRADE_STYLES[gradeResult.grade];
    return (
      <div className="min-h-screen bg-[#f9f8f3]">
        {/* Header */}
        <div className="bg-[#2E7D32] text-white p-4 flex items-center space-x-3 shadow-md">
          <button onClick={() => setSubmitted(false)} className="p-1 rounded-full hover:bg-white/20">
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="font-bold text-sm">Quality Grade Result</h1>
            <p className="text-[10px] text-emerald-100">{lot?.id || 'Lot'}</p>
          </div>
        </div>

        <div className="p-4 space-y-4">
          {/* Grade Badge — Big */}
          <div className={`${style.bg} ${style.border} border-2 rounded-2xl p-6 text-center shadow-md`}>
            <div className="flex items-center justify-center space-x-2 mb-2">
              <Award className={`w-8 h-8 ${style.text}`} />
              <span className={`text-4xl font-black ${style.text}`}>{gradeResult.grade}</span>
            </div>
            <p className={`text-sm font-bold ${style.text}`}>{style.label}</p>
            <p className="text-xs text-slate-600 mt-1">{style.desc}</p>
            <div className={`mt-3 inline-block px-3 py-1 rounded-full ${style.bg} ${style.text} text-xs font-bold border ${style.border}`}>
              Quality Score: {gradeResult.totalScore}/100
            </div>
          </div>

          {/* Score Breakdown */}
          <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-sm space-y-3">
            <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center space-x-1">
              <Shield className="w-3.5 h-3.5 text-[#2E7D32]" />
              <span>Score Breakdown</span>
            </h3>
            {[
              { label: 'Moisture Level', score: gradeResult.moistureScore, weight: '35%', icon: '💧' },
              { label: 'Foreign Matter', score: gradeResult.fmScore, weight: '25%', icon: '🌾' },
              { label: 'Defects', score: gradeResult.defectScore, weight: '25%', icon: '🔍' },
              { label: 'Color Uniformity', score: gradeResult.colorScore, weight: '15%', icon: '🎨' }
            ].map(item => (
              <div key={item.label} className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <span>{item.icon}</span>
                  <span className="text-xs text-slate-700 font-medium">{item.label}</span>
                  <span className="text-[10px] text-slate-400">({item.weight})</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-20 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                    <div 
                      className={`h-full rounded-full ${item.score >= 70 ? 'bg-emerald-500' : item.score >= 40 ? 'bg-amber-500' : 'bg-rose-500'}`}
                      style={{ width: `${item.score}%` }}
                    />
                  </div>
                  <span className="text-xs font-bold text-slate-700 w-8 text-right">{item.score}</span>
                </div>
              </div>
            ))}
          </div>

          {/* Declaration Note */}
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-3 flex items-start space-x-2">
            <Info className="w-4 h-4 text-blue-500 mt-0.5 shrink-0" />
            <p className="text-[11px] text-blue-800 leading-relaxed">
              This grade is based on your self-declaration. A Mandi Operator or Quality Lab can 
              override this grade after physical inspection. The grade, photos, and declaration will 
              be <strong>permanently locked</strong> once a buyer accepts an offer on this lot.
            </p>
          </div>

          {/* Confirm Button */}
          <button
            onClick={handleConfirmGrade}
            className="w-full py-3.5 rounded-xl bg-[#2E7D32] text-white font-bold text-sm shadow-lg flex items-center justify-center space-x-2"
          >
            <CheckCircle className="w-5 h-5" />
            <span>Confirm Grade & List on Marketplace</span>
          </button>
        </div>
      </div>
    );
  }

  // --- FORM SCREEN ---
  return (
    <div className="min-h-screen bg-[#f9f8f3]">
      {/* Header */}
      <div className="bg-[#2E7D32] text-white p-4 flex items-center space-x-3 shadow-md">
        <button onClick={onBack} className="p-1 rounded-full hover:bg-white/20">
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div>
          <h1 className="font-bold text-sm">Quality Self-Declaration</h1>
          <p className="text-[10px] text-emerald-100">{lot?.crop} — {lot?.id || 'New Lot'}</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="p-4 space-y-5 pb-32">

        {/* --- 1. MOISTURE LEVEL --- */}
        <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-sm space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center space-x-1.5">
              <Droplets className="w-4 h-4 text-blue-500" />
              <span>Moisture Level</span>
            </h3>
            <button 
              type="button"
              onClick={() => setShowMoistureGuide(!showMoistureGuide)}
              className="text-[10px] text-blue-600 font-bold flex items-center space-x-0.5"
            >
              <Info className="w-3 h-3" />
              <span>Guide</span>
              {showMoistureGuide ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
            </button>
          </div>

          {showMoistureGuide && (
            <div className="bg-slate-50 rounded-xl p-3 border border-slate-100 text-[11px] text-slate-600 space-y-1">
              <p><strong>How to check:</strong> Press a grain between your thumbnail and finger.</p>
              <p>• <strong>Snaps cleanly</strong> → Low moisture (&lt;12%)</p>
              <p>• <strong>Bends slightly</strong> → Medium moisture (12-16%)</p>
              <p>• <strong>Soft, doesn't break</strong> → High moisture (&gt;16%)</p>
            </div>
          )}

          <div className="space-y-2">
            {MOISTURE_OPTIONS.map(opt => (
              <button
                key={opt.key}
                type="button"
                onClick={() => setMoisture(opt.key)}
                className={`w-full p-3 rounded-xl border-2 text-left transition-all ${
                  moisture === opt.key 
                    ? `${opt.color} ring-2 ring-offset-1 ${opt.key === 'low' ? 'ring-emerald-300' : opt.key === 'medium' ? 'ring-amber-300' : 'ring-rose-300'}` 
                    : 'border-slate-200 bg-white hover:bg-slate-50'
                }`}
              >
                <div className="flex items-center space-x-2">
                  <span className="text-lg">{opt.emoji}</span>
                  <div>
                    <span className="text-xs font-bold text-slate-800">{opt.label}</span>
                    <p className="text-[10px] text-slate-500 mt-0.5">{opt.desc}</p>
                  </div>
                  {moisture === opt.key && <CheckCircle className="w-4 h-4 text-[#2E7D32] ml-auto shrink-0" />}
                </div>
              </button>
            ))}
          </div>
          {!moisture && <p className="text-[10px] text-rose-400">* Required — select one</p>}
        </div>

        {/* --- 2. FOREIGN MATTER % --- */}
        <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-sm space-y-3">
          <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center space-x-1.5">
            <Wheat className="w-4 h-4 text-amber-600" />
            <span>Foreign Matter</span>
          </h3>
          <p className="text-[10px] text-slate-500">Estimated percentage of stones, chaff, broken grain, or other non-crop material.</p>
          
          <div className="space-y-2">
            <input
              type="range"
              min="0"
              max="20"
              step="1"
              value={foreignMatter}
              onChange={(e) => setForeignMatter(Number(e.target.value))}
              className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-[#2E7D32]"
            />
            <div className="flex justify-between text-[10px] text-slate-400">
              <span>0% (Clean)</span>
              <span className={`text-sm font-black ${foreignMatter <= 5 ? 'text-emerald-600' : foreignMatter <= 12 ? 'text-amber-600' : 'text-rose-600'}`}>
                {foreignMatter}%
              </span>
              <span>20% (Heavy)</span>
            </div>
          </div>
        </div>

        {/* --- 3. DEFECTS --- */}
        <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-sm space-y-3">
          <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center space-x-1.5">
            <Bug className="w-4 h-4 text-rose-500" />
            <span>Visible Defects</span>
          </h3>
          <p className="text-[10px] text-slate-500">Check all that apply. Leave all unchecked if produce has no visible defects.</p>

          <div className="space-y-2">
            {DEFECT_OPTIONS.map(opt => (
              <button
                key={opt.key}
                type="button"
                onClick={() => toggleDefect(opt.key)}
                className={`w-full p-3 rounded-xl border-2 text-left transition-all flex items-center space-x-3 ${
                  defects.includes(opt.key)
                    ? 'border-rose-400 bg-rose-50 ring-1 ring-rose-200'
                    : 'border-slate-200 bg-white hover:bg-slate-50'
                }`}
              >
                <span className="text-xl">{opt.emoji}</span>
                <div className="flex-1">
                  <span className="text-xs font-bold text-slate-800">{opt.label}</span>
                  <p className="text-[10px] text-slate-500 mt-0.5">{opt.desc}</p>
                </div>
                <div className={`w-5 h-5 rounded-md border-2 flex items-center justify-center shrink-0 ${
                  defects.includes(opt.key) 
                    ? 'bg-rose-500 border-rose-500' 
                    : 'border-slate-300 bg-white'
                }`}>
                  {defects.includes(opt.key) && <CheckCircle className="w-3.5 h-3.5 text-white" />}
                </div>
              </button>
            ))}
          </div>
          {defects.length === 0 && (
            <div className="flex items-center space-x-1.5 text-emerald-600">
              <CheckCircle className="w-3.5 h-3.5" />
              <span className="text-[10px] font-bold">No defects declared — excellent!</span>
            </div>
          )}
        </div>

        {/* --- 4. COLOR UNIFORMITY --- */}
        <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-sm space-y-3">
          <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center space-x-1.5">
            <Palette className="w-4 h-4 text-purple-500" />
            <span>Color Uniformity</span>
          </h3>
          <p className="text-[10px] text-slate-500">How uniform is the color across the batch? 5 = perfectly uniform, 1 = highly mixed colors.</p>

          <div className="flex items-center justify-center space-x-2 py-2">
            {[1, 2, 3, 4, 5].map(star => (
              <button
                key={star}
                type="button"
                onClick={() => setColorUniformity(star)}
                className="focus:outline-none transition-transform hover:scale-110"
              >
                <Star 
                  className={`w-8 h-8 transition-colors ${
                    star <= colorUniformity 
                      ? 'text-amber-400 fill-amber-400' 
                      : 'text-slate-300'
                  }`} 
                />
              </button>
            ))}
          </div>
          <div className="text-center">
            {colorUniformity > 0 ? (
              <span className="text-xs font-bold text-slate-700">
                {colorUniformity === 5 ? 'Perfectly Uniform' : colorUniformity === 4 ? 'Very Good' : colorUniformity === 3 ? 'Average' : colorUniformity === 2 ? 'Mixed' : 'Highly Irregular'}
              </span>
            ) : (
              <span className="text-[10px] text-rose-400">* Required — tap a star</span>
            )}
          </div>
        </div>

        {/* --- LIVE GRADE PREVIEW --- */}
        {moisture && colorUniformity > 0 && (() => {
          const preview = computeGrade(moisture, foreignMatter, defects, colorUniformity);
          const previewStyle = GRADE_STYLES[preview.grade];
          return (
            <div className={`${previewStyle.bg} ${previewStyle.border} border rounded-2xl p-3 flex items-center justify-between`}>
              <div className="flex items-center space-x-2">
                <Award className={`w-5 h-5 ${previewStyle.text}`} />
                <div>
                  <span className={`text-xs font-bold ${previewStyle.text}`}>Estimated Grade: {preview.grade}</span>
                  <p className="text-[10px] text-slate-500">Score: {preview.totalScore}/100</p>
                </div>
              </div>
              <span className={`text-2xl font-black ${previewStyle.text}`}>{preview.grade}</span>
            </div>
          );
        })()}

        {/* Submit */}
        <button
          type="submit"
          disabled={!moisture || colorUniformity === 0}
          className={`w-full py-3.5 rounded-xl font-bold text-sm shadow-lg flex items-center justify-center space-x-2 transition-all ${
            moisture && colorUniformity > 0
              ? 'bg-[#2E7D32] text-white'
              : 'bg-slate-300 text-slate-500 cursor-not-allowed'
          }`}
        >
          <Shield className="w-5 h-5" />
          <span>Submit Quality Declaration</span>
        </button>
      </form>
    </div>
  );
}
