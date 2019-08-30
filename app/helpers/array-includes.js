import { helper } from '@ember/component/helper';

export function arrayIncludes(params) {
  let [ array, element ] = params;
  return array.includes(element);
}

export default helper(arrayIncludes);
