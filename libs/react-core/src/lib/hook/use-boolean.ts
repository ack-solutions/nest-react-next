'use client';

import { useMemo, useState, useCallback, Dispatch, SetStateAction } from 'react';

// ----------------------------------------------------------------------

export interface UseBooleanReturn {
  value: boolean;
  data: any;
  onTrue: () => void;
  onFalse: () => void;
  onToggle: () => void;
  onSetData: (value?: any) => void;
  setValue: Dispatch<SetStateAction<boolean>>;
};

export function useBoolean(defaultValue = false): UseBooleanReturn {
  const [value, setValue] = useState(defaultValue);
  const [data, setData] = useState(null);

  const onTrue = useCallback(() => {
    setValue(true);
  }, []);

  const onFalse = useCallback(() => {
    setValue(false);
  }, []);

  const onToggle = useCallback(() => {
    setValue((prev) => !prev);
  }, []);

  const onSetData = useCallback(
    (value = null) => {
      if (value) {
        setValue(true)
      } else {
        setValue(false)
      }
      setData(value)
    },
    [],
  )


  const memoizedValue = useMemo(
    () => ({
      value,
      data,
      onTrue,
      onFalse,
      onToggle,
      onSetData,
      setValue,
    }),
    [data, value, onTrue, onFalse, onToggle, setValue, onSetData]
  );

  return memoizedValue;
}
