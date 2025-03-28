import { fetchStrapiData } from '@/utils';
import React, { createContext, useContext, useEffect, useState } from 'react';

const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const [countries, setCountries] = useState([]);
  const [projectCategories, setProjectCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        const countriesRes = await fetchStrapiData('/countries', {
          'pagination[pageSize]': 500,
        });

        const projectCategoryRes = await fetchStrapiData(
          '/project-type-categories',
          {
            populate: 'project_types',
          }
        );

        if (countriesRes?.data) setCountries(countriesRes.data);
        if (projectCategoryRes?.data)
          setProjectCategories(projectCategoryRes.data);
      } catch (err) {
        console.error('Failed to fetch context data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchInitialData();
  }, []);

  return (
    <AppContext.Provider
      value={{
        countries,
        projectCategories,
        loading,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => useContext(AppContext);
