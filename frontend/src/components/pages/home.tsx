import React from "react";
import { Users, BarChart3, Shield, Zap, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

const Home: React.FC = () => {
  const features = [
    { icon: <Users className="w-6 h-6" />, text: "Manage teams effortlessly" },
    { icon: <BarChart3 className="w-6 h-6" />, text: "Real-time Updation" },
    { icon: <Shield className="w-6 h-6" />, text: "Secure data protection" },
    { icon: <Zap className="w-6 h-6" />, text: "Fast & responsive interface" },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-6 py-24 flex flex-col-reverse lg:flex-row items-center gap-16">
        {/* Left Content */}
        <div className="flex-1 space-y-6">
          <div className="inline-flex items-center gap-2 bg-blue-100 text-blue-700 px-4 py-2 rounded-full text-sm font-medium">
            <Zap className="w-4 h-4" />
            Trusted EMS
          </div>

          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 leading-tight">
            Modern{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-cyan-500">
              Employee
            </span>{" "}
            Management
          </h1>

          <p className="text-xl text-gray-600 max-w-xl">
            Perform seamless employee management with our intuitive and
            efficient platform designed for modern businesses.
          </p>

          {/* Features List */}
          <div className="grid grid-cols-2 gap-4 max-w-lg">
            {features.map((feature, index) => (
              <div key={index} className="flex items-center gap-3">
                <div className="p-2 bg-blue-100 text-blue-600 rounded-lg">
                  {feature.icon}
                </div>
                <span className="text-gray-700 font-medium">
                  {feature.text}
                </span>
              </div>
            ))}
          </div>

          {/* CTA Button */}
          <div className="pt-4">
            <Link to="/signup">
              <button className="group relative bg-gradient-to-r from-blue-600 to-cyan-500 text-white px-8 py-4 rounded-xl font-semibold text-lg hover:shadow-2xl hover:shadow-blue-500/30 transition-all flex items-center gap-3">
                Get Started
                <ArrowRight className="w-5 h-5 group-hover:translate-x-2 transition-transform" />
              </button>
            </Link>
          </div>
        </div>

        {/* Right Image */}
        <div className="flex-1 flex justify-center lg:justify-end">
          <img
            src="https://img.icons8.com/color/480/000000/employee-card.png"
            alt="Employee Management"
            className="w-80 h-80 object-contain shadow-lg rounded-xl"
          />
        </div>
      </section>
    </div>
  );
};

export default Home;
