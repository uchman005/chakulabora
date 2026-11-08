import Link from "next/link";

export default function About() {
  return (
    <div className="mt-5 max-w-7xl">
      <section className="flex flex-col items-center justify-center space-y-8 px-4 py-20 text-center md:space-y-10 md:py-28">
        <h1 className="text-3xl font-bold md:text-6xl">
          About <span className="text-blue-700">Chakula Bora Network</span>
        </h1>
        <p className="max-w-3xl text-2xl leading-relaxed tracking-wider text-gray-900">
          Our mission is to create a digital platform for stakeholders in the agriculture space to
          network, engage and share ideas, knowledge and information on regenerative agriculture.
          While we encourage a lively exchange of ideas and opinions, we ask that you read and
          respect the{" "}
          <Link href="/coc" className="font-bold underline">
            code of conduct
          </Link>
          . We reserve the right to suspend membership to anyone who violates this code of conduct.
        </p>
        <div className="flex flex-row space-x-6 text-xl">
          <Link
            href="/auth/signup"
            className="rounded-full bg-blue-600 px-6 py-2 font-semibold text-white shadow-md shadow-black transition duration-300 ease-in-out hover:bg-blue-700 hover:shadow-xs active:shadow-lg"
          >
            Register Here
          </Link>
          <Link
            href="/contact"
            className="rounded-full bg-gray-100 px-6 py-2 font-semibold text-black shadow-md shadow-black duration-300 ease-in-out hover:bg-gray-200 hover:shadow-xs active:shadow-lg"
          >
            Learn more
          </Link>
        </div>
      </section>
    </div>
  );
}
