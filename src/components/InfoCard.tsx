
import React from 'react';

interface InfoCardProps {
  title: string;
  children: React.ReactNode;
  accentColor?: 'blue' | 'purple' | 'pink' | 'emerald';
  className?: string;
  headerAction?: React.ReactNode;
}

const InfoCard: React.FC<InfoCardProps> = ({ title, children, accentColor = 'blue', className = '', headerAction }) => {
  const colorMap = {
    blue: 'border-blue-500/30 shadow-blue-500/10',
    purple: 'border-purple-500/30 shadow-purple-500/10',
    pink: 'border-pink-500/30 shadow-pink-500/10',
    emerald: 'border-emerald-500/30 shadow-emerald-500/10',
  };

  const textGradient = {
    blue: 'from-blue-400 to-cyan-400',
    purple: 'from-purple-400 to-fuchsia-400',
    pink: 'from-pink-400 to-rose-400',
    emerald: 'from-emerald-400 to-teal-400',
  };

  return (
    <div className={`bg-slate-900/50 backdrop-blur-sm border rounded-2xl p-4 shadow-xl transition-all duration-300 ${colorMap[accentColor]} ${className}`}>
      <div className="flex justify-between items-center mb-4">
        <h3 className={`text-[10px] font-black uppercase tracking-widest bg-clip-text text-transparent bg-gradient-to-r ${textGradient[accentColor]}`}>
          {title}
        </h3>
        {headerAction}
      </div>
      <div>{children}</div>
    </div>
  );
};

export default InfoCard;
