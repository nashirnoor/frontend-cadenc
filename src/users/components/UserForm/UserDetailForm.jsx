import React, { useState } from 'react';
import UserProfileForm from './UserProfileForm';
import ExperienceForm from './ExperienceForm';
import EducationForm from './EducationForm';

const UserDetailForm = () => {
  const [step, setStep] = useState(1);

  const handleProfileSubmit = (profileData) => {
    console.log('Profile Data:', profileData);
    setStep(2); // Move to the next form
  };

  const handleExperienceSubmit = (experienceData) => {
    console.log('Experience Data:', experienceData);
    setStep(3); // Move to the next form
  };

  const handleEducationSubmit = (educationData) => {
    console.log('Education Data:', educationData);
    // Final submission logic can be handled here
  };

  const handleSkipExperience = () => {
    setStep(3); // Skip to the education form
  };

  const handleSkipEducation = () => {
    console.log('Skipping education section');
    // Final submission or additional logic can be handled here
  };

  return (
    <div>
      {step === 1 && <UserProfileForm onSubmit={handleProfileSubmit} />}
      {step === 2 && (
        <ExperienceForm onSubmit={handleExperienceSubmit} onSkip={handleSkipExperience} />
      )}
      {step === 3 && (
        <EducationForm onSubmit={handleEducationSubmit} onSkip={handleSkipEducation} />
      )}
    </div>
  );
};

export default UserDetailForm;
