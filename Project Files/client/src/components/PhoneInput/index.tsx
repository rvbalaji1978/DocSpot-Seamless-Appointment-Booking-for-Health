import 'react-phone-input-2/lib/material.css';
import PhoneInput from 'react-phone-input-2';
import { removeDashAndSpace } from '../../utils';
import { useEffect, useState } from 'react';
import axios from 'axios';

interface PhoneNumberProps {
  value: string;
  name: string;
  onChange?: any;
  countryCode?: string;
  variant?: 'standard' | 'outlined' | 'filled';
  label?: string;
  formik?: any;
  authScreens?: boolean;
  disabled?: boolean;
  readOnly?: boolean;
  showErrorMessage?: boolean;
}

const PrimaryPhoneInput = ({
  value,
  name,
  onChange,
  countryCode,
  variant,
  label,
  formik,
  authScreens,
  disabled,
  readOnly,
  showErrorMessage,
}: PhoneNumberProps) => {
  const [defaultCountry, setDefaultCountry] = useState<string>('pk');
  const [loader, setLoader] = useState(false);

  const options = {
    method: 'GET',
    url: 'https://geolocation-db.com/json/67273a00-5c4b-11ed-9204-d161c2da74ce',
  };

  const getCountry = async () => {
    try {
      setLoader(true);
      const response = await axios.request(options);
      const code = response?.data?.country_code?.toLowerCase();
      setDefaultCountry(code !== 'not found' ? code : 'pk');
    } catch (error) {
      console.warn('Country detection failed', error);
      setDefaultCountry('pk');
    } finally {
      setLoader(false);
    }
  };

  useEffect(() => {
    if (authScreens) {
      getCountry();
    }
  }, [authScreens]);

  return (
    <div style={{ marginBottom: '1rem' }}>
      {label && (
        <label
          htmlFor={name}
          style={{
            fontSize: '14px',
            marginBottom: '4px',
            display: 'block',
            fontWeight: 500,
          }}
        >
          {label}
        </label>
      )}
      <PhoneInput
        country={countryCode ? countryCode.toLowerCase() : defaultCountry}
        value={value}
        onChange={(e: any) => {
          onChange
            ? onChange(e)
            : formik?.setFieldValue(name, removeDashAndSpace(e));
        }}
        inputProps={{
          name: name,
          readOnly: readOnly,
          disabled: disabled,
          onBlur: formik?.handleBlur,
          style: {
            cursor: readOnly ? 'not-allowed' : 'text',
            background: '#fff',
            height: '50px',
            width: '100%',
            border:
              formik?.touched[name] && formik?.errors[name]
                ? '1px solid red'
                : '1px solid #ccc',
            borderRadius: '4px',
            padding: '10px',
            fontSize: '16px',
          },
        }}
        disableDropdown={loader || disabled}
      />
      {formik?.touched[name] && formik?.errors[name] && !showErrorMessage && (
        <div style={{ color: 'red', fontSize: '12px', marginTop: '4px' }}>
          {formik?.errors[name]}
        </div>
      )}
    </div>
  );
};

export default PrimaryPhoneInput;
