"use client";

import { useEffect, useRef } from "react";
import { useFormAction } from "@/lib/use-form-action";
import { Send } from "lucide-react";
import Container from "@/components/Container";
import { sendContactMessage, type ContactState } from "@/app/contact/actions";

const initialState: ContactState = {};
const inputClass =
  "w-full rounded-2xl border border-border bg-background px-4 py-3 text-sm text-cream placeholder:text-muted/70 outline-none transition focus:border-gold";

export default function ContactForm() {
  const [state, formAction, pending] = useFormAction(sendContactMessage, initialState);
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (state.success) formRef.current?.reset();
  }, [state]);

  return (
    <section id="message" className="pb-14 lg:pb-20">
      <Container>
        <div className="rounded-[2rem] bg-surface-elevated p-6 sm:p-8 lg:rounded-[2.5rem] lg:p-12">
          <p className="text-xs tracking-[0.25em] text-gold uppercase">Send a message</p>
          <h2 className="mt-2 font-serif text-3xl text-cream lg:text-4xl">We&apos;d love to hear from you</h2>

          <form ref={formRef} onSubmit={formAction} className="mt-8 grid gap-4 sm:grid-cols-2 lg:gap-5">
            <input
              type="text"
              name="website"
              tabIndex={-1}
              autoComplete="off"
              className="hidden"
              aria-hidden="true"
            />
            <label className="block">
              <span className="mb-1.5 block text-xs tracking-wide text-muted uppercase">Name *</span>
              <input name="name" required maxLength={120} autoComplete="name" className={inputClass} />
            </label>
            <label className="block">
              <span className="mb-1.5 block text-xs tracking-wide text-muted uppercase">Email *</span>
              <input name="email" type="email" required maxLength={200} autoComplete="email" className={inputClass} />
            </label>
            <label className="block sm:col-span-2">
              <span className="mb-1.5 block text-xs tracking-wide text-muted uppercase">Phone</span>
              <input name="phone" type="tel" maxLength={40} autoComplete="tel" className={inputClass} />
            </label>
            <label className="block sm:col-span-2">
              <span className="mb-1.5 block text-xs tracking-wide text-muted uppercase">Message *</span>
              <textarea name="message" required rows={5} maxLength={4000} className={`${inputClass} resize-y`} />
            </label>

            <div className="flex flex-col gap-3 sm:col-span-2 sm:flex-row sm:items-center">
              <button
                type="submit"
                disabled={pending}
                className="inline-flex items-center justify-center gap-2 rounded-full bg-gold px-6 py-3 text-sm font-medium text-background transition hover:bg-gold-soft disabled:opacity-60"
              >
                <Send size={16} />
                {pending ? "Sending…" : "Send message"}
              </button>
              <p role="status" aria-live="polite" className="text-sm">
                {state.error ? <span className="text-red-400">{state.error}</span> : null}
                {state.success ? <span className="text-gold">{state.success}</span> : null}
              </p>
            </div>
          </form>
        </div>
      </Container>
    </section>
  );
}
