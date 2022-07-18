import RequestError from '@/errors/RequestError';

import assertThat from './assert-that';

describe('assertThat util', () => {
  it('assert to be truthy', () => {
    expect(() => {
      assertThat(true, new Error(' '));
    }).not.toThrow();
  });

  it('should throw exception if type is Error', () => {
    const error = new Error('exception');
    expect(() => {
      assertThat(false, error);
    }).toMatchError(error);
  });

  it('should throw RequestError if logto errorcode is provided', () => {
    expect(() => {
      assertThat(false, 'auth.unauthorized');
    }).toMatchError(new RequestError({ code: 'auth.unauthorized' }));
  });
});
