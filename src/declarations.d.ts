// Declarations used to make the TypeScript compiler happy
declare module 'redux-persist';
declare module 'redux-persist/lib/integration/react';
declare module 'redux-persist-transform-immutable';

declare module "*.svg" {
  const content: any;
  export default content;
}
