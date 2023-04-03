import { ReactNode } from 'react';
import Image from 'next/image';
const Testimonial = ({ children }: { children: ReactNode }) => {
  return <div className=''>{children}</div>;
};

const TestimonialContent = ({ children }: { children: ReactNode }) => {
  return (
    <>
      <div className="bg-white dark:bg-gray-800 shadow-lg p-8 rounded-xl flex flex-col items-center relative">
        <div className="w-0 h-0 border-left border-left-solid border-transparent border-right border-right-solid border-transparent border-top border-solid border-transparent border-top-color-white dark:border-top-color-gray-800 absolute bottom-0 left-1/2 transform -translate-x-1/2" />
        {children}
      </div>
    </>
  );
};

const TestimonialHeading = ({ children }: { children: ReactNode }) => {
  return (
    <h3 className="text-xl">
      {children}
    </h3>
  );
};

const TestimonialText = ({ children }: { children: ReactNode }) => {
  return (
    <span className="text-center text-gray-600 dark:text-gray-400 text-sm">
      {children}
    </span>
  );
};

const TestimonialAvatar = ({
  name,
  title,
}: {
  name: string;
  title: string;
}) => {
  return (
    <div className="flex items-center mt-8 flex-col">
      <Image src='/placeholder.png' alt={name} width={40} height={40} className="rounded-full mb-2" />
      <div className='flex flex-col space-x-1 items-center'>
      <p className="font-semibold">{name}</p>
        <p className="text-sm text-gray-600 dark:gray-400">
          {title}
        </p>
      </div>
    </div>
  );
};

export default function Testimonials() {
  return (
    <div className='bg-gray-100'>
      <div className="container mx-auto max-w-7xl py-16 space-y-12">
        <div className='flex flex-col space-0 items-center'>
          <h2 className='text-bold text-4xl'>From Our Board</h2>
          <p>Hear our board of directors speak</p>
        </div>
        <div className='flex gap-4  flex-col md:flex-row space-4 md:space-4 lg:space-10'>
          <Testimonial>
            <TestimonialContent>
              <TestimonialHeading>Efficient Collaborating</TestimonialHeading>
              <TestimonialText>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Auctor
                neque sed imperdiet nibh lectus feugiat nunc sem.
              </TestimonialText>
            </TestimonialContent>
            <TestimonialAvatar
              name={'Brian Stephenson'}
              title={'Passion of hope International'}
            />
          </Testimonial>
          <Testimonial>
            <TestimonialContent>
              <TestimonialHeading>Intuitive Design</TestimonialHeading>
              <TestimonialText>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Auctor
                neque sed imperdiet nibh lectus feugiat nunc sem.
              </TestimonialText>
            </TestimonialContent>
            <TestimonialAvatar
              name={'Karen Ali Esq.'}
              title={'CEO at ABC Corporation'}
            />
          </Testimonial>
          <Testimonial>
            <TestimonialContent>
              <TestimonialHeading>Mindblowing Service</TestimonialHeading>
              <TestimonialText>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Auctor
                neque sed imperdiet nibh lectus feugiat nunc sem.
              </TestimonialText>
            </TestimonialContent>
            <TestimonialAvatar
              name={'Lynn Keyys'}
              title={'CEO at ABC Corporation'}
            />
          </Testimonial>
        </div>
      </div>
    </div>
  );
}