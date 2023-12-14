import React, { useEffect, useState } from 'react';
import { Bar } from 'react-chartjs-2';
import axios from 'axios';
import Layout from '../layout';
import { CategoryScale } from 'chart.js'; 
import  Chart  from 'chart.js/auto';
Chart.register(CategoryScale);

const BarChartByBrand = () => {
  const [chartData, setChartData] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('https://localhost:7200/api/CsvBrandCount/GetBrandCountCsvData');
        const data = response.data;

        console.log('Data:', data);

        if (data && data.length > 0) {
          const labelsCount = data.map((item) => item.brand);
          const counts = data.map((item) => item.countOfCars);

          setChartData({
            labels: labelsCount,
            datasets: [
              {
                label: 'Count of Cars',
                data: counts,
                backgroundColor: 'rgba(255, 99, 132, 0.6)',
                borderColor: 'rgba(255, 99, 132, 1)',
                borderWidth: 1,
              },
            ],
          });
        } else {
          console.error('Data is empty or undefined.');
        }
      } catch (error) {
        console.error('Error fetching data:', error);
        setError('Error fetching data. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }

  return (
    <Layout>
      <h2>Brands Report</h2>
      <div style={{ width: '80vw', height: '75vh' }}>
        <Bar
          data={{
            labels: chartData.labels,
            datasets: chartData.datasets,
          }}
          options={{
            scales: {
              x: {
                type: 'category',
                title: {
                  display: true,
                  text: 'Brand',
                },
              },
              y: {
                beginAtZero: true,
                title: {
                  display: true,
                  text: 'Count of Cars',
                },
              },
            },
            maintainAspectRatio: false,
            responsive: true,
          }}
        />
      </div>
    </Layout>
  );
};

export default BarChartByBrand;
