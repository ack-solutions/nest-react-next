import { useEffect, useRef } from 'react';

export type EffectReturn = void | (() => void);
export type AsyncEffectReturn = Promise<EffectReturn>;
export type Effect = () => EffectReturn | AsyncEffectReturn;

/**
 * Runs `effect` only after it has been triggered `skip` times.
 * - Default `skip=1` skips the initial mount, then runs on the first change.
 * - Supports cleanup and async effects.
 * - Safe with React 18 Strict Mode (dev double-mount).
 */
export function useEffectAfter(
    effect: Effect,
    deps: React.DependencyList,
    skip = 1
): void {
    const hitsRef = useRef(0);
    const initialSkip = useRef(skip).current; // freeze the chosen skip at first render

    useEffect(() => {
        hitsRef.current += 1;
        if (hitsRef.current <= initialSkip) return;

        let cleanup: (() => void) | void;
        let cancelled = false;

        const maybe = effect();

        // Handle async effect that returns a (possibly async) cleanup
        if (maybe && typeof (maybe as Promise<EffectReturn>).then === 'function') {
            (maybe as Promise<EffectReturn>).then((c) => {
                if (!cancelled) cleanup = c;
            });
        } else {
            cleanup = maybe as EffectReturn;
        }

        return () => {
            cancelled = true;
            if (typeof cleanup === 'function') cleanup();
        };
        // We intentionally rely on caller-provided deps.
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, deps);
}

/** Convenience alias for the common case: skip mount only. */
export const useUpdateEffect = (effect: Effect, deps: React.DependencyList) =>
    useEffectAfter(effect, deps, 1);
