import Link from 'next/link';
import { FaLeaf, FaSitemap, FaSeedling, FaApple, FaFire } from 'react-icons/fa';

const cards = [
  { icon: FaLeaf, text: "Farmers", link: "#" },
  { icon: FaSitemap, text: "Researchers", link: "#" },
  { icon: FaSeedling, text: "Agribusinesses", link: "#" },
  { icon: FaLeaf, text: "Financial Institutions", link: "#" },
  { icon: FaApple, text: "Supply Chains", link: "#" },
  { icon: FaFire, text: "Consumers", link: "#" },
];

export default function Cards() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-gradient-to-br from-green-500 to-blue-600">
      {cards.map((card, index) => (
        <Link key={index} href={card.link}>
          <div className="bg-white bg-opacity-20 border border-white border-opacity-30 rounded-lg shadow-lg p-4 flex flex-col items-center transition duration-300 hover:scale-105 cursor-pointer">
            <card.icon className="text-4xl mb-2 text-green-600" />
            <span className="text-center text-gray-800 text-sm">{card.text}</span>
          </div>
        </Link>
      ))}
    </div>
  );
}