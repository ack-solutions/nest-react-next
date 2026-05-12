import React from 'react';
import type { Dayjs } from 'dayjs';


export interface DateRange {
    startDate?: Dayjs;
    endDate?: Dayjs;
}

export type Setter<T> =
    | React.Dispatch<React.SetStateAction<T>>
    | ((value: T) => void);

export enum NavigationAction {
    PREVIOUS = -1,
    NEXT = 1,
}

export type DefinedRange = {
    startDate: Dayjs;
    endDate: Dayjs;
    label: string;
};
