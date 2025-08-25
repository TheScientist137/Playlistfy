import { FaGithub } from "react-icons/fa";

export default function Footer() {
  return (
    <footer className="w-full py-4 px-6 flex items-center justify-between bg-stone-800">
      <span className="text-sm">
        {" "}
        © {new Date().getFullYear()} Guillermo Casado
      </span>
      <a
        href="https://github.com/TheScientist137/Playlistfy"
        target="_blank"
        rel="noopener noreferrer"
      >
        <FaGithub size={24} />
      </a>
    </footer>
  );
}
