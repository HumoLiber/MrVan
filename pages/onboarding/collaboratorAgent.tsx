import { GetStaticProps } from 'next';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import Head from 'next/head';
import { useState } from 'react';
import FormInput from '../../app/components/FormInput';
import FormSelect from '../../app/components/FormSelect';
import Layout from '../../app/components/Layout';

export default function CollaboratorAgentOnboarding() {
  const { t } = useTranslation('common');
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    address: '',
    idNumber: '',
    experienceYears: '',
    region: '',
    languages: '',
    referenceContact: '',
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

  const regionOptions = [
    { value: 'barcelona', label: 'Barcelona' },
    { value: 'madrid', label: 'Madrid' },
    { value: 'valencia', label: 'Valencia' },
    { value: 'andalusia', label: 'Andalusia' },
    { value: 'basque', label: 'Basque Country' },
    { value: 'catalonia', label: 'Catalonia' },
    { value: 'other', label: 'Other (specify in notes)' },
  ];

  return (
    <Layout>
      <Head>
        <title>Agent Onboarding | MrVan</title>
        <meta name="description" content="Register as an agent with MrVan" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <section className="py-20">
        <div className="container-custom">
          <div className="max-w-2xl mx-auto bg-white rounded-xl shadow-md overflow-hidden">
            <div className="p-8">
              <h1 className="text-3xl font-bold text-center text-gray-900 mb-6">
                👨‍💼 Agent Registration
              </h1>
              <p className="text-gray-600 mb-8 text-center">
                Become an official MrVan agent and connect camper owners with renters.
              </p>

              <form onSubmit={handleSubmit}>
                <div className="space-y-4">
                  <h2 className="text-xl font-semibold text-indigo-600 mt-6 mb-4">Personal Information</h2>
                  
                  <FormInput
                    id="fullName"
                    name="fullName"
                    label="Full Name"
                    value={formData.fullName}
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
                    label="Address"
                    value={formData.address}
                    onChange={handleChange}
                    required
                  />
                  
                  <FormInput
                    id="idNumber"
                    name="idNumber"
                    label="ID/Passport Number"
                    value={formData.idNumber}
                    onChange={handleChange}
                    required
                  />
                  
                  <h2 className="text-xl font-semibold text-indigo-600 mt-8 mb-4">Professional Information</h2>
                  
                  <FormInput
                    id="experienceYears"
                    name="experienceYears"
                    type="number"
                    label="Years of Experience in Tourism"
                    value={formData.experienceYears}
                    onChange={handleChange}
                    required
                  />
                  
                  <FormSelect
                    id="region"
                    name="region"
                    label="Region of Operation"
                    value={formData.region}
                    onChange={handleChange}
                    options={regionOptions}
                    required
                  />
                  
                  <FormInput
                    id="languages"
                    name="languages"
                    label="Languages Spoken (comma separated)"
                    value={formData.languages}
                    onChange={handleChange}
                    required
                  />
                  
                  <FormInput
                    id="referenceContact"
                    name="referenceContact"
                    label="Professional Reference Contact (optional)"
                    value={formData.referenceContact}
                    onChange={handleChange}
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