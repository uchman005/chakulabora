import { FaLeaf, FaSitemap, FaSeedling, FaApple, FaFire } from "react-icons/fa";

const cards = [
  { icon: FaLeaf, text: "Farmers" },
  { icon: FaSitemap, text: "Researchers" },
  { icon: FaSeedling, text: "Agribusinesses" },
  { icon: FaLeaf, text: "Financial Institutions" },
  { icon: FaApple, text: "Supply Chains" },
  { icon: FaFire, text: "Consumers" },
];

// Informational cards (previously linked to "#"). Solid white cards on the gradient
// keep text and icons well above WCAG AA contrast.
export default function Cards() {
  return (
    <ul className="m-0 grid list-none grid-cols-1 gap-4 rounded-xl bg-linear-to-br from-green-700 to-blue-800 p-4 md:grid-cols-2">
      {cards.map((card) => (
        <li
          key={card.text}
          className="flex flex-col items-center rounded-lg bg-white p-4 shadow-lg ring-1 ring-black/5 transition duration-300 hover:scale-105 motion-reduce:transition-none motion-reduce:hover:scale-100"
        >
          <span className="mb-2 flex size-14 items-center justify-center rounded-full bg-green-50" aria-hidden="true">
            <card.icon className="text-3xl text-green-800" />
          </span>
          <span className="text-center text-base font-semibold text-gray-900">{card.text}</span>
        </li>
      ))}
    </ul>
  );
}
