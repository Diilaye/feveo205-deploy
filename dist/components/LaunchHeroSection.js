import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useEffect } from 'react';
import { Rocket, Sparkles, Calendar, MapPin, Clock, Star, PartyPopper, Zap, TrendingUp, Users, Heart } from 'lucide-react';
const LaunchHeroSection = ({ onNavigate }) => {
    const [countdown, setCountdown] = useState({
        days: 0,
        hours: 0,
        minutes: 0,
        seconds: 0
    });
    const [isLaunched, setIsLaunched] = useState(false);
    const [showConfetti, setShowConfetti] = useState(false);
    const [pulseEffect, setPulseEffect] = useState(false);
    // Date de lancement : 17 novembre 2050
    const launchDate = new Date('2025-11-17T09:00:00');
    useEffect(() => {
        const interval = setInterval(() => {
            const now = new Date();
            const difference = launchDate.getTime() - now.getTime();
            if (difference > 0) {
                setCountdown({
                    days: Math.floor(difference / (1000 * 60 * 60 * 24)),
                    hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
                    minutes: Math.floor((difference / 1000 / 60) % 60),
                    seconds: Math.floor((difference / 1000) % 60)
                });
            }
            else {
                setIsLaunched(true);
                setShowConfetti(true);
                clearInterval(interval);
            }
        }, 1000);
        return () => clearInterval(interval);
    }, []);
    // Effet de pulsation toutes les 3 secondes
    useEffect(() => {
        const pulseInterval = setInterval(() => {
            setPulseEffect(true);
            setTimeout(() => setPulseEffect(false), 1000);
        }, 3000);
        return () => clearInterval(pulseInterval);
    }, []);
    return (_jsxs("section", { className: "relative bg-gradient-to-br from-primary-500 via-primary-700 to-primary-900 text-white overflow-hidden", children: [_jsxs("div", { className: "absolute inset-0 z-0", children: [_jsx("div", { className: "absolute inset-0 bg-cover bg-center bg-no-repeat", style: {
                            backgroundImage: 'url(/images/bg3.jpg)',
                        } }), _jsx("div", { className: "absolute inset-0 bg-gradient-to-br from-primary-500/70 via-primary-700/80 to-primary-900/85" })] }), _jsxs("div", { className: "absolute inset-0 opacity-20 z-10", children: [_jsx("div", { className: "absolute top-0 left-0 w-96 h-96 bg-accent-500 rounded-full mix-blend-multiply filter blur-3xl animate-blob" }), _jsx("div", { className: "absolute top-0 right-0 w-96 h-96 bg-accent-400 rounded-full mix-blend-multiply filter blur-3xl animate-blob animation-delay-2000" }), _jsx("div", { className: "absolute bottom-0 left-1/2 w-96 h-96 bg-success-500 rounded-full mix-blend-multiply filter blur-3xl animate-blob animation-delay-4000" })] }), _jsx("div", { className: "absolute inset-0 opacity-10 z-10", children: _jsx("div", { className: "absolute inset-0", style: {
                        backgroundImage: 'linear-gradient(rgba(255,255,255,.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.1) 1px, transparent 1px)',
                        backgroundSize: '50px 50px',
                        animation: 'gridMove 20s linear infinite'
                    } }) }), _jsx("div", { className: "absolute inset-0 overflow-hidden pointer-events-none z-20", children: [...Array(30)].map((_, i) => (_jsx("div", { className: "absolute animate-float-random", style: {
                        left: `${Math.random() * 100}%`,
                        top: `${Math.random() * 100}%`,
                        animationDelay: `${Math.random() * 5}s`,
                        animationDuration: `${5 + Math.random() * 10}s`,
                        opacity: Math.random() * 0.5 + 0.2
                    }, children: i % 3 === 0 ? (_jsx(Sparkles, { className: "w-3 h-3 text-yellow-300" })) : i % 3 === 1 ? (_jsx(Star, { className: "w-3 h-3 text-white", fill: "currentColor" })) : (_jsx(Zap, { className: "w-3 h-3 text-accent-400" })) }, `particle-${i}`))) }), showConfetti && (_jsx("div", { className: "absolute inset-0 overflow-hidden pointer-events-none z-30", children: [...Array(50)].map((_, i) => (_jsx("div", { className: "absolute animate-confetti", style: {
                        left: `${Math.random() * 100}%`,
                        top: '-10%',
                        animationDelay: `${Math.random() * 3}s`,
                        animationDuration: `${2 + Math.random() * 3}s`
                    }, children: _jsx("div", { className: "w-2 h-4 rounded", style: {
                            backgroundColor: ['#fca311', '#14213d', '#22c55e', '#fb923c', '#ffffff'][i % 5],
                            transform: `rotate(${Math.random() * 360}deg)`
                        } }) }, `confetti-${i}`))) })), _jsx("div", { className: "container mx-auto px-4 py-20 relative z-40", children: _jsxs("div", { className: "max-w-5xl mx-auto text-center", children: [_jsxs("div", { className: `inline-flex items-center gap-2 px-6 py-3 bg-white/20 backdrop-blur-sm rounded-full mb-8 transition-all duration-500 animate-zoom-pulse ${pulseEffect ? 'scale-110 shadow-2xl shadow-white/50' : 'animate-bounce'}`, children: [_jsx(Rocket, { className: `w-6 h-6 ${pulseEffect ? 'animate-spin' : ''}` }), _jsx("span", { className: "font-semibold text-lg", children: "LANCEMENT OFFICIEL" }), _jsx(Sparkles, { className: `w-6 h-6 ${pulseEffect ? 'animate-pulse' : ''}` })] }), _jsxs("h1", { className: "text-3xl md:text-4xl font-black mb-6 leading-tight", children: [_jsx("span", { className: `block bg-clip-text text-transparent bg-gradient-to-r from-accent-400 via-accent-500 to-accent-400 animate-gradient animate-zoom-pulse ${pulseEffect ? 'scale-105' : ''} transition-transform duration-500`, children: "Initiative GLOBALE NEXUS - FEVEO 2050" }), _jsx("span", { className: "block text-3xl md:text-3xl mt-4 text-neutral-50 animate-fade-in animate-zoom-pulse", style: { animationDelay: '0.5s' }, children: "Le Programme qui Transforme le S\u00E9n\u00E9gal" })] }), _jsx("div", { className: "mb-8", children: _jsx("p", { className: "text-xl md:text-2xl text-white/80 font-light italic animate-slide-up", children: "\"Une r\u00E9volution \u00E9conomique port\u00E9e par un million de femmes\"" }) }), _jsxs("div", { className: "flex flex-wrap justify-center gap-6 mb-12 text-lg", children: [_jsxs("div", { className: "flex items-center gap-2 bg-white/10 backdrop-blur-sm px-6 py-3 rounded-full", children: [_jsx(Calendar, { className: "w-5 h-5" }), _jsx("span", { className: "font-semibold", children: "17 Novembre 2050" })] }), _jsxs("div", { className: "flex items-center gap-2 bg-white/10 backdrop-blur-sm px-6 py-3 rounded-full", children: [_jsx(Clock, { className: "w-5 h-5" }), _jsx("span", { className: "font-semibold", children: "09h00 GMT" })] }), _jsxs("div", { className: "flex items-center gap-2 bg-white/10 backdrop-blur-sm px-6 py-3 rounded-full", children: [_jsx(MapPin, { className: "w-5 h-5" }), _jsx("span", { className: "font-semibold", children: "Dakar, S\u00E9n\u00E9gal" })] })] }), !isLaunched ? (_jsxs("div", { className: "mb-12", children: [_jsx("p", { className: "text-2xl md:text-2xl font-bold mb-8 text-white/90 animate-pulse", children: "\u23F0 Compte \u00E0 rebours avant le lancement \u23F0" }), _jsx("div", { className: "grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 max-w-3xl mx-auto", children: [
                                        { value: countdown.days, label: 'Jours', icon: Calendar, color: 'from-accent-400 to-accent-600' },
                                        { value: countdown.hours, label: 'Heures', icon: Clock, color: 'from-primary-400 to-primary-600' },
                                        { value: countdown.minutes, label: 'Minutes', icon: Zap, color: 'from-success-400 to-success-600' },
                                        { value: countdown.seconds, label: 'Secondes', icon: Sparkles, color: 'from-accent-500 to-accent-700' }
                                    ].map((item, index) => (_jsxs("div", { className: `relative bg-white/20 backdrop-blur-md rounded-2xl p-6 shadow-2xl transform hover:scale-110 transition-all duration-300 hover:rotate-3 ${pulseEffect && index === 3 ? 'scale-110 shadow-white/50' : ''}`, children: [_jsx("div", { className: "absolute -top-3 -right-3", children: _jsx(item.icon, { className: `w-6 h-6 animate-bounce text-white` }) }), _jsx("div", { className: `text-5xl md:text-6xl font-black mb-2 bg-clip-text text-transparent bg-gradient-to-br ${item.color} animate-number-change`, children: String(item.value).padStart(2, '0') }), _jsx("div", { className: "text-sm md:text-base font-semibold uppercase tracking-wider text-white/80", children: item.label }), _jsx("div", { className: "mt-3 h-1 bg-white/20 rounded-full overflow-hidden", children: _jsx("div", { className: `h-full bg-gradient-to-r ${item.color} animate-pulse`, style: {
                                                        width: index === 3 ? `${(item.value / 60) * 100}%` : '100%',
                                                        transition: 'width 1s linear'
                                                    } }) })] }, index))) }), _jsxs("div", { className: "mt-8 inline-flex items-center gap-3 px-6 py-3 bg-accent-500/20 border-2 border-accent-400/50 rounded-full animate-bounce-slow animate-zoom-pulse", children: [_jsx(Zap, { className: "w-5 h-5 text-accent-400 animate-pulse" }), _jsx("span", { className: "text-lg font-bold text-accent-100", children: "Ne manquez pas cet \u00E9v\u00E9nement historique !" }), _jsx(Zap, { className: "w-5 h-5 text-accent-400 animate-pulse" })] })] })) : (_jsxs("div", { className: "mb-12", children: [_jsx("div", { className: "flex justify-center mb-6 animate-bounce", children: _jsx(PartyPopper, { className: "w-20 h-20 text-accent-400 animate-spin-slow" }) }), _jsx("p", { className: "text-4xl md:text-6xl font-black mb-4 animate-pulse", children: "\uD83C\uDF89 LE PROGRAMME EST LANC\u00C9 ! \uD83C\uDF89" }), _jsx("p", { className: "text-xl md:text-2xl text-neutral-50 animate-fade-in", children: "Bienvenue dans la nouvelle \u00E8re de transformation du S\u00E9n\u00E9gal" }), _jsx("div", { className: "mt-6 flex justify-center gap-4", children: [...Array(5)].map((_, i) => (_jsx(Star, { className: "w-8 h-8 text-accent-400 animate-bounce", fill: "currentColor", style: { animationDelay: `${i * 0.1}s` } }, i))) })] })), _jsx("div", { className: "grid md:grid-cols-3 gap-6 mb-12", children: [
                                {
                                    icon: Users,
                                    title: '1 Million de Femmes',
                                    description: 'Au cœur du développement économique',
                                    color: 'from-accent-400 to-accent-600',
                                    delay: '0s'
                                },
                                {
                                    icon: TrendingUp,
                                    title: 'Innovation Systémique',
                                    description: 'Une approche révolutionnaire du développement',
                                    color: 'from-primary-400 to-primary-600',
                                    delay: '0.2s'
                                },
                                {
                                    icon: Heart,
                                    title: 'Transformation Nationale',
                                    description: 'Un impact durable sur tout le territoire',
                                    color: 'from-success-400 to-success-600',
                                    delay: '0.4s'
                                }
                            ].map((item, index) => (_jsxs("div", { className: "group relative bg-white/10 backdrop-blur-sm rounded-2xl p-6  hover:bg-white/20 hover:shadow-2xl hover:shadow-white/30 hover:rotate-20", style: { animationDelay: item.delay }, children: [_jsx("div", { className: `absolute inset-0 bg-gradient-to-br ${item.color} opacity-0 group-hover:opacity-20 rounded-2xl transition-opacity duration-500` }), _jsxs("div", { className: "relative", children: [_jsx(item.icon, { className: `w-12 h-12 mx-auto mb-4 text-neutral-50 group-hover:scale-125 group-hover:rotate-12 transition-transform duration-500` }), _jsx("div", { className: "absolute top-0 left-1/2 -translate-x-1/2", children: _jsx(Sparkles, { className: "w-4 h-4 text-accent-400 opacity-0 group-hover:opacity-100 animate-ping" }) })] }), _jsx("h3", { className: "text-xl font-bold mb-2 group-hover:text-accent-400 transition-colors", children: item.title }), _jsx("p", { className: "text-neutral-50/80 group-hover:text-neutral-50 transition-colors", children: item.description }), _jsx("div", { className: `absolute inset-0 rounded-2xl bg-gradient-to-r ${item.color} opacity-0 group-hover:opacity-100 transition-opacity duration-500`, style: { padding: '2px', zIndex: -1 }, children: _jsx("div", { className: "h-full w-full bg-primary-500 rounded-2xl" }) })] }, index))) }), _jsxs("div", { className: "flex flex-col sm:flex-row gap-4 justify-center", children: [_jsxs("button", { onClick: () => onNavigate?.('adhesion'), className: "group relative px-8 py-4 bg-white text-primary-600 rounded-full font-bold text-lg shadow-2xl hover:shadow-white/50 transition-all transform hover:scale-110 hover:-translate-y-2 overflow-hidden", children: [_jsxs("span", { className: "relative z-10 flex items-center justify-center gap-2", children: [_jsx(Rocket, { className: "w-5 h-5 group-hover:animate-bounce" }), "Rejoindre le Mouvement", _jsx(Sparkles, { className: "w-5 h-5 group-hover:animate-spin" })] }), _jsx("div", { className: "absolute inset-0 bg-gradient-to-r from-accent-400 via-accent-500 to-success-500 rounded-full opacity-0 group-hover:opacity-100 transition-opacity animate-gradient" }), _jsx("div", { className: "absolute inset-0 rounded-full opacity-0 group-hover:opacity-30 group-hover:animate-ping bg-neutral-50" })] }), _jsxs("button", { onClick: () => onNavigate?.('about'), className: "group relative px-8 py-4 bg-white/20 backdrop-blur-sm text-white border-2 border-white rounded-full font-bold text-lg hover:bg-white hover:text-primary-600 transition-all transform hover:scale-110 hover:-translate-y-2 overflow-hidden animate-zoom-pulse", style: { animationDelay: '0.5s' }, children: [_jsxs("span", { className: "relative z-10 flex items-center justify-center gap-2", children: [_jsx(Star, { className: "w-5 h-5 group-hover:rotate-180 transition-transform duration-500", fill: "currentColor" }), "D\u00E9couvrir le Programme"] }), _jsx("div", { className: "absolute inset-0 bg-neutral-50 opacity-0 group-hover:opacity-100 transition-opacity rounded-full" })] })] }), _jsx("div", { className: "mt-16 text-center", children: _jsx("p", { className: "text-xl md:text-2xl font-light text-neutral-50/80 italic", children: "\"Ensemble, construisons le S\u00E9n\u00E9gal de demain\"" }) })] }) }), _jsx("div", { className: "absolute bottom-0 left-0 right-0 z-40", children: _jsx("svg", { viewBox: "0 0 1440 120", className: "w-full h-auto", children: _jsx("path", { fill: "#fafaf9", d: "M0,64L48,69.3C96,75,192,85,288,80C384,75,480,53,576,48C672,43,768,53,864,58.7C960,64,1056,64,1152,58.7C1248,53,1344,43,1392,37.3L1440,32L1440,120L1392,120C1344,120,1248,120,1152,120C1056,120,960,120,864,120C768,120,672,120,576,120C480,120,384,120,288,120C192,120,96,120,48,120L0,120Z" }) }) }), _jsx("style", { children: `
        @keyframes blob {
          0%, 100% {
            transform: translate(0, 0) scale(1);
          }
          33% {
            transform: translate(30px, -50px) scale(1.1);
          }
          66% {
            transform: translate(-20px, 20px) scale(0.9);
          }
        }

        @keyframes float {
          0%, 100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-20px);
          }
        }

        @keyframes float-random {
          0%, 100% {
            transform: translate(0, 0) rotate(0deg);
          }
          25% {
            transform: translate(30px, -30px) rotate(90deg);
          }
          50% {
            transform: translate(-20px, 40px) rotate(180deg);
          }
          75% {
            transform: translate(40px, 20px) rotate(270deg);
          }
        }

        @keyframes gradient {
          0%, 100% {
            background-position: 0% 50%;
          }
          50% {
            background-position: 100% 50%;
          }
        }

        @keyframes confetti {
          0% {
            transform: translateY(0) rotate(0deg);
            opacity: 1;
          }
          100% {
            transform: translateY(100vh) rotate(720deg);
            opacity: 0;
          }
        }

        @keyframes gridMove {
          0% {
            transform: translate(0, 0);
          }
          100% {
            transform: translate(50px, 50px);
          }
        }

        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

        @keyframes numberChange {
          0%, 100% {
            transform: scale(1);
          }
          50% {
            transform: scale(1.1);
          }
        }

        @keyframes spinSlow {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }

        @keyframes bounceSlow {
          0%, 100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-10px);
          }
        }

        @keyframes zoomPulse {
          0%, 100% {
            transform: scale(1);
          }
          50% {
            transform: scale(1.05);
          }
        }

        @keyframes zoomInOut {
          0%, 100% {
            transform: scale(1);
          }
          25% {
            transform: scale(1.1);
          }
          75% {
            transform: scale(0.95);
          }
        }

        .animate-blob {
          animation: blob 7s infinite;
        }

        .animate-float {
          animation: float 3s ease-in-out infinite;
        }

        .animate-float-random {
          animation: float-random 10s ease-in-out infinite;
        }

        .animate-gradient {
          background-size: 200% auto;
          animation: gradient 3s linear infinite;
        }

        .animate-confetti {
          animation: confetti 5s linear infinite;
        }

        .animate-slide-up {
          animation: slideUp 0.8s ease-out forwards;
        }

        .animate-fade-in {
          animation: fadeIn 1.5s ease-in forwards;
        }

        .animate-number-change {
          animation: numberChange 1s ease-in-out infinite;
        }

        .animate-spin-slow {
          animation: spinSlow 3s linear infinite;
        }

        .animate-bounce-slow {
          animation: bounceSlow 2s ease-in-out infinite;
        }

        .animate-zoom-pulse {
          animation: zoomPulse 3s ease-in-out infinite;
        }

        .animate-zoom-in-out {
          animation: zoomInOut 4s ease-in-out infinite;
        }

        .animation-delay-2000 {
          animation-delay: 2s;
        }

        .animation-delay-4000 {
          animation-delay: 4s;
        }
      ` })] }));
};
export default LaunchHeroSection;
//# sourceMappingURL=LaunchHeroSection.js.map