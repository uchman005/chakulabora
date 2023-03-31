import {
    Icon
  } from '@chakra-ui/react';
  import { CheckIcon } from '@chakra-ui/icons';
  
  // Replace test data with your own
  const features = Array.apply(null, Array(8)).map(function (x, i) {
    return {
      id: i,
      title: 'Lorem ipsum dolor sit amet',
      text: 'Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam.',
    };
  });
  
  export default function Features() {
    return (
      <div className='p-4'>
        <div className='text-center container my-4 max-w-3xl'>
          <h1 className='underline text-3xl bold'>This is the headline</h1>
          <p className='gray.600 text-xl text-center'>
            Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam
            nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat,
            sed diam voluptua.
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
      </div>
    );
  }