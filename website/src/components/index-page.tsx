import {ReactElement} from 'react';
import {HeroGradient, FeatureList} from '@theguild/components';
import UndrawNavigator from 'public/assets/undraw_navigator.svg';
import UndrawBusiness from 'public/assets/undraw_business.svg';
import UndrawFormingIdeas from 'public/assets/undraw_forming_ideas.svg';

export function IndexPage(): ReactElement {
  return (
    <>
      <HeroGradient
        title="Apollo Angular"
        description="GraphQL Client for Angular Framework"
        link={{
          href: '/docs',
          children: 'View Docs',
          title: 'Get started with Apollo Angular',
        }}
        colors={['#000', '#ec5074']}
      />

      <FeatureList
        className='[&_h3]:mt-6'
        items={[
          {
            title: 'Easy to Us',
            description:
              'Designed from the ground up to be easily configured and used to get your application up and running quickly.',
            image: {
              src: UndrawNavigator,
              loading: 'eager',
              placeholder: 'empty',
              alt: 'Easy to Us',
            },
          },
          {
            title: 'Production-ready',
            description:
              'Used with success and proven by many large-scale applications.',
            image: {
              src: UndrawBusiness,
              loading: 'eager',
              placeholder: 'empty',
              alt: 'Production-ready',
            },
          },
          {
            title: 'Customisable',
            description:
              'Extend or customize your GraphQL setup. Apollo Angular can be extended on any level.',
            image: {
              src: UndrawFormingIdeas,
              loading: 'eager',
              placeholder: 'empty',
              alt: 'Customisable',
            },
          },
        ]}
      />
    </>
  );
}
