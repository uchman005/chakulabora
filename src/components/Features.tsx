import Image from "next/image";
import { FiCheck } from "react-icons/fi";

const features = [
  {
    id: 1,
    title: "Best Practices",
    text: "We celebrate best practices around farming bringing a consciousness about our planet to the forefront.",
  },
  {
    id: 2,
    title: "Team Work",
    text: "Sharing ideas makes us all come out better. We are building with this consciousness.",
  },
  {
    id: 3,
    title: "Collaboration",
    text: "We aim to bring together people of like minds for effective collaboration.",
  },
  {
    id: 4,
    title: "Knowledge Base",
    text: "We want to save the best ideas and publish them, so it is freely available to farmers for years to come.",
  },
];

const goals = [
  "To lead innovation on sustainable, regenerative food systems in a time of climate change and residual ecological deficits",
  "To build the capacity of farmers, entrepreneurs, and institutions through collaborative and synergistic alliances",
  "To positively and comprehensively impact the local community eco-system towards resilience in food sovereignty, public health, nutrition, and biodiversity",
  "To facilitate access and bridge gaps in finance for micro, small, and medium-size businesses",
  "To facilitate access to sustainable markets for the farmers' produce",
];

const principles = [
  {
    title: "Transparency",
    text: "Whether we're developing software or solving a business problem, we all have access to the information and materials necessary for doing our best work. And when these materials are accessible, we can build upon each other's ideas and discoveries. We can make more effective decisions and understand how decisions affect us.",
  },
  {
    title: "Collaboration",
    text: "When we're free to participate, we can enhance each other's work in unanticipated ways. When we can modify what others have shared, we unlock new possibilities. By initiating new projects together, we can solve problems that no one can solve alone. And when we implement open standards, we enable others to contribute in the future.",
  },
  {
    title: "Release early and often",
    text: "Rapid prototypes can lead to rapid discoveries. An iterative approach leads to better solutions faster. When you're free to experiment, you can look at problems in new ways and seek answers in new places. You can learn by doing.",
  },
  {
    title: "Inclusive meritocracy",
    text: "Good ideas can come from anywhere, and the best ideas should win. Only by including diverse perspectives in our conversations can we be certain we've identified the best ideas, and decision-makers continually seek those perspectives. We may not operate by consensus, but successful work determines which projects gather support and effort from the community.",
  },
  {
    title: "Community",
    text: "Communities form when different people unite around a common purpose. Shared values guide decision making, and community goals supersede individual interests and agendas.",
  },
];

export default function Features() {
  return (
    <div className="p-4 text-xl text-gray-900">
      <section
        aria-labelledby="services"
        className="mx-auto my-4 max-w-3xl text-center"
        data-aos="fade-up"
        data-aos-delay="100"
      >
        <h2 className="text-3xl font-bold" id="services">
          WHAT WE OFFER
        </h2>
        <p className="text-center text-gray-700" data-aos="fade-up" data-aos-delay="200">
          We are looking to bring farmers together to discuss their issues regarding best practices
          around farming. As farmers, the challenges we face are finite and universal. You may have
          encountered my challenge and overcame and vice versa. Let&apos;s share knowledge and
          everybody wins.
        </p>
      </section>

      <ul className="m-0 mt-10 grid list-none grid-cols-1 gap-6 p-0 sm:m-10 md:grid-cols-2 lg:grid-cols-4">
        {features.map((feature) => (
          <li
            className="flex flex-row"
            key={feature.id}
            data-aos="fade-up"
            data-aos-delay={100 + feature.id * 100}
          >
            <FiCheck className="mt-1.5 mr-2 shrink-0 text-green-700" aria-hidden />
            <div className="flex flex-col">
              <h3 className="mb-1 text-xl font-bold">{feature.title}</h3>
              <p className="text-gray-700">{feature.text}</p>
            </div>
          </li>
        ))}
      </ul>

      <section
        aria-labelledby="who-we-are"
        className="mx-auto my-4 max-w-3xl px-4 text-center"
        data-aos="fade-up"
        data-aos-delay="100"
      >
        <h2 id="who-we-are" className="mb-3 text-3xl">
          WHO WE ARE
        </h2>
        <p data-aos="fade-up" data-aos-delay="200">
          We are a community committed to Healthy Food, from farm to fork for all Africans. Healthy
          food is nature created. Healthy Food strengthens the human immune system and is the first
          line of attack against disease. We focus on Africa because the continent is in a battle
          for its food sovereignty. It is inconceivable that the continent with the most arable land
          cannot feed itself. Solutions abound to address Africa&apos;s food security challenges
          but most come from those with an agenda of dependency economics and resource extraction.
          Nature has already perfectly provided what is needed to feed the world&apos;s expanding
          population. Food security comes with a responsibility to align with its principles and be
          stewards of our environment.
        </p>
        <p data-aos="fade-up" data-aos-delay="300">
          The Chakula Bora community includes: farmers, agricultural students, agricultural
          extensionists, researchers, economists, ecologists, pastoralists, value addition players,
          policy influencers, and concerned global citizens.
        </p>
      </section>

      <div className="my-5 flex w-full justify-center">
        <div className="flex w-[85%] flex-col justify-center gap-4 lg:flex-row">
          <section
            aria-labelledby="chakula-bora"
            className="flex flex-col items-center justify-center gap-3 p-4"
            data-aos="fade-right"
            data-aos-delay="100"
          >
            <Image
              src="/chak1.jpeg"
              className="h-auto w-full rounded-md object-contain"
              width={798}
              height={436}
              sizes="(min-width: 1024px) 40vw, 85vw"
              alt="Young African man on his corn field"
            />
            <h2 id="chakula-bora">Chakula Bora</h2>
            <p>
              The Chakula Bora Digital Network is an integrated learning management system designed
              to grow a knowledge ecosystem through a collaborative pedagogical model and with
              participatory learning. The platform combines professional and academic content with
              medium and small-holder farmer&apos;s local, experiential knowledge in multiple
              formats and languages.
            </p>
            <p>
              The network allows for peer-to-peer interaction through knowledge sharing
              engagements, making the best use of technology such as smartphones and tablets to
              disseminate information. An SMS technology interface invites collaboration with the
              simplest of telecom devices. Content is tailored to each user segment.
            </p>
            <p>
              The digital network intends to be a single source for indigenous knowledge, a central
              repository for learning, containing publications, instructional videos, guidance
              notes on best practices, and internet forums.
            </p>
          </section>
          <section
            aria-labelledby="triple-p"
            className="flex flex-col items-center gap-3 p-4"
            data-aos="fade-left"
            data-aos-delay="100"
          >
            <Image
              src="/chak2.jpeg"
              className="h-auto w-full rounded-md object-contain"
              width={600}
              height={300}
              sizes="(min-width: 1024px) 40vw, 85vw"
              alt="Women working on a vegetable field"
            />
            <h2 id="triple-p">Triple P</h2>
            <p>
              We are grounded in the 3Ps: Planet + People = Productivity. We anticipate our
              collaborations with you will give rise to innovations, actions, resources, and
              policies which affirm the principles of food sovereignty, agroecological balance,
              restored biodiversity and strengthened economies for the world&apos;s most
              impoverished of communities, both rural and urban.
            </p>
          </section>
        </div>
      </div>

      <section aria-labelledby="goals" className="mb-4 text-center" data-aos="fade-up" data-aos-delay="100">
        <h2 id="goals">Goals of the Network</h2>
        <div className="flex flex-col text-start lg:flex-row">
          <div className="flex flex-1 flex-col items-center justify-center gap-3 p-4">
            <h3>The goals of the Chakula Bora Network are</h3>
            <ul className="m-0 list-none p-0">
              {goals.map((goal) => (
                <li key={goal} className="flex items-start justify-start gap-2 px-2">
                  <FiCheck className="mt-1.5 shrink-0 text-green-700" aria-hidden />
                  <p className="m-0 text-gray-900">{goal}</p>
                </li>
              ))}
            </ul>
            <Image
              src="/chak3.jpeg"
              width={550}
              height={431}
              sizes="(min-width: 1024px) 35vw, 70vw"
              alt="Graphical representation of areas our network intends to cover"
              className="h-auto w-[70%]"
            />
          </div>
          <div className="flex-1 p-4">
            <h3 className="text-center">Principles of Open Source</h3>
            {principles.map((principle) => (
              <p key={principle.title} className="text-gray-900">
                <strong>{principle.title}.</strong> {principle.text}
              </p>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
