import { Icon } from '@chakra-ui/react';
import { CheckIcon } from '@chakra-ui/icons';
import Image from 'next/image'
const features = [
  {
    id: 1,
    title: 'Best Practices',
    text: 'We celebrate best practices around farming bringing a consciousness about our planet to the forefront.',
  },
  {
    id: 2,
    title: 'Team Work',
    text: 'Sharing ideas makes us all come out better. We are building with this consciousness.',
  },
  {
    id: 3,
    title: 'Collaboration',
    text: 'We aim to bring together people of like minds for effective collaboration.',
  },
  {
    id: 4,
    title: 'Knowledge Base',
    text: 'We want to save the best ideas and publish them, so it is freely available to farmers for years to come.',
  },
]

export default function Features() {
  return (
    <div className='p-4'>
      <div className='text-center container my-4 max-w-3xl'>
        <h2 className='text-3xl bold' id='services'>WHAT WE OFFER</h2>
        <p className='gray.600 text-xl text-center'>
          We are looking to bring farmers together to discuss their issues regarding best practices
          around farming. As farmers, the challenges we face are finite and universal.
          You may have encountered my challenge and overcame and vice versa.
          {" Let's"} share knowledge and everbody wins.
        </p>
      </div>

      <div className='mt-10'>
        <div className='row m-10'>
          {features.map((feature) => (
            <div className='flex flex-row col-sm-12 col-md-6 col-lg-3' key={feature.id} >
              <div className='px-2 text-green-400'>
                <Icon as={CheckIcon} />
              </div>
              <div className='flex flex-col'>
                <p className='bold'>{feature.title}</p>
                <p className='text-gray-600'>{feature.text}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
      <section className="container my-4 max-w-3xl text-center px-4">
        <h2 className="text-3xl mb-3">WHO WE ARE</h2>
        <p>
          We are a community committed to Healthy Food, from farm to fork for all Africans.  Healthy food is nature created. Healthy Food strengthens the human immune system and is the first line of attack against disease. We focus on Africa because the continent is in a battle for its food sovereignty.  It is inconceivable    that the continent with the most arable land cannot feed itself.  Solutions abound to address {"Africa's"} food security challenges but most come from those with an agenda of dependency economics and resource extraction. Nature has already perfectly provided what is needed to feed the {"world's"} expanding population.  Food security comes with a responsibility to align with its principles and be stewards of our environment.
        </p>
        <p>
          The Chakula Bora community includes: farmers, agricultural students, agricultural extensionists, researchers, economists, ecologists, pastoralists, value addition players, policy influencers, and concerned global citizens.
        </p>
      </section>
      <div className="flex my-5 justify-center w-full">
        <div className="flex flex-col lg:flex-row justify-center w-[85%] gap-4">
          <section className="flex flex-col items-center justify-center gap-3 p-4">
            <Image src="/chak1.jpeg" className="w-full object-contain rounded-md" width={420} height={250} alt="Young African man on his corn field" loading={"lazy"} title="Organic agriculture" />
            <h2>Chakula Bora</h2>
            <p>
              The Chakula Bora Digital Network is an integrated learning management system designed to grow a knowledge ecosystem through a collaborative pedagogical model and with participatory learning. The platform combines professional and academic content with medium and small-holder {"farmer's"} local, experiential knowledge in multiple formats and languages.
            </p>
            <p>
              The network allows for peer-to-peer interaction through knowledge sharing engagements, making the best use of technology such as smartphones and tablets to disseminate information. An SMS technology interface invites collaboration with the simplest of telecom devices. Content is tailored to each user segment.
            </p>
            <p>
              The digital network intends to be a single source for indigenous knowledge, a central repository for learning, containing publications, instructional videos, guidance notes on best practices, and internet forums
            </p>
          </section>
          <section className="flex flex-col items-center gap-3 p-4">
            <Image src="/chak2.jpeg" className="w-full object-contain rounded-md" width={465} height={235} alt="Women working on a vegetable field" loading={"lazy"} title="Organic agriculture" />
            <h2>Triple P</h2>
            <p>
              We are grounded in the 3Ps: Planet + People = Productivity.  We anticipate our collaborations with you will give rise to innovations, actions, resources, and policies which affirm the principles of food sovereignty, agroecological balance, restored biodiversity and strengthened economies for the {"world's"} most impoverished of communities, both rural and urban.
            </p>
          </section>
        </div>
      </div>
      <section className="text-center mb-4">
        <h2>
          Goals of the Network
        </h2>
        <div className="flex flex-col lg:flex-row text-start">
          <section className="flex-1 p-4 justify-center flex flex-col items-center gap-3">
            <h3>The goals of the Chakula Bora Network are</h3>
            <ul className="p-0">
              <li className="px-2 text-green-400 flex items-center justify-start gap-2">
                <Icon as={CheckIcon} />
                <p className="m-0 text-gray-900">
                  To lead innovation on sustainable, regenerative food systems in a time of climate change and residual ecological deficits
                </p>
              </li>
              <li className="px-2 text-green-400 flex items-center justify-start gap-2">
                <Icon as={CheckIcon} />
                <p className="m-0 text-gray-900">
                  To build the capacity of farmers, entrepreneurs, and institutions through collaborative and synergistic alliances
                </p>
              </li>
              <li className="px-2 text-green-400 flex items-center justify-start gap-2">
                <Icon as={CheckIcon} />
                <p className="m-0 text-gray-900">
                  To positively and comprehensively impact the local community eco-system towards resilience in food sovereignty, public health, nutrition, and biodiversity
                </p>
              </li>
              <li className="px-2 text-green-400 flex items-center justify-start gap-2">
                <Icon as={CheckIcon} />
                <p className="m-0 text-gray-900">
                  To facilitate access and bridge gaps in finance for micro, small, and medium-size businesses
                </p>
              </li>
              <li className="px-2 text-green-400 flex items-center justify-start gap-2">
                <Icon as={CheckIcon} />
                <p className="m-0 text-gray-900">
                  To facilitate access to sustainable markets for the {"farmers'"} produce
                </p>
              </li>
            </ul>
            <Image
              src='/chak3.jpeg'
              width={300}
              height={300}
              alt='Graphical repersentation of areasour network intend to cover'
              className="w-[70%] text-center"
            />
          </section>
          <section className="flex-1 p-4">
            <h3 className="text-center">
              Principles of Open Source
            </h3>
            <p>
              Becoming a member in the Network is free of charge.  We embrace the principles of Open Source where:
            </p>
            <p className="m-0 text-gray-900">
              <strong>Transparency.</strong> Whether {"we're"} developing software or solving a business problem, we all have access to the information and materials necessary for doing our best work. And when these materials are accessible, we can build upon each {"other's"} ideas and discoveries. We can make more effective decisions and understand how decisions affect us.
            </p>
            <p>
              <strong>Collaboration.</strong> When {"we're"} free to participate, we can enhance each {"other's"} work in unanticipated ways. When we can modify what others have shared, we unlock new possibilities. By initiating new projects together, we can solve problems that no one can solve alone. And when we implement open standards, we enable others to contribute in the future.
            </p>
            <p>
              <strong>Release early and often.</strong> Rapid prototypes can lead to rapid discoveries. An iterative approach leads to better solutions faster. When {"you're"} free to experiment, you can look at problems in new ways and seek answers in new places. You can learn by doing.
            </p>
            <p>
              <strong>Inclusive meritocracy.</strong> Good ideas can come from anywhere, and the best ideas should win. Only by including diverse perspectives in our conversations can we be certain {"we've"} identified the best ideas, and decision-makers continually seek those perspectives. We may not operate by consensus, but successful work determines which projects gather support and effort from the community.
            </p>
            <p>
              <strong>Community.</strong> Communities form when different people unite around a common purpose. Shared values guide decision making, and community goals supersede individual interests and agendas.
            </p>
          </section>
        </div>
      </section>
    </div>
  );
}