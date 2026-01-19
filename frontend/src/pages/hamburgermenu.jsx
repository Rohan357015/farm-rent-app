const HamburgerMenu = ({ onClose, onNavigate }) => {
  return (
    <>
      {/* backdrop */}
      <div
        onClick={onClose}
        className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40"
      />

      {/* menu */}
      <div className="fixed top-0 right-0 z-50 h-full w-1/2 max-w-sm bg-[#12152D] text-white">
        <div className="flex justify-between items-center px-6 py-4 border-b">
          <h2 className="font-bold">AgroRent</h2>
          <button onClick={onClose}>✕</button>
        </div>

        <nav className="flex flex-col gap-6 px-6 py-8 text-lg font-semibold">
            <button
            onClick={() => {
              onNavigate("hero");
              onClose();
            }}
            className="text-left hover:text-yellow-400"
          >
           Home
          </button>
          <button
            onClick={() => {
              onNavigate("about");
              onClose();
            }}
            className="text-left hover:text-yellow-400"
          >
            About / Rentals
          </button>

          <button
            onClick={() => {
              onNavigate("contact");
              onClose();
            }}
            className="text-left hover:text-yellow-400"
          >
            Contact
          </button>

          <a href="/farmer-login">Login</a>
          <a href="/farmer-register" className="bg-yellow-400 text-black px-4 py-2 rounded w-fit">
            Register
          </a>
        </nav>
      </div>
    </>
  );
};

export default HamburgerMenu;