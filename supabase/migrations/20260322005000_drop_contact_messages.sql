-- Contact form now emails via Resend; messages are no longer stored in the database.
drop table if exists public.contact_messages;
