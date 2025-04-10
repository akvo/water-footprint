import React, { useState } from 'react';
import { Send, Loader2 } from 'lucide-react';
import { env } from '@/utils';

const ContactPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });
  const [formErrors, setFormErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [submitError, setSubmitError] = useState(null);

  const validateForm = () => {
    const errors = {};
    if (!formData.name.trim()) {
      errors.name = 'Name is required';
    }

    if (!formData.email.trim()) {
      errors.email = 'Email is required';
    } else if (
      !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(formData.email)
    ) {
      errors.email = 'Invalid email address';
    }

    if (!formData.subject.trim()) {
      errors.subject = 'Subject is required';
    }

    if (!formData.message.trim()) {
      errors.message = 'Message is required';
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (formErrors[name]) {
      setFormErrors((prev) => ({
        ...prev,
        [name]: null,
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    setSubmitError(null);

    try {
      const response = await fetch(
        `${env('NEXT_PUBLIC_BACKEND_URL')}/api/email`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            data: {
              name: formData.name,
              email: formData.email,
              subject: formData.subject,
              message: formData.message,
            },
          }),
        }
      );

      if (!response.ok) {
        const errorData = await response.text();
        console.error('Error response:', errorData);
        throw new Error('Failed to send email');
      }

      await response.json();

      setSubmitSuccess(true);
      setFormData({
        name: '',
        email: '',
        subject: '',
        message: '',
      });
    } catch (error) {
      console.error('Error submitting form:', error);
      setSubmitError(
        'Something went wrong. Please try again or contact us directly.'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-gray-50">
      <div className="max-w-7xl mx-auto py-16 px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold text-gray-900 sm:text-5xl">
            Contact Us
          </h1>
          <p className="mt-4 text-xl text-gray-600 max-w-2xl mx-auto">
            To join the network, or to contact us about anything else, please
            use the form below
          </p>
        </div>

        <div className="grid grid-cols-1 gap-12">
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-md p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">
                Send Us a Message
              </h2>

              {submitSuccess ? (
                <div className="bg-green-50 border-l-4 border-green-500 p-4 mb-6">
                  <div className="flex">
                    <div className="flex-shrink-0">
                      <svg
                        className="h-5 w-5 text-green-400"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fillRule="evenodd"
                          d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </div>
                    <div className="ml-3">
                      <p className="text-sm text-green-700">
                        Thank you for your message! We&apos;ll get back to you
                        as soon as possible.
                      </p>
                    </div>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  {submitError && (
                    <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6">
                      <div className="flex">
                        <div className="flex-shrink-0">
                          <svg
                            className="h-5 w-5 text-red-400"
                            viewBox="0 0 20 20"
                            fill="currentColor"
                          >
                            <path
                              fillRule="evenodd"
                              d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                              clipRule="evenodd"
                            />
                          </svg>
                        </div>
                        <div className="ml-3">
                          <p className="text-sm text-red-700">{submitError}</p>
                        </div>
                      </div>
                    </div>
                  )}

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label
                        htmlFor="name"
                        className="block text-sm font-medium text-gray-700"
                      >
                        Full Name<span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        className={`mt-1 block w-full px-3 py-2 border ${
                          formErrors.name ? 'border-red-500' : 'border-gray-300'
                        } rounded-md shadow-sm focus:outline-none focus:ring-[#0DA2D7] focus:border-[#0DA2D7]`}
                      />
                      {formErrors.name && (
                        <p className="mt-1 text-sm text-red-600">
                          {formErrors.name}
                        </p>
                      )}
                    </div>

                    <div>
                      <label
                        htmlFor="email"
                        className="block text-sm font-medium text-gray-700"
                      >
                        Email Address<span className="text-red-500">*</span>
                      </label>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        className={`mt-1 block w-full px-3 py-2 border ${
                          formErrors.email
                            ? 'border-red-500'
                            : 'border-gray-300'
                        } rounded-md shadow-sm focus:outline-none focus:ring-[#0DA2D7] focus:border-[#0DA2D7]`}
                      />
                      {formErrors.email && (
                        <p className="mt-1 text-sm text-red-600">
                          {formErrors.email}
                        </p>
                      )}
                    </div>
                  </div>

                  <div>
                    <label
                      htmlFor="subject"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Subject<span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      id="subject"
                      name="subject"
                      value={formData.subject}
                      onChange={handleChange}
                      className={`mt-1 block w-full px-3 py-2 border ${
                        formErrors.subject
                          ? 'border-red-500'
                          : 'border-gray-300'
                      } rounded-md shadow-sm focus:outline-none focus:ring-[#0DA2D7] focus:border-[#0DA2D7]`}
                    />
                    {formErrors.subject && (
                      <p className="mt-1 text-sm text-red-600">
                        {formErrors.subject}
                      </p>
                    )}
                  </div>

                  <div>
                    <label
                      htmlFor="message"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Message<span className="text-red-500">*</span>
                    </label>
                    <textarea
                      id="message"
                      name="message"
                      rows={5}
                      value={formData.message}
                      onChange={handleChange}
                      className={`mt-1 block w-full px-3 py-2 border ${
                        formErrors.message
                          ? 'border-red-500'
                          : 'border-gray-300'
                      } rounded-md shadow-sm focus:outline-none focus:ring-[#0DA2D7] focus:border-[#0DA2D7]`}
                    ></textarea>
                    {formErrors.message && (
                      <p className="mt-1 text-sm text-red-600">
                        {formErrors.message}
                      </p>
                    )}
                  </div>

                  <div>
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full inline-flex justify-center items-center px-6 py-3 border border-transparent rounded-md shadow-sm text-base font-medium text-white bg-[#0DA2D7] hover:bg-[#0B8DB8] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#0DA2D7] disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                    >
                      {isSubmitting ? (
                        <>
                          <Loader2 className="animate-spin -ml-1 mr-2 h-5 w-5" />
                          Sending...
                        </>
                      ) : (
                        <>
                          <Send className="-ml-1 mr-2 h-5 w-5" />
                          Send Message
                        </>
                      )}
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactPage;
