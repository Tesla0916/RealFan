import { renderHook, act } from '@testing-library/react-hooks'; // will attempt to auto-detect
// import { renderHook } from '@testing-library/react-hooks/dom'; // will use react-dom

// import {renderHook, act} from '@testing-library/react-hooks/native'
// will use react-test-renderer
// import {renderHook, act} from '@testing-library/react-hooks/server'// will use react-dom/server

import useCounter from './index';

test('should use counter', () => {
  const { result } = renderHook(() => useCounter());
  expect(result.current.count).toBe(0);
  expect(typeof result.current.increment).toBe('function');
});

test('should use counter', () => {
  const { result } = renderHook(() => useCounter());
  expect(result.current.count).toBe(0);
  expect(typeof result.current.increment).toBe('function');
});

test('should increment counter', () => {
  const { result } = renderHook(() => useCounter());
  act(() => {
    result.current.increment();
  });
  expect(result.current.count).toBe(1);
});
