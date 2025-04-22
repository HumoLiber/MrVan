import { GetStaticProps } from 'next';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import Head from 'next/head';
import { useState } from 'react';
import FormInput from '../../components/FormInput';
import Layout from '../../components/Layout';
import Link from 'next/link';

export default function DelegatingPrivateOnboarding() {
  const { t } = useTranslation('common');
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    address: '',
    idNumber: '',
    camperMake: '',
    camperModel: '',
    camperYear: '',
    camperPlate: '',
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

  return (
    <Layout>
      <Head>
        <title>Private Owner Onboarding | MrVan</title>
        <meta name="description" content="Register your private camper with MrVan" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <section className="py-20">
        <div className="container-custom">
          <div className="max-w-2xl mx-auto bg-white rounded-xl shadow-md overflow-hidden">
            <div className="p-8">
              <h1 className="text-3xl font-bold text-center text-gray-900 mb-6">
                🚐 Private Owner Registration
              </h1>
              <p className="text-gray-600 mb-8 text-center">
                Register your camper with MrVan and start earning passive income.
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
                    label="Home Address"
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
                  
                  <h2 className="text-xl font-semibold text-indigo-600 mt-8 mb-4">Camper Information</h2>
                  
                  <FormInput
                    id="camperMake"
                    name="camperMake"
                    label="Camper Make"
                    value={formData.camperMake}
                    onChange={handleChange}
                    required
                  />
                  
                  <FormInput
                    id="camperModel"
                    name="camperModel"
                    label="Camper Model"
                    value={formData.camperModel}
                    onChange={handleChange}
                    required
                  />
                  
                  <FormInput
                    id="camperYear"
                    name="camperYear"
                    type="number"
                    label="Year of Manufacture"
                    value={formData.camperYear}
                    onChange={handleChange}
                    required
                  />
                  
                  <FormInput
                    id="camperPlate"
                    name="camperPlate"
                    label="License Plate"
                    value={formData.camperPlate}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="mt-8 flex items-center justify-between">
                  <Link href="/signup/" className="text-blue-500 hover:text-blue-700">
                    {t('back_to_signup')}
                  </Link>
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