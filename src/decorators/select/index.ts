import { Angular2Apollo } from '../../Angular2Apollo';
import { getSelectedProps, GraphQLSelectMetadataFactory } from './metadata';
import { parseArguments } from './arguments';
import { Selector } from './selector';

export function use(apollo: Angular2Apollo) {
  return (target) => {
    const props = getSelectedProps(target);

    for (const prop in props) {
      if (props.hasOwnProperty(prop)) {
        const selector = props[prop].selector;
      }
    }
  };
}

export function select(...args) {
  const selector: Selector = parseArguments(...args);

  return (target, name: string) => {
    GraphQLSelectMetadataFactory(selector)(target, name);
  };
}

