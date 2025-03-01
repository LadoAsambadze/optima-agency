"use client";

import { useState, useEffect, useRef } from "react";
import { WorldMap } from "@/src/components/svg";
import { Clock, MapPin, MapPinCheck, User } from "lucide-react";

export default function WhyUsSection() {
  const [stats, setStats] = useState({
    clients: 0,
    tours: 0,
    destinations: 0,
    years: 0,
  });

  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.2 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => {
      if (sectionRef.current) {
        // eslint-disable-next-line react-hooks/exhaustive-deps
        observer.unobserve(sectionRef.current);
      }
    };
  }, []);

  useEffect(() => {
    if (!isVisible) return;

    const incrementStats = () => {
      setStats((prevStats) => ({
        clients: Math.min(prevStats.clients + 5, 1000),
        tours: Math.min(prevStats.tours + 1, 200),
        destinations: Math.min(prevStats.destinations + 0.5, 10),
        years: Math.min(prevStats.years + 0.25, 5),
      }));
    };

    const interval = setInterval(incrementStats, 50);
    return () => clearInterval(interval);
  }, [isVisible]);

  const statCards = [
    {
      Icon: User,
      value: stats.clients,
      label: "Happy Clients",
      delay: "delay-0",
    },
    {
      Icon: MapPinCheck,
      value: stats.tours,
      label: "Tours Completed",
      delay: "delay-100",
    },
    {
      Icon: MapPin,
      value: stats.destinations,
      label: "Destinations",
      delay: "delay-200",
    },
    {
      Icon: Clock,
      value: stats.years,
      label: "Years Experience",
      delay: "delay-300",
    },
  ];

  return (
    <div
      ref={sectionRef}
      className="w-full bg-white pt-10 pb-20 px-4 md:py-16 lg:py-24"
    >
      <div className="max-w-7xl mx-auto flex flex-col lg:flex-row gap-4 md:gap-8 lg:gap-10">
        <div
          className={`flex flex-col justify-center gap-6 lg:gap-8 lg:w-[470px] transition-all duration-1000 ${isVisible ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-10"}`}
        >
          <h1 className="text-3xl md:text-4xl lg:text-5xl xl:text-6xl text-center md:text-start font-bold leading-tight">
            Why Choose Us
          </h1>
          <p className="text-slate-700 text-lg text-center">
            Your trusted partner in exploring Georgia s finest destinations
          </p>
        </div>

        <div className="relative flex-1">
          <WorldMap
            className={`h-full md:h-[250px] lg:h-[300px] absolute w-full -top-28 md:-top-0 object-cover transition-all duration-1000 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}`}
          />

          <div className="grid grid-cols-2 gap-4 md:gap-6 w-full max-w-md mx-auto relative md:pt-16 pt-36">
            {statCards.map(({ Icon, value, label, delay }) => (
              <div
                key={label}
                className={`bg-white p-3 md:p-4 shadow-lg rounded-lg flex flex-col items-center transform transition-all duration-700 ${delay} ${
                  isVisible
                    ? "opacity-100 translate-y-0 scale-100"
                    : "opacity-0 translate-y-10 scale-95"
                }`}
              >
                <Icon className="h-6 w-6 md:h-8 md:w-8 text-primary-500" />
                <div className="text-xl md:text-2xl lg:text-3xl font-bold">
                  {Math.round(value).toLocaleString()}+
                </div>
                <div className="text-slate-600 text-sm md:text-base">
                  {label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
