"use client";

import { useState, type ChangeEvent, type FormEvent } from "react";
import { notify } from "@/lib/toast";

const emptyForm = { name: "", email: "", subject: "", message: "" };

export default function Contact() {
  const [formData, setFormData] = useState(emptyForm);
  const [busy, setBusy] = useState(false);

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setBusy(true);
    try {
      const res = await fetch("/api/users/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (data) {
        notify({
          title: "Message Sent",
          description: "Your message was sent successfully, we'll reply to you soon",
          status: "success",
        });
      } else {
        notify({
          title: "Message failed to send",
          description: "Something went wrong on our end, retry in a few minutes",
          status: "warning",
        });
      }
    } catch (error) {
      notify({
        title: "Message failed to send",
        description: "Something went wrong on our end " + (error as Error).message,
        status: "warning",
      });
    } finally {
      setFormData(emptyForm);
      setBusy(false);
    }
  };

  return (
    <div className="mx-[7%] flex flex-col items-center justify-center gap-3 px-[3%] py-[12%] md:flex-row">
      <h1 className="flex-1 text-2xl font-normal md:text-2xl lg:text-4xl">Get in touch with us</h1>
      <div className="w-full flex-1 rounded-md border bg-gray-900 px-3 py-7 text-white">
        <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
          <div>
            <label htmlFor="contact-name" className="mb-2">Your Name</label>
            <input id="contact-name" type="text" name="name" autoComplete="name" className="form-field" placeholder="Enter Your Name" onChange={handleChange} value={formData.name} required />
          </div>
          <div>
            <label htmlFor="contact-email" className="mb-2">Your Email</label>
            <input id="contact-email" type="email" name="email" autoComplete="email" className="form-field" placeholder="Enter Your Email" onChange={handleChange} value={formData.email} required />
          </div>
          <div>
            <label htmlFor="contact-subject" className="mb-2">Subject</label>
            <input id="contact-subject" type="text" name="subject" className="form-field" placeholder="Subject" onChange={handleChange} value={formData.subject} required />
          </div>
          <div>
            <label htmlFor="contact-message" className="mb-2">Message</label>
            <textarea id="contact-message" className="form-field min-h-28" name="message" placeholder="Message goes here" onChange={handleChange} value={formData.message} required />
          </div>
          <button type="submit" disabled={busy} aria-busy={busy} className="btn btn-primary w-full rounded-lg">
            {busy ? "Sending…" : "Send"}
          </button>
        </form>
      </div>
    </div>
  );
}
