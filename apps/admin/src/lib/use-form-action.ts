"use client";

import { useActionState, useTransition, type FormEvent } from "react";

/**
 * Like useActionState, but returns an onSubmit handler instead of a form action.
 * React 19 resets uncontrolled forms after a `<form action>` runs — even when the action returns an error —
 * which wipes what the user typed. Submitting via onSubmit + startTransition keeps the inputs intact.
 *
 * Usage: const [state, onSubmit, pending] = useFormAction(action, initialState); <form onSubmit={onSubmit}>
 */
export function useFormAction<State>(
  action: (prev: State, formData: FormData) => Promise<State>,
  initialState: Awaited<State>,
) {
  const [state, dispatch, pending] = useActionState(action, initialState);
  const [transitionPending, startTransition] = useTransition();

  function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const submitter = (event.nativeEvent as SubmitEvent).submitter as HTMLElement | null;
    const formData = new FormData(event.currentTarget, submitter);
    startTransition(() => dispatch(formData));
  }

  return [state, onSubmit, pending || transitionPending] as const;
}
