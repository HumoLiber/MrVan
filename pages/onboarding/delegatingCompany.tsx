import { GetStaticProps } from 'next';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import Head from 'next/head';
import { useState } from 'react';
import FormInput from '../../components/FormInput';
import FormSelect from '../../components/FormSelect';
import Layout from '../../components/Layout';
import supabase from '../../lib/supabase';
import { useRouter } from 'next/router';
import Link from 'next/link';

export default function DelegatingCompanyOnboarding() {
  const { t } = useTranslation('common');
  const router = useRouter();
  const [formData, setFormData] = useState({
    companyName: '',
    registrationNumber: '',
    contactPersonName: '',
    email: '',
    phone: '',
    address: '',
    delegationModel: '',
    camperMake: '',
    camperModel: '',
    camperYear: '',
    camperPlate: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [formSuccess, setFormSuccess] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Скидаємо статуси
    setFormError(null);
    setFormSuccess(null);
    setIsSubmitting(true);
    
    try {
      // 1. Зберігаємо дані про компанію в таблицю users
      const { data: userData, error: userError } = await supabase
        .from('users')
        .insert([{
          email: formData.email,
          name: formData.contactPersonName,
          role: 'company',
          phone: formData.phone,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }])
        .select('id')
        .single();
      
      if (userError) {
        throw new Error(`Помилка при збереженні даних компанії: ${userError.message}`);
      }
      
      const userId = userData.id;
      console.log('Компанію успішно зареєстровано з ID:', userId);
      
      // 2. Створюємо транспортний засіб
      const { data: vehicleData, error: vehicleError } = await supabase
        .from('vehicles')
        .insert([{
          owner_id: userId,
          make: formData.camperMake,
          model: formData.camperModel,
          year: parseInt(formData.camperYear) || new Date().getFullYear(),
          plate: formData.camperPlate,
          delegation_model: formData.delegationModel.replace('-', '_'), // конвертуємо 'service-only' в 'service_only'
          status: 'draft',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }])
        .select('id')
        .single();
      
      if (vehicleError) {
        throw new Error(`Помилка при збереженні даних транспортного засобу: ${vehicleError.message}`);
      }
      
      console.log('Транспортний засіб успішно зареєстровано з ID:', vehicleData.id);
      
      // 3. Створюємо угоду для підписання
      const { data: agreementData, error: agreementError } = await supabase
        .from('agreements')
        .insert([{
          user_id: userId,
          agreement_type: `company_${formData.delegationModel}`,
          signature_status: 'pending',
          created_at: new Date().toISOString()
        }])
        .select('id');
      
      if (agreementError) {
        console.warn('Застереження: не вдалося створити угоду:', agreementError);
      }
      
      // Успіх! Показуємо повідомлення і перенаправляємо
      setFormSuccess('Дані успішно збережено! Перенаправляємо на наступний крок...');
      
      // Затримка перед перенаправленням
      setTimeout(() => {
        router.push('/onboarding/success');
      }, 2000);
      
    } catch (error) {
      console.error('Помилка при обробці форми:', error);
      setFormError(error instanceof Error ? error.message : 'Сталася невідома помилка при збереженні даних');
    } finally {
      setIsSubmitting(false);
    }
  };

  const delegationOptions = [
    { value: 'service-only', label: 'Service Only' },
    { value: 'partial-help', label: 'Partial Help' },
    { value: 'full-delegation', label: 'Full Delegation' },
  ];

  return (
    <Layout>
      <Head>
        <title>Company Onboarding | MrVan</title>
        <meta name="description" content="Register your company's campers with MrVan" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <section className="py-20">
        <div className="container-custom">
          <div className="max-w-2xl mx-auto bg-white rounded-xl shadow-md overflow-hidden">
            <div className="p-8">
              <h1 className="text-3xl font-bold text-center text-gray-900 mb-6">
                🏢 Company Registration
              </h1>
              <p className="text-gray-600 mb-8 text-center">
                Register your company and camper fleet with MrVan.
              </p>
              
              {formError && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md mb-4">
                  {formError}
                </div>
              )}
              
              {formSuccess && (
                <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-md mb-4">
                  {formSuccess}
                </div>
              )}

              <form onSubmit={handleSubmit}>
                <div className="space-y-4">
                  <h2 className="text-xl font-semibold text-indigo-600 mt-6 mb-4">Company Information</h2>
                  
                  <FormInput
                    id="companyName"
                    name="companyName"
                    label="Company Name"
                    value={formData.companyName}
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
                  
                  <FormSelect
                    id="delegationModel"
                    name="delegationModel"
                    label="Delegation Model"
                    value={formData.delegationModel}
                    onChange={handleChange}
                    options={delegationOptions}
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
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? 'Збереження...' : 'Continue'}
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