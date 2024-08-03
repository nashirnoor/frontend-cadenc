import React, { useEffect, useState } from "react";
import CompanyCard from "./CompanyCard";
import CustomButton from "./Custombutton";
import axios from "axios";
import Header from "./Header";
import { BASE_URL } from "../../utils/config";


const Companies = () => {
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(false);

  useEffect(() => {
    const fetchCompanies = async () => {
      try {
        const response = await axios.get(`${BASE_URL}/api/v1/auth/companies/`);
        console.log('Fetched Companies:', response.data);
        setCompanies(response.data);
        setLoading(false);
      } catch (err) {
        console.error('Error details:', err);
        setError(err.response?.data?.message || err.message || 'An unknown error occurred');
        setLoading(false);
      }
    };

    fetchCompanies();
  }, []);

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
    setShowSuggestions(true);
  };

  const handleClearSearch = () => {
    setSearchQuery("");
    setShowSuggestions(false);
  };

  const filteredCompanies = companies.filter(company =>
    company.company_name && company.company_name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSuggestionClick = (suggestion) => {
    setSearchQuery(suggestion);
    setShowSuggestions(false);
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  const handleShowMore = () => {};

  return (
    <div className='w-full'>
      <Header />
      <div className='container mx-auto flex flex-col gap-5 2xl:gap-10 px-5 md:px-0 py-6 bg-[#f7fdfd]'>
        <div className='flex items-center justify-between mb-4'>
          <div className='relative w-80'>
            <input
              type='text'
              value={searchQuery}
              onChange={handleSearchChange}
              placeholder='Search companies...'
              className='px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600 w-full'
            />
            {searchQuery && (
              <button
                onClick={handleClearSearch}
                className='absolute right-2 top-2 px-2 py-1 bg-gray-200 text-gray-600 rounded-md hover:bg-gray-300 focus:outline-none'
              >
                &#10005; {/* This is the 'X' symbol */}
              </button>
            )}
            {showSuggestions && searchQuery && (
              <div className='absolute z-10 bg-white border border-gray-300 rounded-md mt-1 w-full max-h-40 overflow-y-auto'>
                {filteredCompanies.map((company) => (
                  <div
                    key={company.id}
                    onClick={() => handleSuggestionClick(company.company_name)}
                    className='px-4 py-2 cursor-pointer hover:bg-gray-200'
                  >
                    {company.company_name}
                  </div>
                ))}
              </div>
            )}
          </div>
          <p className='text-sm md:text-base'>
            Showing: <span className='font-semibold'>{filteredCompanies.length}</span> Companies
            Available
          </p>
        </div>
        <div className='w-full flex flex-col gap-6'>
          {filteredCompanies.map((company) => (
            <div key={company.id}>
              <CompanyCard company={company} />
              {/* For debugging: */}
              {/* <div>{company.company_name}</div> */}
            </div>
          ))}
          {filteredCompanies.length === 0 && <p>No companies found.</p>}
        </div>
        {false && ( // Temporary disable pagination for debugging
          <div className='w-full flex items-center justify-center pt-16'>
            <CustomButton
              onClick={handleShowMore}
              title='Load More'
              containerStyles={`text-blue-600 py-1.5 px-5 focus:outline-none hover:bg-blue-700 hover:text-white rounded-full text-base border border-blue-600`}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default Companies;