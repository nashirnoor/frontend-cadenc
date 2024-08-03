import React from 'react';
import { useForm } from 'react-hook-form';
import axios from 'axios'; 
import TextInput from "../users/components/TextInput";
import CustomButton from '../users/components/Custombutton';
import { useNavigate } from 'react-router-dom';
import { BASE_URL } from '../utils/config';

const CompanyForm = () => {
    const { register, handleSubmit, reset, formState: { errors } } = useForm();
    const navigate = useNavigate();
    const onSubmit = async (data) => {
        try {
            const formData = new FormData();
            for (const key in data) {
                if (key === 'company_logo') {
                    formData.append(key, data[key][0]); // append the file object itself
                } else {
                    formData.append(key, data[key]);
                }
            }
    
            const jwt_access = JSON.parse(localStorage.getItem('access'));
            console.log(jwt_access)
            const response = await axios.post(`${BASE_URL}/api/v1/auth/company-profile/`, formData, {
                headers: {
                    'Authorization': `Bearer ${jwt_access}`,
                    'Content-Type': 'multipart/form-data'
                }
            });
    
    
            if (response.status === 201) {
                const companyProfileId = response.data.id; // Adjust according to the actual response structure
                console.log("Company Profile ID:", companyProfileId);
                reset();
                navigate('/recruiter-home'); // Redirect to the recruiter-home path
            } else {
                console.error("Unexpected response status:", response.status);
            }
        } catch (error) {
            console.error("Error submitting form:", error);
            // Handle error
        }
    };
    const validateNotEmpty = (value) => value.trim() !== '' || "This field cannot be empty";
    
    const validateImage = (fileList) => {
        if (fileList.length === 0) return "Company Profile Photo is required";
        const file = fileList[0];
        const validTypes = ['image/jpeg', 'image/png', 'image/gif'];
        if (!validTypes.includes(file.type)) return "Please upload a valid image file (JPEG or PNG)";
        if (file.size > 5 * 1024 * 1024) return "File size should be less than 5MB";
        return true;
    };
    

    return (
        <div className="max-w-md mx-auto p-6 bg-white rounded-2xl shadow-xl">
            <h3 className="text-lg font-semibold leading-6 text-gray-900 mb-4">
                Complete the Company Profile to continue
            </h3>
            <form className="w-full flex flex-col gap-5" onSubmit={handleSubmit(onSubmit)} encType="multipart/form-data">
                <TextInput
                    name='company_name'
                    label='Company Name'
                    type='text'
                    register={register("company_name", { 
                        required: "Company Name is required",
                        validate: validateNotEmpty
                    })}
                    error={errors.company_name ? errors.company_name.message : ""}
                />
                <TextInput
                    name='company_location'
                    label='Location/Address'
                    placeholder='eg. California'
                    type='text'
                    register={register("company_location", { 
                        required: "Address is required",
                        validate: validateNotEmpty
                    })}
                    error={errors.company_location ? errors.company_location.message : ""}
                />
                <TextInput
                    name='contact_number'
                    label='Contact'
                    placeholder='Phone Number'
                    type='text'
                    register={register("contact_number", { 
                        required: "Contact is required!",
                        validate: validateNotEmpty,
                        pattern: {
                            value: /^[0-9+\-\s()]*$/,
                            message: "Invalid phone number format"
                        }
                    })}
                    error={errors.contact_number ? errors.contact_number.message : ""}
                />
                <TextInput
                    name='email_address'
                    label='Email'
                    placeholder='Company Email'
                    type='email'
                    register={register("email_address", { 
                        required: "Email is required!", 
                        validate: validateNotEmpty,
                        pattern: {
                            value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/,
                            message: "Invalid email address"
                        }
                    })}
                    error={errors.email_address ? errors.email_address.message : ""}
                />
                <TextInput
                    name='company_strength'
                    label='Company Strength'
                    placeholder='Company Strength'
                    type='text'
                    register={register("company_strength", { 
                        required: "Company Strength is required!",
                        validate: validateNotEmpty,
                        pattern: {
                            value: /^[0-9]+$/,
                            message: "Company Strength must be a number"
                        }
                    })}
                    error={errors.company_strength ? errors.company_strength.message : ""}
                />
                 <TextInput
                    name='about'
                    label='About company'
                    placeholder='About company'
                    type='text'
                    register={register("about", { 
                        required: "Company about section is required!",
                       
                    })}
                    error={errors.about ? errors.about.message : ""}
                />
                <div className='w-full mt-2'>
                    <label className='text-gray-600 text-sm mb-1'>Company Profile Photo</label>
                    <input
                        type='file'
                        accept='image/*'
                        id='fileInput'
                        {...register("company_logo", { 
                            required: "Company Profile Photo is required",
                            validate: validateImage
                        })}
                        className='w-full border border-gray-300 rounded-md p-2'
                    />
                    {errors.company_logo && (
                        <span className='text-xs text-red-500 mt-0.5'>
                            {errors.company_logo.message}
                        </span>
                    )}
                </div>
                <div className='mt-4'>
                    <CustomButton
                        type='submit'
                        containerStyles='inline-flex justify-center rounded-md border border-transparent bg-blue-600 px-8 py-2 text-sm font-medium text-white hover:bg-[#1d4fd846] hover:text-[#1d4fd8] focus:outline-none '
                        title={"Submit"}
                    />
                </div>
            </form>
        </div>
    );
};

export default CompanyForm;