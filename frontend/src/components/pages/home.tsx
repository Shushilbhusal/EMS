import React from "react";
import emsImage from '../../assets/ems.webp';
import {
  Users,
  BarChart3,
  Shield,
  ArrowRight,
  TrendingUp,
  UserPlus,
} from "lucide-react";
import { Link } from "react-router-dom";

const Home: React.FC = () => {
  const features = [
    {
      icon: <Users className="w-6 h-6" />,
      text: "Manage teams effortlessly",
      description: "Intuitive team organization and management tools",
    },
    {
      icon: <BarChart3 className="w-6 h-6" />,
      text: "Real-time Analytics",
      description: "Live updates and comprehensive data insights",
    },
    {
      icon: <Shield className="w-6 h-6" />,
      text: "Enterprise Security",
      description: "Military-grade data protection and privacy",
    },
    {
      icon: <TrendingUp className="w-6 h-6" />,
      text: "Performance Tracking",
      description: "Monitor and optimize team productivity",
    },
  ];

 
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100">
      {/* Hero Section */}
      <section className="relative max-w-7xl  mx-auto px-6 py-16 lg:py-24 flex flex-col-reverse lg:flex-row items-center gap-16">
        {/* Background Decorative Elements */}
        <div className="absolute top-20 left-10 w-72 h-72 bg-gradient-to-br from-[#f49cbb]/10 to-[#dd2d4a]/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-10 w-80 h-80 bg-gradient-to-br from-[#880d1e]/10 to-[#dd2d4a]/5 rounded-full blur-3xl"></div>

        {/* Left Content */}
        <div className="flex-1 space-y-8 relative z-10">
          {/* Main Heading */}
          <h1 className="text-5xl md:text-7xl font-bold text-gray-900 leading-tight">
            Streamline Your{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#dd2d4a] via-[#880d1e] to-[#f49cbb] animate-gradient-x">
              Workforce
            </span>{" "}
            Management
          </h1>

          {/* Subheading */}
          <p className="text-xl text-gray-600 max-w-2xl leading-relaxed">
            Transform your employee management with our cutting-edge platform
            designed for modern enterprises. Experience seamless operations,
            real-time insights, and unparalleled efficiency.
          </p>

          {/* Features Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-2xl">
            {features.map((feature, index) => (
              <div
                key={index}
                className="group bg-white/70 backdrop-blur-sm border border-gray-200 rounded-2xl p-4 hover:border-[#f49cbb]/50 hover:shadow-lg hover:shadow-[#dd2d4a]/10 transition-all duration-300"
              >
                <div className="flex items-start gap-4">
                  <div className="p-3 rounded-xl bg-gradient-to-br from-[#f49cbb]/10 to-[#dd2d4a]/10 text-[#880d1e] group-hover:scale-110 transition-transform duration-300">
                    {feature.icon}
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900 group-hover:text-[#880d1e] transition-colors">
                      {feature.text}
                    </h3>
                    <p className="text-sm text-gray-500 mt-1">
                      {feature.description}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 pt-6">
            <Link to="/signup" className="group">
              <button className="relative bg-gradient-to-r from-[#dd2d4a] via-[#880d1e] to-[#f49cbb] text-white px-8 py-4 rounded-xl font-semibold text-lg hover:shadow-2xl hover:shadow-[#dd2d4a]/40 transition-all duration-300 flex items-center gap-3 transform hover:-translate-y-0.5">
                <span>Start Free Trial</span>
                <ArrowRight className="w-5 h-5 group-hover:translate-x-2 transition-transform duration-300" />
                <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-[#dd2d4a] to-[#880d1e] opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10 blur-md"></div>
              </button>
            </Link>
            <Link to="/login">
              <button className="px-8 py-4 rounded-xl font-semibold text-lg border-2 border-gray-300 text-gray-700 hover:border-[#dd2d4a] hover:text-[#880d1e] transition-all duration-300 hover:shadow-lg">
                Login to Dashboard
              </button>
            </Link>
          </div>

          
        </div>

        {/* Right Hero Image - Moved Higher */}
        <div className="flex-1 relative z-10 lg:-mt-64">
          <div className="relative">
            {/* Main Card */}
            <div className="relative bg-gradient-to-br from-white to-gray-50 rounded-3xl shadow-2xl overflow-hidden border border-gray-200">
              <div className="absolute inset-0 bg-gradient-to-br from-[#f49cbb]/5 via-transparent to-[#dd2d4a]/5"></div>

              {/* Card Header */}
              <div className="p-7 bg-gradient-to-r from-[#dd2d4a] to-[#880d1e]">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-white/20 flex items-center justify-center">
                      <UserPlus className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <h3 className="text-white font-bold text-lg">
                        Employee Dashboard
                      </h3>
                      <p className="text-white/80 text-sm">Live Overview</p>
                    </div>
                  </div>
                  <div className="w-3 h-3 rounded-full bg-green-400 animate-pulse"></div>
                </div>
              </div>

              {/* Card Content */}
              <div className="p-8">
                <img 
                  src={emsImage}
                  alt="Employee Management Dashboard"
                  className="w-full h-auto object-contain"
                />

                {/* Floating Stats */}
                <div className="absolute -bottom-4 -right-4 bg-white rounded-2xl shadow-xl p-4 border border-gray-200">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#f49cbb] to-[#dd2d4a] flex items-center justify-center">
                      <TrendingUp className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <div className="text-xs text-gray-500">Productivity</div>
                      <div className="text-xl font-bold text-gray-900">
                        +42%
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Decorative Dots */}
            <div className="absolute -top-6 -right-6 w-12 h-12 rounded-full bg-gradient-to-br from-[#f49cbb] to-[#dd2d4a] opacity-30 blur-sm"></div>
            <div className="absolute -bottom-6 -left-6 w-16 h-16 rounded-full bg-gradient-to-br from-[#880d1e] to-[#dd2d4a] opacity-20 blur-sm"></div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;