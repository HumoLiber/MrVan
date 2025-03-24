import { GetStaticProps } from 'next';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import Head from 'next/head';
import { useState } from 'react';
import FormInput from '../../app/components/FormInput';
import FormSelect from '../../app/components/FormSelect';
import Layout from '../../app/components/Layout';

export default function CollaboratorAgencyOnboarding() {
  const { t } = useTranslation('common');
  const [formData, setFormData] = useState({
    agencyName: '',
    registrationNumber: '',
    contactPersonName: '',
    email: '',
    phone: '',
    address: '',
    website: '',
    collaborationType: '',
    yearsInBusiness: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Тут буде обробка форми
    console.log(formData);
  };

  const collaborationOptions = [
    { value: 'rentals', label: 'Rentals' },
    { value: 'marketing', label: 'Marketing & Promotion' },
    { value: 'management', label: 'Shared Management' },
    { value: 'maintenance', label: 'Maintenance' },
    { value: 'full-service', label: 'Full Service Partnership' },
  ];

  return (
    <Layout>
      <Head>
        <title>Agency Onboarding | MrVan</title>
        <meta name="description" content="Register your agency as a partner with MrVan" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <section className="py-20">
        <div className="container-custom">
          <div className="max-w-2xl mx-auto bg-white rounded-xl shadow-md overflow-hidden">
            <div className="p-8">
              <h1 className="text-3xl font-bold text-center text-gray-900 mb-6">
                🏪 Agency Registration
              </h1>
              <p className="text-gray-600 mb-8 text-center">
                Partner with MrVan to grow your tourism business.
              </p>

              <form onSubmit={handleSubmit}>
                <div className="space-y-4">
                  <h2 className="text-xl font-semibold text-indigo-600 mt-6 mb-4">Agency Information</h2>
                  
                  <FormInput
                    id="agencyName"
                    name="agencyName"
                    label="Agency Name"
                    value={formData.agencyName}
                    onChange={handleChange}
                    required
                  />
                  
                  <FormInput
                    id="registrationNumber"
                    name="registrationNumber"
                    label="Registration Number"
                    value={formData.registrationNumber}
                    onChange={handleChange}
                    required
                  />
                  
                  <FormInput
                    id="yearsInBusiness"
                    name="yearsInBusiness"
                    type="number"
                    label="Years in Business"
                    value={formData.yearsInBusiness}
                    onChange={handleChange}
                    required
                  />
                  
                  <FormInput
                    id="website"
                    name="website"
                    type="url"
                    label="Website (if available)"
                    value={formData.website}
                    onChange={handleChange}
                  />
                  
                  <FormSelect
                    id="collaborationType"
                    name="collaborationType"
                    label="Type of Collaboration"
                    value={formData.collaborationType}
                    onChange={handleChange}
                    options={collaborationOptions}
                    required
                  />
                  
                  <h2 className="text-xl font-semibold text-indigo-600 mt-8 mb-4">Contact Information</h2>
                  
                  <FormInput
                    id="contactPersonName"
                    name="contactPersonName"
                    label="Contact Person Name"
                    value={formData.contactPersonName}
                    onChange={handleChange}
                    required
                  />
                  
                  <FormInput
                    id="email"
                    name="email"
                    type="email"
                    label="Email Address"
                    value={formData.email}
                    onChange={handleChange}
                    required
                  />
                  
                  <FormInput
                    id="phone"
                    name="phone"
                    type="tel"
                    label="Phone Number"
                    value={formData.phone}
                    onChange={handleChange}
                    required
                  />
                  
                  <FormInput
                    id="address"
                    name="address"
                    label="Business Address"
                    value={formData.address}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="mt-8 flex items-center justify-between">
                  <button
                    type="button"
                    onClick={() => window.history.back()}
                    className="btn-secondary"
                  >
                    Back
                  </button>
                  <button
                    type="submit"
                    className="btn-primary"
                  >
                    Continue
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
}

export const getStaticProps: GetStaticProps = async ({ locale = 'en' }) => {
  return {
    props: {
      ...(await serverSideTranslations(locale, ['common'])),
    },
  };
}; 