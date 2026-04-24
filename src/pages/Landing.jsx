export default function Landing() {
  return (
    <div
      className="relative min-h-screen bg-cover bg-center flex items-center justify-center"
      style={{
        backgroundImage:
          "url('/background.jpg')",
      }}
    >
      {/* dark overlay */}
      <div className="absolute inset-0 bg-black/60"></div>

      {/* content */}
      <div className="relative text-center text-white px-6">
        <span className="block text-4xl md:text-6xl font-bold mb-3">
          User Management System
        </span>

        <span className="block text-lg md:text-2xl mb-2 text-gray-200">
          By: Vince Timothy Esmeralda 
        </span>

        <span className="block text-sm md:text-lg text-gray-300">
          For: Information Assurance and Security 1
        </span>
      </div>
    </div>
  );
}
